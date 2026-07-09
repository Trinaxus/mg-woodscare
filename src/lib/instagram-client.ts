import { api } from "@/lib/api";
import type { InstagramAccount, InstagramComment, InstagramMedia, InstagramMediaChild } from "@/lib/instagram";

class InstagramApiClient {
  private get(endpoint: string) {
    return api.request(`/instagram.php${endpoint}`);
  }

  async fetchAccount(): Promise<InstagramAccount> {
    return this.get("?action=account") as Promise<InstagramAccount>;
  }

  async fetchFeed(limit: number): Promise<{ data: InstagramMedia[] }> {
    return this.get(`?action=feed&limit=${limit}`) as Promise<{ data: InstagramMedia[] }>;
  }

  async fetchMentions(): Promise<InstagramMedia[]> {
    const result = await this.get("?action=mentions") as { data?: InstagramMedia[] };
    return result.data ?? [];
  }

  async fetchMediaChildren(mediaId: string): Promise<InstagramMediaChild[]> {
    const result = await this.get(`?action=children&mediaId=${encodeURIComponent(mediaId)}`) as { data?: InstagramMediaChild[] };
    return result.data ?? [];
  }

  async fetchComments(mediaId: string): Promise<InstagramComment[]> {
    const result = await this.get(`?action=comments&mediaId=${encodeURIComponent(mediaId)}`) as { data?: InstagramComment[] };
    return result.data ?? [];
  }

  async refreshToken(): Promise<{ access_token: string; expires_in: number }> {
    return this.get("?action=refresh") as Promise<{ access_token: string; expires_in: number }>;
  }

  async fetchTokenStatus(): Promise<{
    configured: boolean;
    has_log: boolean;
    last_refresh: string | null;
    expires_at: string | null;
    expires_in_days: number | null;
    expires_in_seconds: number | null;
    healthy: boolean;
    message: string;
  }> {
    return api.request('/instagram-token-status.php', { method: 'GET' }) as Promise<{
      configured: boolean;
      has_log: boolean;
      last_refresh: string | null;
      expires_at: string | null;
      expires_in_days: number | null;
      expires_in_seconds: number | null;
      healthy: boolean;
      message: string;
    }>;
  }
}

export const instagramApi = new InstagramApiClient();
