// app/dashboard/users/loading.tsx
import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function LoadingUsers() {
  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="animate-pulse">
          {/* Header Skeleton */}
          <div className="flex justify-between items-center mb-6">
            <Skeleton className="h-8 w-32" />
            <Skeleton className="h-10 w-24" />
          </div>

          {/* Search and Filters Skeleton */}
          <div className="bg-white rounded-lg shadow mb-6">
            <div className="p-4">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <Skeleton className="h-10 w-full max-w-sm" />
                <div className="flex items-center gap-4 flex-wrap">
                  <Skeleton className="h-10 w-32" />
                  <Skeleton className="h-10 w-24" />
                </div>
              </div>
            </div>
          </div>

          {/* User List Skeleton */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-4">
              {Array(10)
                .fill(0)
                .map((_, index) => (
                  <Skeleton key={index} className="h-16 w-full mb-2" />
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
