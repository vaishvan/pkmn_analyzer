// Simple in-memory cache for analysis results
class AnalysisCache {
  constructor(ttl = 60 * 60 * 1000) { // 1 hour default TTL
    this.cache = new Map();
    this.ttl = ttl;
  }

  // Generate cache key from team data
  generateKey(yourTeam, opponentTeam) {
    const normalize = (team) => team
      .filter(p => p && p.name)
      .map(p => ({
        name: p.name.toLowerCase(),
        types: p.types ? p.types.sort() : [],
        abilities: p.abilities ? p.abilities.sort() : []
      }))
      .sort((a, b) => a.name.localeCompare(b.name));

    const normalizedData = {
      yourTeam: normalize(yourTeam),
      opponentTeam: normalize(opponentTeam)
    };

    return JSON.stringify(normalizedData);
  }

  get(key) {
    const item = this.cache.get(key);
    if (!item) return null;

    if (Date.now() > item.expiry) {
      this.cache.delete(key);
      return null;
    }

    return item.data;
  }

  set(key, data) {
    this.cache.set(key, {
      data,
      expiry: Date.now() + this.ttl
    });
  }

  clear() {
    this.cache.clear();
  }

  getStats() {
    const now = Date.now();
    let expired = 0;
    let active = 0;

    for (const [key, item] of this.cache.entries()) {
      if (now > item.expiry) {
        expired++;
      } else {
        active++;
      }
    }

    return { active, expired, total: this.cache.size };
  }
}

export const analysisCache = new AnalysisCache();
