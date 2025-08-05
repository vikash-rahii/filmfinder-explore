import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Movie, MovieDetails as MovieDetailsType, omdbApi } from "@/services/omdbApi";
import { 
  Calendar, 
  Clock, 
  Star, 
  Users, 
  Globe, 
  Award,
  Loader2,
  X,
  Film,
  Tv
} from "lucide-react";

interface MovieDetailsProps {
  movie: Movie | null;
  isOpen: boolean;
  onClose: () => void;
}

export const MovieDetails = ({ movie, isOpen, onClose }: MovieDetailsProps) => {
  const [details, setDetails] = useState<MovieDetailsType | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDetails = async () => {
      if (!movie || !isOpen) {
        setDetails(null);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const movieDetails = await omdbApi.getMovieDetails(movie.imdbID);
        setDetails(movieDetails);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load movie details');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDetails();
  }, [movie, isOpen]);

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.src = '/placeholder.svg';
  };

  const getTypeIcon = (type: string) => {
    return type === 'series' ? <Tv className="w-4 h-4" /> : <Film className="w-4 h-4" />;
  };

  const getRatingColor = (rating: string) => {
    const num = parseFloat(rating);
    if (num >= 8) return 'text-green-400';
    if (num >= 7) return 'text-yellow-400';
    if (num >= 6) return 'text-orange-400';
    return 'text-red-400';
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0">
        {isLoading ? (
          <div className="flex items-center justify-center h-96">
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
              <p className="text-muted-foreground">Loading movie details...</p>
            </div>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <p className="text-destructive mb-4">{error}</p>
              <Button variant="outline" onClick={onClose}>
                Close
              </Button>
            </div>
          </div>
        ) : details ? (
          <div className="relative">
            {/* Header with background */}
            <div className="relative h-64 bg-gradient-hero overflow-hidden">
              <div className="absolute inset-0 bg-black/50" />
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="absolute top-4 right-4 z-10 bg-black/50 hover:bg-black/70 text-white"
              >
                <X className="w-5 h-5" />
              </Button>
              
              <div className="absolute bottom-6 left-6 right-6 text-white">
                <div className="flex items-center gap-2 mb-2">
                  <Badge className="bg-primary text-primary-foreground">
                    {getTypeIcon(details.Type)}
                    <span className="ml-1 capitalize">{details.Type}</span>
                  </Badge>
                  <Badge variant="outline" className="border-white/30 text-white">
                    <Calendar className="w-3 h-3 mr-1" />
                    {details.Year}
                  </Badge>
                </div>
                <DialogHeader>
                  <DialogTitle className="text-3xl font-bold text-white mb-2">
                    {details.Title}
                  </DialogTitle>
                </DialogHeader>
              </div>
            </div>

            <div className="p-6">
              <div className="grid md:grid-cols-3 gap-6">
                {/* Poster */}
                <div className="md:col-span-1">
                  <div className="aspect-[2/3] rounded-lg overflow-hidden shadow-lg">
                    <img
                      src={details.Poster !== 'N/A' ? details.Poster : '/placeholder.svg'}
                      alt={details.Title}
                      className="w-full h-full object-cover"
                      onError={handleImageError}
                    />
                  </div>
                </div>

                {/* Details */}
                <div className="md:col-span-2 space-y-6">
                  {/* Plot */}
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Plot</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {details.Plot !== 'N/A' ? details.Plot : 'No plot available.'}
                    </p>
                  </div>

                  {/* Key Info */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {details.imdbRating !== 'N/A' && (
                      <div className="flex items-center gap-2">
                        <Star className="w-5 h-5 text-yellow-400" />
                        <span className="font-medium">IMDB Rating:</span>
                        <span className={`font-bold ${getRatingColor(details.imdbRating)}`}>
                          {details.imdbRating}/10
                        </span>
                      </div>
                    )}
                    
                    {details.Runtime !== 'N/A' && (
                      <div className="flex items-center gap-2">
                        <Clock className="w-5 h-5 text-primary" />
                        <span className="font-medium">Runtime:</span>
                        <span>{details.Runtime}</span>
                      </div>
                    )}
                    
                    {details.Genre !== 'N/A' && (
                      <div className="flex items-center gap-2">
                        <Film className="w-5 h-5 text-primary" />
                        <span className="font-medium">Genre:</span>
                        <span>{details.Genre}</span>
                      </div>
                    )}
                    
                    {details.Released !== 'N/A' && (
                      <div className="flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-primary" />
                        <span className="font-medium">Released:</span>
                        <span>{details.Released}</span>
                      </div>
                    )}
                  </div>

                  <Separator />

                  {/* Cast and Crew */}
                  <div className="space-y-4">
                    {details.Director !== 'N/A' && (
                      <div>
                        <span className="font-medium text-primary">Director: </span>
                        <span>{details.Director}</span>
                      </div>
                    )}
                    
                    {details.Writer !== 'N/A' && (
                      <div>
                        <span className="font-medium text-primary">Writer: </span>
                        <span>{details.Writer}</span>
                      </div>
                    )}
                    
                    {details.Actors !== 'N/A' && (
                      <div>
                        <span className="font-medium text-primary flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          Cast:
                        </span>
                        <span className="ml-5">{details.Actors}</span>
                      </div>
                    )}
                  </div>

                  <Separator />

                  {/* Additional Info */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                    {details.Country !== 'N/A' && (
                      <div className="flex items-center gap-2">
                        <Globe className="w-4 h-4 text-muted-foreground" />
                        <span className="font-medium">Country:</span>
                        <span>{details.Country}</span>
                      </div>
                    )}
                    
                    {details.Language !== 'N/A' && (
                      <div className="flex items-center gap-2">
                        <Globe className="w-4 h-4 text-muted-foreground" />
                        <span className="font-medium">Language:</span>
                        <span>{details.Language}</span>
                      </div>
                    )}
                    
                    {details.Awards !== 'N/A' && (
                      <div className="flex items-center gap-2 sm:col-span-2">
                        <Award className="w-4 h-4 text-muted-foreground" />
                        <span className="font-medium">Awards:</span>
                        <span>{details.Awards}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
};