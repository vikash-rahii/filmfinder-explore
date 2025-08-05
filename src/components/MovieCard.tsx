import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Movie } from "@/services/omdbApi";
import { Calendar, Film } from "lucide-react";

interface MovieCardProps {
  movie: Movie;
  onClick: (movie: Movie) => void;
}

export const MovieCard = ({ movie, onClick }: MovieCardProps) => {
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.src = '/placeholder.svg';
  };

  const getTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'movie':
        return 'bg-cinema-gold text-primary-foreground';
      case 'series':
        return 'bg-cinema-blue text-primary-foreground';
      case 'episode':
        return 'bg-cinema-red text-primary-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <Card 
      className="group movie-card-hover cursor-pointer overflow-hidden border-border/50 hover:border-primary/50"
      onClick={() => onClick(movie)}
    >
      <div className="relative aspect-[2/3] overflow-hidden">
        <img
          src={movie.Poster !== 'N/A' ? movie.Poster : '/placeholder.svg'}
          alt={movie.Title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          onError={handleImageError}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="absolute top-3 right-3">
          <Badge className={`${getTypeColor(movie.Type)} shadow-lg`}>
            <Film className="w-3 h-3 mr-1" />
            {movie.Type}
          </Badge>
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="flex items-center gap-2 text-xs">
            <Calendar className="w-3 h-3" />
            <span>{movie.Year}</span>
          </div>
        </div>
      </div>
      
      <CardContent className="p-4">
        <h3 className="font-semibold text-lg line-clamp-2 text-foreground mb-2 group-hover:text-primary transition-colors duration-300">
          {movie.Title}
        </h3>
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {movie.Year}
          </span>
          <span className="capitalize font-medium">
            {movie.Type}
          </span>
        </div>
      </CardContent>
    </Card>
  );
};