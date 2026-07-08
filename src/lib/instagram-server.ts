import { createServerFn } from "@tanstack/react-start";
import {
  type InstagramAccount,
  type InstagramMedia,
  type InstagramMediaChild,
  type InstagramComment,
} from "./instagram";

function getAccessToken(): string {
  const token = process.env.VITE_INSTAGRAM_ACCESS_TOKEN;
  if (!token) {
    throw new Error("Instagram Access Token fehlt in .env (VITE_INSTAGRAM_ACCESS_TOKEN)");
  }
  return token;
}

function handleApiError(response: Response, error: unknown): never {
  const message = (error as { error?: { message?: string } })?.error?.message;
  throw new Error(message || `Instagram API Fehler: ${response.status}`);
}

export const fetchInstagramAccountServer = createServerFn({
  method: "GET",
}).handler(async (): Promise<InstagramAccount> => {
  const accessToken = getAccessToken();

  const url = new URL("https://graph.instagram.com/me");
  url.searchParams.set(
    "fields",
    "id,username,account_type,media_count,followers_count,follows_count,biography,profile_picture_url,name"
  );
  url.searchParams.set("access_token", accessToken);

  const response = await fetch(url.toString());
  const data = await response.json().catch(() => ({}));
  if (!response.ok) handleApiError(response, data);
  return data as InstagramAccount;
});

export const fetchInstagramFeedServer = createServerFn({
  method: "GET",
}).validator((data: { limit: number }) => data).handler(async ({ data }): Promise<{ data: InstagramMedia[] }> => {
  const accessToken = getAccessToken();

  const url = new URL("https://graph.instagram.com/me/media");
  url.searchParams.set(
    "fields",
    "id,caption,media_type,media_url,thumbnail_url,permalink,timestamp,like_count,comments_count,username"
  );
  url.searchParams.set("limit", String(data.limit));
  url.searchParams.set("access_token", accessToken);

  const response = await fetch(url.toString());
  const result = await response.json().catch(() => ({}));
  if (!response.ok) handleApiError(response, result);
  return { data: (result.data ?? []) as InstagramMedia[] };
});

export const fetchInstagramMediaChildrenServer = createServerFn({
  method: "GET",
}).validator((data: { mediaId: string }) => data).handler(async ({ data }): Promise<InstagramMediaChild[]> => {
  const accessToken = getAccessToken();

  const url = new URL(`https://graph.instagram.com/${data.mediaId}/children`);
  url.searchParams.set("fields", "id,media_type,media_url,thumbnail_url");
  url.searchParams.set("access_token", accessToken);

  const response = await fetch(url.toString());
  const result = await response.json().catch(() => ({}));
  if (!response.ok) handleApiError(response, result);
  return (result.data ?? []) as InstagramMediaChild[];
});

export const fetchInstagramCommentsServer = createServerFn({
  method: "GET",
}).validator((data: { mediaId: string }) => data).handler(async ({ data }): Promise<InstagramComment[]> => {
  const accessToken = getAccessToken();

  const url = new URL(`https://graph.instagram.com/${data.mediaId}/comments`);
  url.searchParams.set("fields", "id,text,timestamp,username");
  url.searchParams.set("access_token", accessToken);

  const response = await fetch(url.toString());
  const result = await response.json().catch(() => ({}));
  if (!response.ok) handleApiError(response, result);
  return (result.data ?? []) as InstagramComment[];
});

export const refreshInstagramTokenServer = createServerFn({
  method: "GET",
}).handler(async (): Promise<{ access_token: string; expires_in: number }> => {
  const accessToken = getAccessToken();

  const url = new URL("https://graph.instagram.com/refresh_access_token");
  url.searchParams.set("grant_type", "ig_refresh_token");
  url.searchParams.set("access_token", accessToken);

  const response = await fetch(url.toString());
  const data = await response.json().catch(() => ({}));
  if (!response.ok) handleApiError(response, data);
  return data as { access_token: string; expires_in: number };
});

export const fetchInstagramMentionsServer = createServerFn({
  method: "GET",
}).handler(async (): Promise<InstagramMedia[]> => {
  const accessToken = getAccessToken();

  const url = new URL("https://graph.instagram.com/me/mentioned_media");
  url.searchParams.set(
    "fields",
    "id,caption,media_type,media_url,thumbnail_url,permalink,timestamp,like_count,comments_count,username"
  );
  url.searchParams.set("access_token", accessToken);

  const response = await fetch(url.toString());
  const result = await response.json().catch(() => ({}));
  if (!response.ok) handleApiError(response, result);
  return (result.data ?? []) as InstagramMedia[];
});
