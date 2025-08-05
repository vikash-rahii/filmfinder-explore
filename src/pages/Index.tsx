import { useState, useCallback, useEffect } from "react";
import { SearchBar } from "@/components/SearchBar";
import { FilterPanel, FilterState } from "@/components/FilterPanel";
import { MovieCard } from "@/components/MovieCard";
import { MovieDetails } from "@/components/MovieDetails";
import { Pagination } from "@/components/Pagination";
import { LoadingState, MovieGridSkeleton } from "@/components/LoadingState";
import { ErrorState, EmptyState } from "@/components/ErrorState";
import { Movie, SearchResponse, omdbApi } from "@/services/omdbApi";
import { Film, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Movie[]>([]);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<FilterState>({ type: '', year: '' });
  const [showFilters, setShowFilters] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [currentDefaultTerm, setCurrentDefaultTerm] = useState("");
  
  const { toast } = useToast();
  const resultsPerPage = 10;

  // Default popular search terms for initial load
  const defaultSearchTerms = [
    "marvel", "disney", "batman", "star wars", "harry potter", 
    "lord of the rings", "james bond", "avengers", "matrix", "inception"
  ];

  const loadDefaultContent = useCallback(async (page: number = 1) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Use the current default term if we have one, otherwise pick a random one
      let searchTerm = currentDefaultTerm;
      if (!searchTerm || page === 1) {
        searchTerm = defaultSearchTerms[Math.floor(Math.random() * defaultSearchTerms.length)];
        setCurrentDefaultTerm(searchTerm);
      }

      const response: SearchResponse = await omdbApi.searchMovies({
        query: searchTerm,
        type: filters.type || undefined,
        year: filters.year || undefined,
        page
      });

      setSearchResults(response.Search || []);
      setTotalResults(parseInt(response.totalResults) || 0);
      setCurrentPage(page);
      if (page === 1) {
        setIsInitialLoad(false);
      }
    } catch (err) {
      // If default search fails, try with a more common term
      try {
        const fallbackResponse: SearchResponse = await omdbApi.searchMovies({
          query: "movie",
          type: filters.type || undefined,
          year: filters.year || undefined,
          page: 1
        });
        setSearchResults(fallbackResponse.Search || []);
        setTotalResults(parseInt(fallbackResponse.totalResults) || 0);
        setCurrentPage(1);
        setCurrentDefaultTerm("movie");
        setIsInitialLoad(false);
      } catch (fallbackErr) {
        setError("Unable to load content. Please try searching for movies.");
        setIsInitialLoad(false);
      }
    } finally {
      setIsLoading(false);
    }
  }, [filters, currentDefaultTerm]);

  // Load default content on component mount
  useEffect(() => {
    loadDefaultContent(1);
  }, [loadDefaultContent]);

  const performSearch = useCallback(async (query: string, page: number = 1) => {
    if (!query.trim()) {
      setSearchResults([]);
      setTotalResults(0);
      setHasSearched(false);
      return;
    }

    setIsLoading(true);
    setError(null);
    setHasSearched(true);

    try {
      const response: SearchResponse = await omdbApi.searchMovies({
        query: query.trim(),
        type: filters.type || undefined,
        year: filters.year || undefined,
        page
      });

      setSearchResults(response.Search || []);
      setTotalResults(parseInt(response.totalResults) || 0);
      setCurrentPage(page);

      if (page === 1 && response.Search?.length) {
        toast({
          title: "Search completed",
          description: `Found ${parseInt(response.totalResults).toLocaleString()} results for "${query}"`,
        });
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Search failed';
      setError(errorMessage);
      setSearchResults([]);
      setTotalResults(0);
      
      toast({
        title: "Search failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [filters, toast]);

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
    setHasSearched(true);
    setIsInitialLoad(false);
    if (query.trim()) {
      performSearch(query, 1);
    } else {
      // If search is cleared, reload default content
      setHasSearched(false);
      loadDefaultContent();
    }
  }, [performSearch, loadDefaultContent]);

  const handlePageChange = useCallback((page: number) => {
    if (hasSearched && searchQuery) {
      // Handle pagination for search results
      performSearch(searchQuery, page);
    } else {
      // Handle pagination for default content
      loadDefaultContent(page);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [searchQuery, hasSearched, performSearch, loadDefaultContent]);

  const handleFilterChange = useCallback((newFilters: FilterState) => {
    setFilters(newFilters);
    if (searchQuery && hasSearched) {
      setCurrentPage(1);
      // The search will be triggered by the useEffect below
    } else if (!hasSearched && !isInitialLoad) {
      // If we're showing default content and filters change, reload with new filters
      loadDefaultContent(1);
    }
  }, [searchQuery, hasSearched, isInitialLoad, loadDefaultContent]);

  const handleMovieClick = useCallback((movie: Movie) => {
    setSelectedMovie(movie);
  }, []);

  const handleRetry = useCallback(() => {
    if (hasSearched && searchQuery) {
      performSearch(searchQuery, currentPage);
    } else {
      loadDefaultContent(currentPage);
    }
  }, [searchQuery, hasSearched, currentPage, performSearch, loadDefaultContent]);

  useEffect(() => {
    if (searchQuery && hasSearched) {
      const timeoutId = setTimeout(() => {
        performSearch(searchQuery, 1);
      }, 500); // Debounce filter changes

      return () => clearTimeout(timeoutId);
    } else if (!hasSearched && !isInitialLoad && currentDefaultTerm) {
      // Reload default content with new filters
      const timeoutId = setTimeout(() => {
        loadDefaultContent(1);
      }, 500);

      return () => clearTimeout(timeoutId);
    }
  }, [filters, searchQuery, hasSearched, performSearch, isInitialLoad, currentDefaultTerm, loadDefaultContent]);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative bg-gradient-hero border-b border-border/50">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative container mx-auto px-4 py-16 md:py-24">
          <div className="text-center space-y-6 max-w-4xl mx-auto">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Film className="w-12 h-12 text-primary animate-pulse" />
              <Sparkles className="w-8 h-8 text-primary-glow animate-bounce" />
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary via-primary-glow to-primary bg-clip-text text-transparent">
              CinemaSearch
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              {isInitialLoad 
                ? "Loading popular movies and series..." 
                : "Discover your next favorite movie or series. Search through millions of titles with powerful filters."
              }
            </p>
            
            <div className="pt-8">
              <SearchBar 
                onSearch={handleSearch}
                isLoading={isLoading}
                placeholder="Search for movies, TV series, episodes..."
              />
            </div>
          </div>
        </div>
      </section>

      {/* Filters Section */}
      {(hasSearched || showFilters || (!isInitialLoad && searchResults.length > 0)) && (
        <section className="border-b border-border/50 bg-card/50">
          <div className="container mx-auto px-4 py-6">
            <FilterPanel
              filters={filters}
              onFilterChange={handleFilterChange}
              isOpen={showFilters}
              onToggle={() => setShowFilters(!showFilters)}
            />
          </div>
        </section>
      )}

      {/* Results Section */}
      <section className="container mx-auto px-4 py-8">
        {isLoading ? (
          <div className="space-y-8">
            <LoadingState message="Searching for movies..." />
            <MovieGridSkeleton />
          </div>
        ) : error ? (
          <ErrorState 
            message={error}
            onRetry={handleRetry}
          />
        ) : hasSearched || (!isInitialLoad && searchResults.length > 0) ? (
          searchResults.length > 0 ? (
            <div className="space-y-8">
              {/* Results Header */}
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">
                  {hasSearched ? "Search Results" : "Popular Movies & Series"}
                  <span className="text-muted-foreground font-normal ml-2">
                    ({totalResults.toLocaleString()} found)
                  </span>
                </h2>
                
                {!showFilters && !isInitialLoad && (
                  <FilterPanel
                    filters={filters}
                    onFilterChange={handleFilterChange}
                    isOpen={false}
                    onToggle={() => setShowFilters(true)}
                  />
                )}
              </div>

              {/* Movie Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 animate-fade-in">
                {searchResults.map((movie) => (
                  <MovieCard
                    key={movie.imdbID}
                    movie={movie}
                    onClick={handleMovieClick}
                  />
                ))}
              </div>

              {/* Pagination - only show for search results or when we have multiple pages */}
              {(hasSearched || totalResults > resultsPerPage) && (
                <Pagination
                  currentPage={currentPage}
                  totalResults={totalResults}
                  resultsPerPage={resultsPerPage}
                  onPageChange={handlePageChange}
                  isLoading={isLoading}
                />
              )}
            </div>
          ) : (
            <EmptyState 
              title={hasSearched ? "No movies found" : "No content available"}
              message={hasSearched 
                ? "Try adjusting your search query or filters to find what you're looking for."
                : "Unable to load content at the moment. Please try searching."
              }
              onSearch={hasSearched ? () => setSearchQuery("") : loadDefaultContent}
            />
          )
        ) : null}
      </section>

      {/* Movie Details Modal */}
      <MovieDetails
        movie={selectedMovie}
        isOpen={!!selectedMovie}
        onClose={() => setSelectedMovie(null)}
      />
    </div>
  );
};

export default Index;
