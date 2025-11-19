import { v4 as uuidv4 } from "uuid";

// In-memory store for search queries (use Redis or DB in prod)
export default class SearchStore {
  constructor() {
    this.searches = new Map();
    this.TTL = 15 * 60 * 1000; // 15 minutes TTL
  }

  createSearch(searchQuery) {
    const searchId = uuidv4();
    const search = {
      id: searchId,
      query: searchQuery,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + this.TTL),
    };

    this.searches.set(searchId, search);

    this.cleanupExpiredSearches();

    return search;
  }

  getSearch(searchId) {
    const search = this.searches.get(searchId);

    if (!search) {
      return null;
    }

    if (this.isSearchExpired(search)) {
      this.searches.delete(searchId);
      return null;
    }

    return search;
  }

  cleanupExpiredSearches() {
    const now = new Date();
    for (const [searchId, search] of this.searches.entries()) {
      if (this.isSearchExpired(search, now)) {
        this.searches.delete(searchId);
      }
    }
  }

  isSearchExpired(search, now = new Date()) {
    return now > search.expiresAt;
  }

  getAllSearches() {
    return Array.from(this.searches.values());
  }
}
