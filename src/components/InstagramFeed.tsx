import { useEffect, useState, useCallback } from "react";
import { Heart, MessageCircle, Instagram, ExternalLink, X, ChevronLeft, ChevronRight, Play } from "lucide-react";
import { fetchInstagramAccount, fetchInstagramFeed, fetchInstagramMediaChildren, fetchInstagramComments, type InstagramAccount, type InstagramMedia, type InstagramMediaChild, type InstagramComment } from "@/lib/instagram";
import { useContent } from "@/lib/content";
import { ScrollReveal } from "@/components/ScrollReveal";

export function InstagramFeed() {
  const { content } = useContent();
  const postCount = content.instagram.postCount || 6;

  const [account, setAccount] = useState<InstagramAccount | null>(null);
  const [posts, setPosts] = useState<InstagramMedia[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPost, setSelectedPost] = useState<InstagramMedia | null>(null);
  const [children, setChildren] = useState<InstagramMediaChild[]>([]);
  const [childIndex, setChildIndex] = useState(0);
  const [childrenLoading, setChildrenLoading] = useState(false);
  const [childrenError, setChildrenError] = useState<string | null>(null);
  const [comments, setComments] = useState<InstagramComment[]>([]);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [commentsError, setCommentsError] = useState<string | null>(null);
  const [showComments, setShowComments] = useState(false);

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const [accountData, feed] = await Promise.all([
          fetchInstagramAccount(),
          fetchInstagramFeed(postCount),
        ]);
        if (!mounted) return;
        setAccount(accountData);
        setPosts(feed.data ?? []);
      } catch (err) {
        if (!mounted) return;
        setError(err instanceof Error ? err.message : "Instagram Feed konnte nicht geladen werden.");
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => {
      mounted = false;
    };
  }, [postCount]);

  const openPost = useCallback(async (post: InstagramMedia) => {
    setSelectedPost(post);
    setChildIndex(0);
    setChildrenError(null);
    setComments([]);
    setCommentsError(null);
    setShowComments(false);

    // Kommentare laden
    setCommentsLoading(true);
    try {
      const commentData = await fetchInstagramComments(post.id);
      setComments(commentData);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Fehler beim Laden der Kommentare.";
      setCommentsError(message);
      console.error("Fehler beim Laden der Kommentare:", err);
    } finally {
      setCommentsLoading(false);
    }

    if (post.media_type === "CAROUSEL_ALBUM") {
      setChildrenLoading(true);
      try {
        const data = await fetchInstagramMediaChildren(post.id);
        setChildren(data);
        if (data.length === 0) {
          setChildrenError("Keine Galerie-Bilder von der API erhalten.");
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : "Fehler beim Laden der Galerie.";
        setChildrenError(message);
        console.error("Fehler beim Laden der Galerie:", err);
      } finally {
        setChildrenLoading(false);
      }
    } else {
      setChildren([]);
    }
  }, []);

  const closeModal = useCallback(() => {
    setSelectedPost(null);
    setChildren([]);
    setChildIndex(0);
    setChildrenError(null);
    setComments([]);
    setCommentsError(null);
    setShowComments(false);
  }, []);

  const activeMedia = selectedPost
    ? selectedPost.media_type === "CAROUSEL_ALBUM" && children.length > 0
      ? children[childIndex]
      : selectedPost
    : null;

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (!selectedPost) return;
      if (e.key === "Escape") closeModal();
      if (selectedPost.media_type === "CAROUSEL_ALBUM" && children.length > 0) {
        if (e.key === "ArrowLeft") setChildIndex((i) => (i > 0 ? i - 1 : children.length - 1));
        if (e.key === "ArrowRight") setChildIndex((i) => (i < children.length - 1 ? i + 1 : 0));
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selectedPost, children.length, closeModal]);

  if (loading) {
    return (
      <section className="border-y border-border bg-card/40">
        <div className="mx-auto max-w-7xl px-6 py-20 text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <p className="mt-4 text-sm text-muted-foreground">Instagram Feed wird geladen...</p>
        </div>
      </section>
    );
  }

  if (error || !account || posts.length === 0) {
    return null;
  }

  return (
    <>
      <section className="border-y border-border bg-card/40">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <ScrollReveal>
            <div className="flex flex-col items-center gap-6 text-center md:flex-row md:text-left">
              {account.profile_picture_url && (
                <img
                  src={account.profile_picture_url}
                  alt={account.username}
                  className="h-20 w-20 rounded-full border-2 border-primary object-cover shadow-glow"
                />
              )}
              <div className="flex-1">
                <div className="flex items-center justify-center gap-2 md:justify-start">
                  <Instagram className="h-5 w-5 text-primary" />
                  <a
                    href={`https://www.instagram.com/${account.username}/`}
                    target="_blank"
                    rel="noreferrer"
                    className="font-display text-2xl font-semibold transition-colors hover:text-primary"
                  >
                    @{account.username}
                  </a>
                </div>
                <p className="mt-2 max-w-xl text-sm text-muted-foreground">{account.biography}</p>
              </div>
              <div className="flex gap-6">
                <div className="text-center">
                  <div className="font-display text-2xl font-semibold">{account.media_count ?? "–"}</div>
                  <div className="text-xs uppercase tracking-widest text-muted-foreground">Posts</div>
                </div>
                <div className="text-center">
                  <div className="font-display text-2xl font-semibold">{account.followers_count ?? "–"}</div>
                  <div className="text-xs uppercase tracking-widest text-muted-foreground">Follower</div>
                </div>
              </div>
            </div>
          </ScrollReveal>

          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post, index) => (
              <ScrollReveal key={post.id} delay={index * 100}>
                <button
                  onClick={() => openPost(post)}
                  className="group relative block w-full aspect-square overflow-hidden rounded-3xl border border-border bg-background text-left shadow-card"
                >
                  <img
                    src={post.media_type === "VIDEO" ? post.thumbnail_url || post.media_url : post.media_url}
                    alt={post.caption?.slice(0, 80) || "Instagram Post"}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />

                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 p-4 text-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <div className="flex gap-6 text-white">
                      <div className="flex items-center gap-1.5">
                        <Heart className="h-5 w-5 fill-current" />
                        <span className="font-semibold">{post.like_count ?? 0}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <MessageCircle className="h-5 w-5 fill-current" />
                        <span className="font-semibold">{post.comments_count ?? 0}</span>
                      </div>
                    </div>
                    {post.caption && (
                      <p className="mt-4 line-clamp-3 text-sm text-white/90">{post.caption}</p>
                    )}
                    <div className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-xs font-medium text-white backdrop-blur">
                      <ExternalLink className="h-3.5 w-3.5" /> Ansehen
                    </div>
                  </div>

                  {post.media_type === "VIDEO" && (
                    <span className="absolute right-3 top-3 rounded-full bg-black/60 p-2 text-white backdrop-blur">
                      <Play className="h-4 w-4 fill-current" />
                    </span>
                  )}
                  {post.media_type === "CAROUSEL_ALBUM" && (
                    <span className="absolute right-3 top-3 rounded-full bg-black/60 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur">
                      Galerie
                    </span>
                  )}
                </button>
              </ScrollReveal>
            ))}
          </div>

          <div className="mt-10 text-center">
            <a
              href={`https://www.instagram.com/${account.username}/`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-6 py-3 font-medium transition-colors hover:bg-card hover:text-primary"
            >
              <Instagram className="h-4 w-4" />
              Mehr auf Instagram
            </a>
          </div>
        </div>
      </section>

      {selectedPost && activeMedia && (
        <div
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
          onClick={closeModal}
        >
          <button
            onClick={closeModal}
            className="absolute right-4 top-4 z-20 grid h-10 w-10 place-items-center rounded-full bg-black/50 text-white transition-colors hover:bg-black/70"
            aria-label="Schließen"
          >
            <X className="h-5 w-5" />
          </button>

          <div
            className="relative w-full max-w-3xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative flex items-center justify-center">
              {activeMedia.media_type === "VIDEO" ? (
                <video
                  src={activeMedia.media_url}
                  poster={activeMedia.thumbnail_url}
                  controls
                  className="max-h-[65vh] w-auto max-w-full rounded-2xl object-contain shadow-2xl"
                />
              ) : (
                <img
                  src={activeMedia.media_url}
                  alt={selectedPost.caption?.slice(0, 80) || "Instagram Post"}
                  className="max-h-[65vh] w-auto max-w-full rounded-2xl object-contain shadow-2xl"
                />
              )}

              {selectedPost.media_type === "CAROUSEL_ALBUM" && children.length > 0 && (
                <>
                  <button
                    onClick={() => setChildIndex((i) => (i > 0 ? i - 1 : children.length - 1))}
                    className="absolute left-2 top-1/2 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-black/60 text-white shadow-lg transition-colors hover:bg-black/80 sm:-left-14"
                    aria-label="Zurück"
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </button>
                  <button
                    onClick={() => setChildIndex((i) => (i < children.length - 1 ? i + 1 : 0))}
                    className="absolute right-2 top-1/2 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-black/60 text-white shadow-lg transition-colors hover:bg-black/80 sm:-right-14"
                    aria-label="Weiter"
                  >
                    <ChevronRight className="h-6 w-6" />
                  </button>
                  <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-2 rounded-full bg-black/60 px-3 py-2 backdrop-blur">
                    {children.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setChildIndex(i)}
                        className={`h-2.5 w-2.5 rounded-full transition-colors ${i === childIndex ? "bg-white" : "bg-white/40 hover:bg-white/70"}`}
                        aria-label={`Bild ${i + 1} anzeigen`}
                      />
                    ))}
                  </div>
                  <div className="absolute left-4 top-4 rounded-full bg-black/60 px-3 py-1 text-xs font-medium text-white backdrop-blur">
                    {childIndex + 1} / {children.length}
                  </div>
                </>
              )}

              {childrenLoading && (
                <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-black/50">
                  <div className="h-8 w-8 animate-spin rounded-full border-2 border-white border-t-transparent" />
                </div>
              )}

              {childrenError && !childrenLoading && (
                <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-black/70 p-6 text-center">
                  <p className="text-sm text-white/90">{childrenError}</p>
                </div>
              )}
            </div>
          </div>

          <div
            className="mt-4 w-full max-w-3xl rounded-2xl bg-card/90 p-5 shadow-2xl backdrop-blur"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <div className="flex gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Heart className="h-4 w-4 text-primary" /> {selectedPost.like_count ?? 0}
                </span>
                {comments.length > 0 ? (
                  <button
                    onClick={() => setShowComments((s) => !s)}
                    className="flex items-center gap-1 transition-colors hover:text-primary"
                    disabled={commentsLoading}
                  >
                    <MessageCircle className="h-4 w-4 text-primary" /> {selectedPost.comments_count ?? 0}
                  </button>
                ) : (
                  <span className="flex items-center gap-1" title="Kommentare können mit diesem Access Token nicht geladen werden.">
                    <MessageCircle className="h-4 w-4 text-primary" /> {selectedPost.comments_count ?? 0}
                  </span>
                )}
              </div>
              <a
                href={selectedPost.permalink}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-sm font-medium transition-colors hover:text-primary"
              >
                <Instagram className="h-4 w-4" /> Auf Instagram öffnen
              </a>
            </div>
            {selectedPost.caption && (
              <p className="mt-3 text-sm leading-relaxed text-foreground/90">{selectedPost.caption}</p>
            )}

            {commentsLoading && (
              <div className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                Kommentare werden geladen...
              </div>
            )}

            {commentsError && !commentsLoading && (
              <p className="mt-3 text-sm text-destructive">{commentsError}</p>
            )}

            {showComments && !commentsLoading && comments.length > 0 && (
              <div className="mt-3 max-h-40 space-y-3 overflow-y-auto rounded-2xl border border-border bg-muted/30 p-4">
                {comments.map((comment) => (
                  <div key={comment.id} className="text-sm">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span className="font-semibold text-foreground">{comment.username || "Instagram User"}</span>
                      <span>·</span>
                      <span>{new Date(comment.timestamp).toLocaleDateString("de-DE")}</span>
                    </div>
                    <p className="mt-1 leading-relaxed text-foreground/90">{comment.text}</p>
                  </div>
                ))}
              </div>
            )}

            {showComments && !commentsLoading && comments.length === 0 && !commentsError && (
              <p className="mt-3 text-sm text-muted-foreground">
                {(selectedPost.comments_count ?? 0) > 0
                  ? "Kommentare sind laut Instagram vorhanden, konnten aber nicht geladen werden. Der Access Token benötigt möglicherweise mehr Berechtigungen (z.B. instagram_basic oder pages_read_engagement)."
                  : "Keine Kommentare vorhanden."}
              </p>
            )}
          </div>
        </div>
      )}
    </>
  );
}
