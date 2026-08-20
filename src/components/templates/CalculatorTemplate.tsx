import React from 'react';
import Head from 'next/head';

interface CalculatorTemplateProps {
  title: string;
  description: string;
  children: React.ReactNode;
}

export const CalculatorTemplate: React.FC<CalculatorTemplateProps> = ({ title, description, children }) => {
  return (
    <div className="container mx-auto max-w-4xl py-12 px-4 sm:px-6 lg:px-8">
      <Head>
        <title>{title} | MEPKit</title>
        <meta name="description" content={description} />
      </Head>
      
      <header className="mb-8 border-b pb-4">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
          {title}
        </h1>
        <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
          {description}
        </p>
      </header>

      <main className="space-y-8 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border">
        {children}
      </main>

      <aside className="mt-12 bg-gray-50 dark:bg-gray-900 p-6 rounded-xl text-sm text-gray-500 text-center border">
        {/* Placeholder for Google AdSense */}
        <p>Advertisement Space</p>
      </aside>
    </div>
  );
};
