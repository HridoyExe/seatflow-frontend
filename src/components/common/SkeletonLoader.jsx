import React from 'react';
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Utility for combining tailwind classes
 */
function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const Skeleton = ({ className, ...props }) => {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-slate-200 shadow-sm", className)}
      {...props}
    />
  );
};

export const MenuDetailsSkeleton = () => {
  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        <Skeleton className="h-10 w-32 mb-8 rounded-full" />
        <div className="bg-white rounded-[2.5rem] shadow-xl overflow-hidden mb-12">
          <div className="flex flex-col lg:flex-row">
            <div className="lg:w-1/2 p-10 bg-slate-50/50">
              <Skeleton className="aspect-square w-full rounded-3xl" />
            </div>
            <div className="lg:w-1/2 p-8 lg:p-16 flex flex-col">
              <Skeleton className="h-6 w-24 mb-6 rounded-full" />
              <Skeleton className="h-12 w-3/4 mb-4" />
              <Skeleton className="h-10 w-32 mb-8" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-2/3 mb-10" />
              <div className="flex gap-4 mb-10">
                <Skeleton className="h-10 w-28 rounded-2xl" />
                <Skeleton className="h-10 w-28 rounded-2xl" />
              </div>
              <div className="flex gap-6 mt-auto">
                <Skeleton className="h-14 w-32 rounded-2xl" />
                <Skeleton className="h-14 flex-grow rounded-2xl" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const MenuItemSkeleton = () => {
  return (
    <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-4">
      <Skeleton className="aspect-video w-full rounded-2xl mb-4" />
      <Skeleton className="h-6 w-2/3 mb-2" />
      <Skeleton className="h-4 w-full mb-4" />
      <div className="flex justify-between items-center">
        <Skeleton className="h-8 w-20" />
        <Skeleton className="h-10 w-10 rounded-full" />
      </div>
    </div>
  );
};

export default Skeleton;
