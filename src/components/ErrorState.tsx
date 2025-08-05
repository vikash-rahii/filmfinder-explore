import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangle, RefreshCw, Search } from "lucide-react";

interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  showRetry?: boolean;
}

export const ErrorState = ({ 
  title = "Oops! Something went wrong",
  message, 
  onRetry,
  showRetry = true
}: ErrorStateProps) => {
  return (
    <Card className="max-w-md mx-auto">
      <CardContent className="flex flex-col items-center text-center p-8 space-y-4">
        <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center">
          <AlertTriangle className="w-8 h-8 text-destructive" />
        </div>
        
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">{title}</h3>
          <p className="text-muted-foreground">{message}</p>
        </div>
        
        {showRetry && onRetry && (
          <Button 
            variant="outline" 
            onClick={onRetry}
            className="flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Try Again
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export const EmptyState = ({ 
  title = "No movies found",
  message = "Try adjusting your search or filters to find what you're looking for.",
  onSearch
}: {
  title?: string;
  message?: string;
  onSearch?: () => void;
}) => {
  return (
    <Card className="max-w-md mx-auto">
      <CardContent className="flex flex-col items-center text-center p-8 space-y-4">
        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center">
          <Search className="w-8 h-8 text-muted-foreground" />
        </div>
        
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">{title}</h3>
          <p className="text-muted-foreground">{message}</p>
        </div>
        
        {onSearch && (
          <Button 
            variant="outline" 
            onClick={onSearch}
            className="flex items-center gap-2"
          >
            <Search className="w-4 h-4" />
            Try Different Search
          </Button>
        )}
      </CardContent>
    </Card>
  );
};