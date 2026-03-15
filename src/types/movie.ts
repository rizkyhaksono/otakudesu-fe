export interface MovieGenreItem {
  title: string;
  slug: string;
  image: string;
  rating: string;
  quality: string;
  year: string;
  genres?: string[];
}

export interface MovieGenre {
  name: string;
  slug: string;
}

// MovieBox API Types
export interface MovieBoxCover {
  url: string;
  width: number;
  height: number;
  size: number;
  format: string;
  thumbnail: string;
  blurHash: string;
  gif: null | string;
  avgHueLight: string;
  avgHueDark: string;
  id: string;
}

export interface MovieBoxStaff {
  staffId: string;
  staffType: number;
  name: string;
  character: string;
  avatarUrl: string;
  detailPath: string;
}

export interface MovieBoxSubject {
  subjectId: string;
  subjectType: number;
  title: string;
  description: string;
  releaseDate: string;
  duration: number;
  genre: string;
  cover: MovieBoxCover;
  countryName: string;
  imdbRatingValue: string;
  subtitles: string;
  ops: string;
  hasResource: boolean;
  trailer: null | string;
  detailPath: string;
  staffList: MovieBoxStaff[];
  appointmentCnt: number;
  appointmentDate: string;
  corner: string;
  imdbRatingCount: number;
  stills: null | string;
  postTitle: string;
  thumbnail: string;
}

export interface MovieBoxResource {
  seasons: Array<{
    se: number;
    maxEp: number;
    allEp: string;
    resolutions: Array<{
      resolution: number;
      epNum: number;
    }>;
  }>;
  source: string;
  uploadBy: string;
}

export interface MovieBoxMetadata {
  title: string;
  description: string;
  keyWords: string;
  image: string;
  url: string;
  referer: string;
}

export interface MovieBoxDetailResponse {
  subject: MovieBoxSubject;
  stars: MovieBoxStaff[];
  resource: MovieBoxResource;
  metadata: MovieBoxMetadata;
  url: string;
  referer: string;
  isForbid: boolean;
  watchTimeLimit: number;
}

export interface MovieBoxSource {
  id: string;
  quality: number;
  directUrl: string;
  size: string;
  format: string;
}

export interface MovieBoxSourcesResponse {
  downloads: Array<{
    id: string;
    url: string;
    resolution: number;
    size: string;
  }>;
  captions: unknown[];
  limited: boolean;
  limitedCode: string;
  freeNum: number;
  hasResource: boolean;
  processedSources: MovieBoxSource[];
}
