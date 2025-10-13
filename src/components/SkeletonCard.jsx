import React from "react";

const SkeletonCard = () => {
    return (
        <div className="bg-white h-30 flex flex-row w-full rounded-xl shadow-lg overflow-hidden animate-pulse">
            {/* Property Image Skeleton */}
            <div className="relative m-2 rounded-2xl aspect-square bg-gray-200"></div>

            {/* Property Details Skeleton */}
            <div className="p-4 flex-1  ">
                {/* Title Skeleton */}
                <div className="h-3 bg-gray-200 rounded w-3/4 mb-2"></div>

                {/* Location Skeleton */}
                <div className="flex items-center gap-1 mb-2">
                    <div className="w-4 h-4 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>

                {/* Description Skeleton */}
                <div className="space-y-2 mb-4">
                    <div className="h-3 bg-gray-200 rounded w-full"></div>
                    <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                </div>
            </div>
            {/* Action Buttons Skeleton */}
            <div className="flex flex-col">
                <div className="h-3 bg-gray-200 rounded w-full"></div>
            </div>
        </div>
    );
};

export default SkeletonCard;
