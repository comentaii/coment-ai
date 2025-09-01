'use client';

import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { AnimatePresence, motion } from 'framer-motion';

interface GenericListProps<T> {
  data?: T[];
  isLoading: boolean;
  isError: boolean;
  error?: React.ReactNode;
  renderItem: (item: T) => React.ReactNode;
  emptyState?: React.ReactNode;
  skeletonCount?: number;
  skeletonComponent?: React.ReactNode;
  className?: string;
  layout?: 'grid' | 'list';
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export function GenericList<T extends { _id: any }>({
  data,
  isLoading,
  isError,
  error = <p>An error occurred while fetching data.</p>,
  renderItem,
  emptyState = <p>No items found.</p>,
  skeletonCount = 5,
  skeletonComponent = <Skeleton className="h-24 w-full" />,
  className = '',
  layout = 'grid',
}: GenericListProps<T>) {

  if (isLoading) {
    return (
      <div className={className}>
        {Array.from({ length: skeletonCount }).map((_, index) => (
          <React.Fragment key={index}>{skeletonComponent}</React.Fragment>
        ))}
      </div>
    );
  }

  if (isError) {
    return <div className="p-4 text-red-500">{error}</div>;
  }

  if (!data || data.length === 0) {
    return <div className="p-4">{emptyState}</div>;
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={className}
    >
      <AnimatePresence>
        {data.map((item) => (
          <motion.div key={item._id} variants={itemVariants}>
            {renderItem(item)}
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  );
}

