import { Skeleton } from "@/components/ui/skeleton";

interface LoadingFormSkeletonProps {
    inputSum?: number
}

export const LoadingFormSkeleton =  ({
    inputSum = 5
}: LoadingFormSkeletonProps) => {
    return (
        <div className="w-full flex flex-col gap-4">
            <Skeleton className="w-[45%] h-10 rounded-lg bg-gray-200"/>
            <div className="space-y-8">
            {
                Array.from({length: inputSum}).map((_, i) => (
                    <div key={i} className="space-y-3">
                        <Skeleton className="w-[25%] h-4 bg-gray-200" />
                        <Skeleton className="w-full h-10 bg-gray-200" />
                    </div>
                ))
            }
            </div>
        </div>
    )
}