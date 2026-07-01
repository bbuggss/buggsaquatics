// ============================================================
// forum.js — forum data helpers, shared by forum.html,
// forum-thread.html, and the "recent activity" widget on index.html
// Requires config.js + auth.js to be loaded first.
// ============================================================

const Forum = {
  async getCategories() {
    const { data, error } = await window.sb
      .from('forum_categories')
      .select('*, forum_threads(count)')
      .order('sort_order', { ascending: true });
    if (error) { console.warn('getCategories:', error.message); return []; }
    return data;
  },

  async getCategory(slug) {
    const { data, error } = await window.sb
      .from('forum_categories')
      .select('*')
      .eq('slug', slug)
      .single();
    if (error) { console.warn('getCategory:', error.message); return null; }
    return data;
  },

  async getRecentThreads(limit = 5, categoryId = null) {
    let q = window.sb
      .from('forum_threads')
      .select('*, profiles(username), forum_categories(name, slug), forum_posts(count)')
      .order('created_at', { ascending: false })
      .limit(limit);
    if (categoryId) q = q.eq('category_id', categoryId);
    const { data, error } = await q;
    if (error) { console.warn('getRecentThreads:', error.message); return []; }
    return data;
  },

  async getThread(id) {
    const { data, error } = await window.sb
      .from('forum_threads')
      .select('*, profiles(username), forum_categories(name, slug)')
      .eq('id', id)
      .single();
    if (error) { console.warn('getThread:', error.message); return null; }
    return data;
  },

  async getPosts(threadId) {
    const { data, error } = await window.sb
      .from('forum_posts')
      .select('*, profiles(username)')
      .eq('thread_id', threadId)
      .order('created_at', { ascending: true });
    if (error) { console.warn('getPosts:', error.message); return []; }
    return data;
  },

  async createThread(categoryId, authorId, title, firstPostBody) {
    const { data: thread, error } = await window.sb
      .from('forum_threads')
      .insert({ category_id: categoryId, author_id: authorId, title })
      .select()
      .single();
    if (error) throw error;

    const { error: postErr } = await window.sb
      .from('forum_posts')
      .insert({ thread_id: thread.id, author_id: authorId, body: firstPostBody });
    if (postErr) throw postErr;

    return thread;
  },

  async createPost(threadId, authorId, body) {
    const { data, error } = await window.sb
      .from('forum_posts')
      .insert({ thread_id: threadId, author_id: authorId, body })
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  timeAgo(iso) {
    const diff = (Date.now() - new Date(iso).getTime()) / 1000;
    if (diff < 60) return 'just now';
    if (diff < 3600) return Math.floor(diff / 60) + 'm ago';
    if (diff < 86400) return Math.floor(diff / 3600) + 'h ago';
    if (diff < 2592000) return Math.floor(diff / 86400) + 'd ago';
    return new Date(iso).toLocaleDateString();
  },
};
