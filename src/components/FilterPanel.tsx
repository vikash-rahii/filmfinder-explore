import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Filter, Film, Tv, Clock, X } from "lucide-react";

export interface FilterState {
  type: 'movie' | 'series' | 'episode' | '';
  year: string;
}

interface FilterPanelProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  isOpen: boolean;
  onToggle: () => void;
}

export const FilterPanel = ({ filters, onFilterChange, isOpen, onToggle }: FilterPanelProps) => {
  const handleTypeChange = (type: FilterState['type']) => {
    onFilterChange({
      ...filters,
      type: filters.type === type ? '' : type
    });
  };

  const handleYearChange = (year: string) => {
    onFilterChange({
      ...filters,
      year
    });
  };

  const clearFilters = () => {
    onFilterChange({ type: '', year: '' });
  };

  const hasActiveFilters = filters.type || filters.year;

  if (!isOpen) {
    return (
      <Button
        variant="hero"
        size="lg"
        onClick={onToggle}
        className="relative"
      >
        <Filter className="w-5 h-5 mr-2" />
        Filters
        {hasActiveFilters && (
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full animate-pulse" />
        )}
      </Button>
    );
  }

  return (
    <Card className="w-full max-w-4xl mx-auto animate-slide-up">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-xl font-semibold flex items-center gap-2">
          <Filter className="w-5 h-5 text-primary" />
          Filter Results
        </CardTitle>
        <div className="flex items-center gap-2">
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="w-4 h-4 mr-1" />
              Clear
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggle}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Type Filter */}
        <div className="space-y-3">
          <Label className="text-base font-medium">Content Type</Label>
          <div className="flex flex-wrap gap-3">
            <Button
              variant={filters.type === 'movie' ? 'cinema' : 'filter'}
              onClick={() => handleTypeChange('movie')}
              className="flex items-center gap-2"
            >
              <Film className="w-4 h-4" />
              Movies
            </Button>
            <Button
              variant={filters.type === 'series' ? 'cinema' : 'filter'}
              onClick={() => handleTypeChange('series')}
              className="flex items-center gap-2"
            >
              <Tv className="w-4 h-4" />
              TV Series
            </Button>
            <Button
              variant={filters.type === 'episode' ? 'cinema' : 'filter'}
              onClick={() => handleTypeChange('episode')}
              className="flex items-center gap-2"
            >
              <Clock className="w-4 h-4" />
              Episodes
            </Button>
          </div>
        </div>

        {/* Year Filter */}
        <div className="space-y-3">
          <Label htmlFor="year-filter" className="text-base font-medium">
            Release Year
          </Label>
          <div className="max-w-xs">
            <Input
              id="year-filter"
              type="number"
              placeholder="e.g., 2023"
              value={filters.year}
              onChange={(e) => handleYearChange(e.target.value)}
              min="1900"
              max={new Date().getFullYear()}
              className="bg-muted"
            />
          </div>
        </div>

        {/* Active Filters Summary */}
        {hasActiveFilters && (
          <div className="flex flex-wrap gap-2 pt-4 border-t border-border">
            <span className="text-sm text-muted-foreground">Active filters:</span>
            {filters.type && (
              <span className="px-2 py-1 bg-primary text-primary-foreground rounded-md text-xs font-medium">
                {filters.type}
              </span>
            )}
            {filters.year && (
              <span className="px-2 py-1 bg-primary text-primary-foreground rounded-md text-xs font-medium">
                {filters.year}
              </span>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};