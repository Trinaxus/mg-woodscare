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

const ACCESS_TOKEN = import.meta.env.VITE_INSTAGRAM_ACCESS_TOKEN;

function handleApiError(response: Response, error: unknown): never {
  const message = (error as { error?: { message?: string } })?.error?.message;
  throw new Error(message || `Instagram API Fehler: ${response.status}`);
}

export async function fetchInstagramAccount(): Promise<InstagramAccount> {
  if (!ACCESS_TOKEN) {
    throw new Error("Instagram Access Token fehlt in .env (VITE_INSTAGRAM_ACCESS_TOKEN)");
  }

  const url = new URL("https://graph.instagram.com/me");
  url.searchParams.set(
    "fields",
    "id,username,account_type,media_count,followers_count,follows_count,biography,profile_picture_url"
  );
  url.searchParams.set("access_token", ACCESS_TOKEN);

  const response = await fetch(url.toString());
  const data = await response.json().catch(() => ({}));
  if (!response.ok) handleApiError(response, data);
  return data;
}

export async function fetchInstagramFeed(limit = 6): Promise<InstagramFeed> {
  if (!ACCESS_TOKEN) {
    throw new Error("Instagram Access Token fehlt in .env (VITE_INSTAGRAM_ACCESS_TOKEN)");
  }

  const url = new URL("https://graph.instagram.com/me/media");
  url.searchParams.set(
    "fields",
    "id,caption,media_type,media_url,thumbnail_url,permalink,timestamp,like_count,comments_count,username"
  );
  url.searchParams.set("limit", String(limit));
  url.searchParams.set("access_token", ACCESS_TOKEN);

  const response = await fetch(url.toString());
  const data = await response.json().catch(() => ({}));
  if (!response.ok) handleApiError(response, data);
  return data;
}

export async function fetchInstagramComments(mediaId: string): Promise<InstagramComment[]> {
  if (!ACCESS_TOKEN) {
    throw new Error("Instagram Access Token fehlt in .env (VITE_INSTAGRAM_ACCESS_TOKEN)");
  }

  const url = new URL(`https://graph.instagram.com/${mediaId}/comments`);
  url.searchParams.set("fields", "id,text,timestamp,username");
  url.searchParams.set("access_token", ACCESS_TOKEN);

  const response = await fetch(url.toString());
  const data = await response.json().catch(() => ({}));
  if (!response.ok) handleApiError(response, data);
  return data.data ?? [];
}

export async function fetchInstagramMediaChildren(mediaId: string): Promise<InstagramMediaChild[]> {
  if (!ACCESS_TOKEN) {
    throw new Error("Instagram Access Token fehlt in .env (VITE_INSTAGRAM_ACCESS_TOKEN)");
  }

  const url = new URL(`https://graph.instagram.com/${mediaId}/children`);
  url.searchParams.set("fields", "id,media_type,media_url,thumbnail_url");
  url.searchParams.set("access_token", ACCESS_TOKEN);

  const response = await fetch(url.toString());
  const data = await response.json().catch(() => ({}));
  if (!response.ok) handleApiError(response, data);
  return data.data ?? [];
}

export async function refreshInstagramToken(): Promise<{ access_token: string; expires_in: number }> {
  if (!ACCESS_TOKEN) {
    throw new Error("Instagram Access Token fehlt in .env (VITE_INSTAGRAM_ACCESS_TOKEN)");
  }

  const url = new URL("https://graph.instagram.com/refresh_access_token");
  url.searchParams.set("grant_type", "ig_refresh_token");
  url.searchParams.set("access_token", ACCESS_TOKEN);

  const response = await fetch(url.toString());
  const data = await response.json().catch(() => ({}));
  if (!response.ok) handleApiError(response, data);
  return data;
}
