import { FileQuestion, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  onReset?: () => void;
}

export function EmptyState({ onReset }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
        <FileQuestion className="w-8 h-8 text-muted-foreground" />
      </div>
      <h3 className="text-xl font-semibold mb-2">No articles found</h3>
      <p className="text-muted-foreground max-w-md mb-6">
        We couldn't find any articles matching your current filters. Try adjusting your search or filter criteria.
      </p>
      {onReset && (
        <Button onClick={onReset} variant="outline" data-testid="button-reset">
          <RefreshCw className="w-4 h-4 mr-2" />
          Reset Filters
        </Button>
      )}
    </div>
  );
}
