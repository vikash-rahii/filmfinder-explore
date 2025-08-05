import { Loader2, Film } from "lucide-react";

interface LoadingStateProps {
  message?: string;
  showIcon?: boolean;
}

export const LoadingState = ({ 
  message = "Loading...", 
  showIcon = true 
}: LoadingStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 space-y-4">
      <div className="relative">
        {showIcon && (
          <Film className="w-12 h-12 text-primary animate-pulse" />
        )}
        <Loader2 className="w-8 h-8 animate-spin text-primary absolute -bottom-1 -right-1" />
      </div>
      <p className="text-lg text-muted-foreground animate-pulse">{message}</p>
    </div>
  );
};

export const MovieGridSkeleton = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
      {Array.from({ length: 10 }).map((_, index) => (
        <div key={index} className="animate-pulse">
          <div className="aspect-[2/3] bg-muted rounded-xl mb-4" />
          <div className="space-y-2">
            <div className="h-4 bg-muted rounded w-3/4" />
            <div className="h-3 bg-muted rounded w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
};