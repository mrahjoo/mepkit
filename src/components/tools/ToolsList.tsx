'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

interface ToolItem {
  title: string;
  slug: string;
  description: string;
  type: string;
}

interface ToolsListProps {
  initialTools: ToolItem[];
}

export function ToolsList({ initialTools }: ToolsListProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTools = useMemo(() => {
    if (!searchQuery.trim()) return initialTools;
    const query = searchQuery.toLowerCase();
    return initialTools.filter((tool) => 
      tool.title.toLowerCase().includes(query) || 
      tool.description.toLowerCase().includes(query) ||
      tool.type.toLowerCase().includes(query)
    );
  }, [initialTools, searchQuery]);

  return (
    <div className="w-full">
      <div className="max-w-2xl mx-auto mb-10 relative">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input 
            type="search"
            placeholder="Search thousands of engineering tools..."
            className="w-full pl-10 pr-4 py-6 text-lg rounded-full shadow-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="mt-3 text-center text-sm text-muted-foreground">
          Showing {filteredTools.length} of {initialTools.length} tools
        </div>
      </div>

      {filteredTools.length === 0 ? (
        <div className="text-center text-muted-foreground py-20 bg-muted/30 rounded-lg border border-dashed">
          No tools found matching "{searchQuery}". Try another keyword.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {filteredTools.map((tool) => (
            <Link key={tool.slug} href={`/tools/${tool.slug}`} className="block h-full transition-transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-xl">
              <Card className="h-full hover:border-primary/50 transition-colors">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground bg-muted px-2 py-1 rounded-md">
                      {tool.type.replace('-', ' ')}
                    </span>
                  </div>
                  <CardTitle className="line-clamp-2">{tool.title}</CardTitle>
                  <CardDescription className="line-clamp-3 mt-2">{tool.description}</CardDescription>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
