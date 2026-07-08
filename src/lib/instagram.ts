export interface InstagramAccount {
  id: string;
  username: string;
  account_type?: "BUSINESS" | "MEDIA_CREATOR" | "PERSONAL";
  media_count?: number;
  followers_count?: number;
  follows_count?: number;
  biography?: string;
  profile_picture_url?: string;
}

export interface InstagramMedia {
  id: string;
  caption?: string;
  media_type: "IMAGE" | "VIDEO" | "CAROUSEL_ALBUM";
  media_url: string;
  thumbnail_url?: string;
  permalink: string;
  timestamp: string;
  like_count?: number;
  comments_count?: number;
  username?: string;
}

export interface InstagramFeed {
  data: InstagramMedia[];
  paging?: {
    cursors?: { before?: string; after?: string };
    next?: string;
  };
}

export interface InstagramMediaChild {
  id: string;
  media_type: "IMAGE" | "VIDEO";
  media_url: string;
  thumbnail_url?: string;
}

export interface InstagramComment {
  id: string;
  text: string;
  timestamp: string;
  username?: string;
}
