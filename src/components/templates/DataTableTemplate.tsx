import React from 'react';
import Head from 'next/head';
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  ColumnDef,
} from '@tanstack/react-table';

interface DataTableTemplateProps<TData> {
  title: string;
  description: string;
  data: TData[];
  columns: ColumnDef<TData, any>[];
}

export const DataTableTemplate = <TData,>({ title, description, data, columns }: DataTableTemplateProps<TData>) => {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="container mx-auto max-w-6xl py-12 px-4 sm:px-6 lg:px-8">
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

      <main className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 dark:bg-gray-900 border-b">
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <th key={header.id} className="px-6 py-3 font-semibold text-gray-700 dark:text-gray-300">
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map(row => (
              <tr key={row.id} className="border-b last:border-b-0 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                {row.getVisibleCells().map(cell => (
                  <td key={cell.id} className="px-6 py-4 whitespace-nowrap">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </main>

      <aside className="mt-12 bg-gray-50 dark:bg-gray-900 p-6 rounded-xl text-sm text-gray-500 text-center border">
        {/* Placeholder for Google AdSense */}
        <p>Advertisement Space</p>
      </aside>
    </div>
  );
};
