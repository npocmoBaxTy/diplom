import React from "react";

export default function Skeleton() {
  return (
    <div class="flex items-center justify-center w-[32%]">
      <div class="w-full flex justify-center">
        <div class="w-full rounded overflow-hidden shadow-lg animate-pulse">
          <div class="h-48 bg-gray-300"></div>
          <div class="px-6 py-4">
            <div class="h-6 bg-gray-300 mb-2"></div>
            <div class="h-4 bg-gray-300 w-2/3"></div>
          </div>
          <div class="px-6 pt-4 pb-2">
            <div class="h-4 bg-gray-300 w-1/4 mb-2"></div>
            <div class="h-4 bg-gray-300 w-1/2"></div>
          </div>
          <div class="flex items-center gap-4 px-6 pt-4 pb-2 justify-between">
            <div class="h-7 bg-gray-300 w-1/4 rounded-md"></div>
            <div class="h-7 bg-gray-300 w-1/4 rounded-md"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
