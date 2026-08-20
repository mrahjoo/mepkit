import { SecretsManagerClient, GetSecretValueCommand } from "@aws-sdk/client-secrets-manager";

// Configuration
const SECRET_NAME = process.env.AWS_SECRET_NAME || "mepkit/cloudflare";
const DOMAIN = "mepkit.com";
const VERCEL_A_RECORD_IP = "76.76.21.21";
const VERCEL_CNAME_TARGET = "cname.vercel-dns.com";

async function getCloudflareSecrets() {
  const client = new SecretsManagerClient({}); // Uses default AWS credentials
  try {
    const response = await client.send(
      new GetSecretValueCommand({
        SecretId: SECRET_NAME,
      })
    );
    
    if (response.SecretString) {
      return JSON.parse(response.SecretString);
    }
    throw new Error("SecretString is empty");
  } catch (error) {
    console.error("Error retrieving secrets from AWS Secrets Manager:", error);
    throw error;
  }
}

async function updateCloudflareDns(apiToken, zoneId) {
  const headers = {
    "Authorization": `Bearer ${apiToken}`,
    "Content-Type": "application/json",
  };

  const baseUrl = `https://api.cloudflare.com/client/v4/zones/${zoneId}/dns_records`;

  // 1. Fetch existing records to check if they need updating/deleting
  const listResponse = await fetch(`${baseUrl}?name=${DOMAIN},www.${DOMAIN}`, { headers });
  const listData = await listResponse.json();

  if (!listData.success) {
    throw new Error(`Failed to fetch DNS records: ${JSON.stringify(listData.errors)}`);
  }

  const existingRecords = listData.result;

  // Function to upsert a record
  async function upsertRecord(type, name, content) {
    const existing = existingRecords.find(r => r.name === name && r.type === type);
    
    const body = JSON.stringify({
      type,
      name,
      content,
      proxied: true, // Typically proxied in Cloudflare, change to false if you just want DNS only
      ttl: 1
    });

    let url = baseUrl;
    let method = "POST";

    if (existing) {
      if (existing.content === content) {
        console.log(`Record ${type} ${name} -> ${content} is already up to date.`);
        return;
      }
      url = `${baseUrl}/${existing.id}`;
      method = "PUT";
    }

    const response = await fetch(url, { method, headers, body });
    const data = await response.json();

    if (data.success) {
      console.log(`Successfully ${existing ? 'updated' : 'created'} ${type} record for ${name} -> ${content}`);
    } else {
      console.error(`Failed to ${existing ? 'update' : 'create'} ${type} record for ${name}:`, data.errors);
    }
  }

  // Set the A record for the root domain
  await upsertRecord("A", DOMAIN, VERCEL_A_RECORD_IP);
  
  // Set the CNAME for www
  await upsertRecord("CNAME", `www.${DOMAIN}`, VERCEL_CNAME_TARGET);
}

async function main() {
  console.log(`Fetching Cloudflare credentials from AWS Secrets Manager (Secret: ${SECRET_NAME})...`);
  try {
    const secrets = await getCloudflareSecrets();
    
    if (!secrets.apiToken || !secrets.zoneId) {
      throw new Error("Secret must contain 'apiToken' and 'zoneId' properties in JSON.");
    }

    console.log("Credentials retrieved successfully. Updating Cloudflare DNS...");
    await updateCloudflareDns(secrets.apiToken, secrets.zoneId);
    
    console.log("DNS configuration completed successfully.");
  } catch (error) {
    console.error("DNS update failed:", error.message);
    process.exit(1);
  }
}

main();
