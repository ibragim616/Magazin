import React from 'react';
import { notFound } from 'next/navigation';
import db from '@/lib/db';
import ProductDetailsContent from '@/components/ProductDetailsContent';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

interface ProductDetailPageProps {
  params: Promise<{ id: string }>;
}

export const revalidate = 0;

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const resolvedParams = await params;
  const productId = resolvedParams.id;

  const product = await db.product.findUnique({
    where: { id: productId },
    include: {
      category: true,
      reviews: {
        orderBy: { createdAt: 'desc' },
      },
    },
  });

  if (!product) {
    notFound();
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 flex flex-col">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-gray-500 mb-6">
        <Link href="/" className="hover:text-indigo-600">Bosh sahifa</Link>
        <ChevronRight className="h-3 w-3" />
        <Link href="/products" className="hover:text-indigo-600">Katalog</Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-gray-900 dark:text-gray-300 font-medium truncate max-w-[200px]">
          {product.name}
        </span>
      </div>

      <ProductDetailsContent product={product} />
    </div>
  );
}
