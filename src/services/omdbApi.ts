const API_KEY = '25b344a';
const BASE_URL = 'https://www.omdbapi.com/';

export interface Movie {
  imdbID: string;
  Title: string;
  Year: string;
  Type: 'movie' | 'series' | 'episode';
  Poster: string;
}

export interface MovieDetails extends Movie {
  Plot: string;
  Actors: string;
  Director: string;
  Writer: string;
  Genre: string;
  Released: string;
  Runtime: string;
  imdbRating: string;
  Country: string;
  Language: string;
  Awards: string;
  Metascore: string;
  BoxOffice?: string;
  Production?: string;
  Website?: string;
}

export interface SearchResponse {
  Search: Movie[];
  totalResults: string;
  Response: string;
  Error?: string;
}

export interface MovieDetailsResponse extends Omit<MovieDetails, 'Type'> {
  Type: string;
  Response: string;
  Error?: string;
}

export interface SearchParams {
  query: string;
  type?: 'movie' | 'series' | 'episode';
  year?: string;
  page?: number;
}

class OMDbAPIService {
  private buildUrl(params: Record<string, string | number>): string {
    const url = new URL(BASE_URL);
    url.searchParams.append('apikey', API_KEY);
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        url.searchParams.append(key, String(value));
      }
    });
    
    return url.toString();
  }

  async searchMovies({ query, type, year, page = 1 }: SearchParams): Promise<SearchResponse> {
    try {
      const url = this.buildUrl({
        s: query,
        type: type || '',
        y: year || '',
        page,
      });

      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.Response === 'False') {
        throw new Error(data.Error || 'Search failed');
      }
      
      return data;
    } catch (error) {
      console.error('Error searching movies:', error);
      throw error;
    }
  }

  async getMovieDetails(imdbID: string): Promise<MovieDetails> {
    try {
      const url = this.buildUrl({
        i: imdbID,
        plot: 'full',
      });

      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data: MovieDetailsResponse = await response.json();
      
      if (data.Response === 'False') {
        throw new Error(data.Error || 'Failed to fetch movie details');
      }
      
      return {
        ...data,
        Type: data.Type.toLowerCase() as 'movie' | 'series' | 'episode',
      };
    } catch (error) {
      console.error('Error fetching movie details:', error);
      throw error;
    }
  }
}

export const omdbApi = new OMDbAPIService();