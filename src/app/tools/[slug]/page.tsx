import React from 'react';
import fs from 'fs/promises';
import path from 'path';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { ToolRenderer } from '@/components/tools/ToolRenderer';
import { ToolConfig } from '@/lib/tool-schema';
import Script from 'next/script';

interface ToolPageProps {
  params: Promise<{
    slug: string;
  }>;
}

async function getToolConfig(slug: string): Promise<ToolConfig | null> {
  try {
    const filePath = path.join(process.cwd(), 'data', 'tools', `${slug}.json`);
    const fileContents = await fs.readFile(filePath, 'utf8');
    return JSON.parse(fileContents) as ToolConfig;
  } catch (error) {
    return null;
  }
}

export async function generateMetadata({ params }: ToolPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const config = await getToolConfig(resolvedParams.slug);
  
  if (!config) {
    return {
      title: 'Tool Not Found | MEPKit',
    };
  }

  const url = `https://mepkit.com/tools/${resolvedParams.slug}`;

  return {
    title: `${config.title} | MEPKit Engineering Tools`,
    description: config.description,
    keywords: ['MEP engineering', 'engineering tools', 'calculator', config.type, ...config.title.toLowerCase().split(' ')],
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: `${config.title} | MEPKit`,
      description: config.description,
      url: url,
      siteName: 'MEPKit',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${config.title} | MEPKit`,
      description: config.description,
    },
  };
}

export default async function ToolPage({ params }: ToolPageProps) {
  const resolvedParams = await params;
  const config = await getToolConfig(resolvedParams.slug);

  if (!config) {
    notFound();
  }

  // Generate JSON-LD Structured Data
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: config.title,
    description: config.description,
    applicationCategory: 'EngineeringTool',
    operatingSystem: 'Any',
    url: `https://mepkit.com/tools/${resolvedParams.slug}`
  };

  return (
    <>
      <Script
        id={`json-ld-${resolvedParams.slug}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="container py-10 px-4 md:px-8">
        <ToolRenderer config={config} />
      </div>
    </>
  );
}
