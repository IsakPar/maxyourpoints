# 🚀 Max Your Points CMS - Complete Pre-Launch Roadmap

## 🎯 **EXECUTIVE SUMMARY**

**Current Status**: CMS core functionality working, article management complete  
**Target**: Production-ready launch in 2-3 weeks  
**Critical Path**: Security → Core UX → Advanced Features  

---

## 📋 **PHASE 1: CRITICAL FIXES** (Week 1 - Launch Blockers)

### 🔥 **IMMEDIATE (Next 2 Days)**
| Task | Priority | Time | Difficulty | Notes |
|------|----------|------|------------|-------|
| **Fix Port Issues** | 🔴 CRITICAL | 30min | 🟢 Easy | Still seeing 3000→3001 errors |
| **Re-enable Middleware** | 🔴 CRITICAL | 1hr | 🟢 Easy | Authentication currently disabled |
| **Fix About Page** | 🟠 HIGH | 2hrs | 🟢 Easy | User-requested, public-facing |
| **Fix Admin Dashboard** | 🟠 HIGH | 2hrs | 🟢 Easy | Clean up /admin homepage |

**Implementation Order**: Port → Middleware → About → Dashboard

### 🛡️ **SECURITY HARDENING** (Days 3-4)
| Task | Priority | Time | Difficulty | Implementation |
|------|----------|------|------------|----------------|
| **Authentication Roles** | 🔴 CRITICAL | 6hrs | 🟡 Medium | Custom table: `user_roles` with admin/editor/author |
| **API Security** | 🔴 CRITICAL | 4hrs | 🟡 Medium | Rate limiting, CORS, input validation |
| **Environment Security** | 🔴 CRITICAL | 2hrs | 🟢 Easy | Remove hardcoded secrets, secure .env |
| **HTTPS Setup** | 🔴 CRITICAL | 2hrs | 🟡 Medium | SSL certificates, secure headers |

**Roles Implementation**:
```sql
-- Add to Supabase
CREATE TABLE user_roles (
  user_id UUID REFERENCES auth.users(id),
  role TEXT CHECK (role IN ('admin', 'editor', 'author')),
  created_at TIMESTAMP DEFAULT NOW()
);
```

### 📱 **CORE UX** (Days 5-7)
| Task | Priority | Time | Difficulty | Implementation |
|------|----------|------|------------|----------------|
| **Mobile Optimization** | 🟠 HIGH | 6hrs | 🟡 Medium | Responsive design, touch interactions |
| **Error Handling** | 🟠 HIGH | 4hrs | 🟡 Medium | Error boundaries, graceful failures |
| **Loading States** | 🟠 HIGH | 3hrs | 🟢 Easy | Skeletons, spinners, progress bars |
| **Legal Pages** | 🔴 CRITICAL | 2hrs | 🟢 Easy | Privacy, Terms, Cookies (GDPR compliance) |

---

## 📋 **PHASE 2: PRODUCTION READINESS** (Week 2)

### 🔧 **INFRASTRUCTURE** 
| Task | Priority | Time | Difficulty | Implementation |
|------|----------|------|------------|----------------|
| **Email Integration (Resend)** | 🟠 HIGH | 6hrs | 🟡 Medium | Newsletter, contact forms, notifications |
| **Image Optimization** | 🟠 HIGH | 4hrs | 🟡 Medium | Next.js Image, WebP conversion, CDN |
| **Caching Strategy** | 🟠 HIGH | 4hrs | 🟡 Medium | Redis/Vercel cache, API response caching |
| **Database Backup** | 🔴 CRITICAL | 2hrs | 🟢 Easy | Automated Supabase backups |

### 📊 **SEO & ANALYTICS**
| Task | Priority | Time | Difficulty | Implementation |
|------|----------|------|------------|----------------|
| **Sitemap Generation** | 🟠 HIGH | 3hrs | 🟡 Medium | Dynamic XML sitemap from articles |
| **Meta Tags Optimization** | 🟠 HIGH | 4hrs | 🟡 Medium | OpenGraph, Twitter Cards, JSON-LD |
| **Google Analytics** | 🟠 HIGH | 2hrs | 🟢 Easy | GA4 integration, conversion tracking |
| **Search Console** | 🟠 HIGH | 1hr | 🟢 Easy | Verify ownership, submit sitemap |

### 🧹 **CODEBASE CLEANUP**
| Task | Priority | Time | Difficulty | Notes |
|------|----------|------|------------|-------|
| **Remove Unused Components** | 🟡 MEDIUM | 4hrs | 🟢 Easy | 20+ deleted editor components, old files |
| **Bundle Optimization** | 🟡 MEDIUM | 3hrs | 🟡 Medium | Tree shaking, code splitting |
| **TypeScript Strictness** | 🟡 MEDIUM | 6hrs | 🟡 Medium | Fix any/unknown types, strict mode |

---

## 📋 **PHASE 3: ADVANCED FEATURES** (Week 3+)

### 🤖 **AI-POWERED FEATURES**
| Task | Priority | Time | Difficulty | Implementation Approach |
|------|----------|------|------------|-------------------------|
| **Article Recognition Engine** | 🟡 MEDIUM | 3 days | 🔴 Very Hard | OpenAI Embeddings + Vector DB |
| **Internal Linking Suggestions** | 🟡 MEDIUM | 2 days | 🔴 Hard | Semantic similarity matching |

**Article Recognition Implementation**:
```typescript
// High-level approach
1. Generate embeddings for all articles (OpenAI text-embedding-3-small)
2. Store in Supabase with pgvector extension
3. Real-time similarity search during writing
4. Suggest related articles for internal linking
```

### ⚡ **LIVE PREVIEW SYSTEM**
| Task | Priority | Time | Difficulty | Implementation Approach |
|------|----------|------|------------|-------------------------|
| **Real-time Preview** | 🟡 MEDIUM | 2 days | 🟠 Hard | WebSocket + React state sync |
| **Image Live Updates** | 🟡 MEDIUM | 1 day | 🟡 Medium | File upload events, blob URLs |

**Live Preview Implementation**:
```typescript
// Approach: Server-Sent Events (simpler than WebSocket)
1. Debounced content changes (500ms)
2. Send to preview endpoint via SSE
3. Real-time markdown → HTML conversion
4. Update preview iframe without refresh
```

### 📈 **CONTENT MANAGEMENT**
| Task | Priority | Time | Difficulty | Notes |
|------|----------|------|------------|-------|
| **Auto-save Drafts** | 🟡 MEDIUM | 4hrs | 🟡 Medium | Every 30 seconds, conflict resolution |
| **Content Versioning** | 🟢 LOW | 8hrs | 🟠 Hard | History tracking, rollback capability |
| **Bulk Operations** | 🟢 LOW | 6hrs | 🟡 Medium | Multi-select, batch publish/delete |

---

## 🎯 **RECOMMENDED IMPLEMENTATION ORDER**

### **Sprint 1: Foundation (Days 1-3)**
```
Day 1: Port fixes → Middleware → About page
Day 2: Admin dashboard → Start authentication roles
Day 3: Complete auth system → Begin API security
```

### **Sprint 2: Security & Core (Days 4-7)**
```
Day 4: API security → HTTPS setup
Day 5: Mobile optimization → Error handling  
Day 6: Loading states → Legal pages
Day 7: Email integration setup
```

### **Sprint 3: Production (Days 8-14)**
```
Week 2: SEO, Analytics, Image optimization
Week 2 End: Codebase cleanup, performance
```

### **Sprint 4: Advanced (Days 15+)**
```
Week 3: Live preview system
Week 4: Article recognition engine (if desired)
```

---

## ⚡ **QUICK WINS** (Can be done in parallel)

### **1-Hour Tasks**
- [ ] Legal pages content
- [ ] Google Analytics setup
- [ ] Search Console verification  
- [ ] Environment variables audit
- [ ] Basic error boundaries

### **2-Hour Tasks**
- [ ] About page redesign
- [ ] Admin dashboard cleanup
- [ ] Mobile responsive fixes
- [ ] Loading skeleton components
- [ ] Image optimization setup

---

## 🚨 **BLOCKERS TO WATCH**

### **Technical Risks**
1. **Supabase RLS Policies** - Complex role-based permissions
2. **Live Preview** - WebSocket complexity, state synchronization
3. **AI Features** - API costs, rate limiting, vector database setup

### **Business Risks**
1. **Legal Compliance** - GDPR, privacy policies must be accurate
2. **SEO Impact** - Improper redirects, broken links
3. **Performance** - Image loading, cache misses

---

## 💡 **IMPLEMENTATION RECOMMENDATIONS**

### **For Article Recognition Engine** (Your specific request)
**Difficulty**: 🔴 Very Hard (3+ days)
**Approach**: 
1. Start with simple keyword matching
2. Upgrade to OpenAI embeddings later
3. Use Supabase pgvector extension
```sql
-- Enable vector similarity
CREATE EXTENSION vector;
ALTER TABLE articles ADD COLUMN embedding vector(1536);
```

### **For Live Preview** (Your specific request)
**Difficulty**: 🟠 Hard (2 days)
**Approach**:
1. Server-Sent Events (simpler than WebSocket)
2. Debounced updates (every 500ms)
3. Split-screen layout with live HTML rendering

### **For Authentication Roles**
**Difficulty**: 🟡 Medium (6 hours)
**Approach**:
1. Custom `user_roles` table in Supabase
2. Middleware role checking
3. UI role management in admin panel

---

## 🎯 **SUCCESS METRICS**

### **Launch Ready Checklist**
- [ ] All pages load under 3 seconds
- [ ] Mobile-responsive design
- [ ] SSL certificate active
- [ ] Error handling in place
- [ ] Legal pages published
- [ ] Analytics tracking
- [ ] Admin authentication working
- [ ] Article management fully functional

### **Post-Launch Goals**
- [ ] 95% uptime
- [ ] Core Web Vitals: Good
- [ ] Search engine indexing
- [ ] Email notifications working
- [ ] User roles functional

---

**🎯 FINAL RECOMMENDATION**: Focus on Phase 1 and 2 for launch. Phase 3 features (AI, live preview) are impressive but not essential for a successful launch. Get the foundation rock-solid first, then add advanced features based on user feedback.






## Suggestion **Natural Language Explanation of the Recommendation System**

### **What We're Building**

Think of this as a "content matchmaker" for your travel blog. Just like how Spotify finds similar songs or Netflix suggests related shows, this system finds articles that share DNA - even if they're in completely different categories.

### **The Core Problem**

You write an article about "Travel Hacks to Maximize Amex Points" (in the Travel Hacks category) and another about "Centurion Lounge at Arlanda" (in the Lounges category). These articles are related because they both talk about American Express benefits, but a simple category-based system would never connect them.

### **How It Works - The Coffee Shop Analogy**

Imagine each article is a person in a coffee shop, and they're all talking about their interests:

1. **Everyone gets a "conversation profile"** - We listen to what each article talks about and create a profile. Articles that mention "Amex" a lot get a high "Amex score." Articles about "centurion lounges" get a high score for that topic.

2. **Some topics are VIP** - Just like certain people at a party are more interesting, certain words matter more. "American Express" is a VIP term in travel blogging, while common words like "the" or "and" are ignored.

3. **Finding similar conversations** - We compare articles by seeing how much their conversation profiles overlap. Two articles that both talk a lot about Amex and lounges will score high, even if one is a credit card review and the other is a lounge guide.

### **The Secret Sauce - TF-IDF Explained Simply**

**TF-IDF** sounds complex but it's simple:
- **TF (Term Frequency)**: How often does this article mention "Amex"? If it says "Amex" 10 times, that's important.
- **IDF (Inverse Document Frequency)**: Is "Amex" special or does everyone talk about it? If only 5 out of 100 articles mention "Amex," it's special. If 90 out of 100 mention "travel," it's common.

Together: Articles that frequently mention rare, specific terms get connected.

### **The Vector Part - No PhD Required**

A "vector" is just a scorecard. Each article gets scores for different topics:

```
Article A (Travel Hack):
- Amex: 8.5 points
- Centurion Lounge: 2.1 points  
- Points maximization: 7.8 points

Article B (Lounge Review):
- Amex: 5.2 points
- Centurion Lounge: 12.4 points
- Lounge access: 8.1 points
```

We compare these scorecards to find similarity. Both mention Amex? Great! Both talk about Centurion? Even better!

### **Why Categories Don't Matter Anymore**

Traditional approach: "This is a credit card article, only show other credit card articles."

Our approach: "This article talks about Amex, lounges, and Stockholm. Show me anything else that talks about those things, regardless of category."

### **Real World Example**

Let's say someone reads your article "How I Got 100K Amex Points in 3 Months." The system thinks:

1. **Scans the article**: Finds heavy mentions of "Amex," "Platinum card," "welcome bonus," "minimum spend"
2. **Searches everything**: Looks at ALL articles, not just the "Credit Cards" category
3. **Finds connections**:
   - "Centurion Lounge Guide" → Shares "Amex" and "Platinum" terms
   - "Best Ways to Hit Minimum Spend" → Shares "minimum spend" concept
   - "Why I Downgraded from Amex Platinum" → High "Amex Platinum" overlap
   - "Priority Pass vs Centurion Lounges" → Mentions both programs

### **The Smart Entity Recognition**

The system knows that:
- "American Express" = "Amex" = "AmEx" 
- "Centurion Lounge" = "Amex Centurion"
- "CSR" = "Chase Sapphire Reserve"

So articles don't need exact word matches to be connected.

### **Performance & Efficiency**

Instead of analyzing every article against every other article each time (which would be slow), we:
1. **Pre-calculate** each article's profile when it's published
2. **Store the scores** in a fast-access database
3. **Update only what changes** when you edit an article
4. **Cache results** so repeated requests are instant

### **The Magic Moment**

When a reader finishes "5 Travel Hacks for Amex Points," they see:

**"You might also enjoy:"**
- Complete Guide to Centurion Lounges *(Both discuss Amex Platinum benefits)*
- Maximizing Welcome Bonuses in 2025 *(Similar points-earning strategies)*
- Is the Amex Platinum Still Worth It? *(Related card analysis)*

Each recommendation shows WHY it's related, building trust and encouraging clicks.

### **What Makes This Special**

1. **No AI costs** - It's just smart math, not GPT-4
2. **Cross-category discovery** - Finds hidden connections
3. **Gets smarter over time** - As you add more articles, connections improve
4. **Transparent** - Can always explain why two articles are related
5. **Fast** - Milliseconds, not seconds

Think of it as building a map of your content where articles are cities and shared topics are the roads connecting them. The more specific the shared topic (like "Amex Centurion"), the stronger the road.
## 🎯 **Cross-Category Vector Scoring System**

### **1. TF-IDF Based Approach (No ML Required)**

```typescript
// src/lib/services/lightweight-vectorizer.ts
export class LightweightVectorizer {
  private idfCache: Map<string, number> = new Map();
  
  /**
   * Create TF-IDF vectors for all articles
   */
  async buildVectorIndex(articles: Article[]): Promise<ArticleVector[]> {
    // 1. Build document frequency map
    const docFrequency = new Map<string, number>();
    const totalDocs = articles.length;
    
    for (const article of articles) {
      const tokens = this.tokenize(article.title + ' ' + article.content);
      const uniqueTokens = new Set(tokens);
      
      uniqueTokens.forEach(token => {
        docFrequency.set(token, (docFrequency.get(token) || 0) + 1);
      });
    }
    
    // 2. Calculate IDF for each term
    docFrequency.forEach((freq, term) => {
      const idf = Math.log(totalDocs / freq);
      this.idfCache.set(term, idf);
    });
    
    // 3. Create vectors for each article
    return articles.map(article => this.vectorizeArticle(article));
  }
  
  /**
   * Convert article to vector representation
   */
  private vectorizeArticle(article: Article): ArticleVector {
    const tokens = this.tokenize(article.title + ' ' + article.content);
    const termFrequency = new Map<string, number>();
    
    // Count term frequencies
    tokens.forEach(token => {
      termFrequency.set(token, (termFrequency.get(token) || 0) + 1);
    });
    
    // Create weighted vector focusing on travel entities
    const vector = new Map<string, number>();
    
    termFrequency.forEach((tf, term) => {
      const idf = this.idfCache.get(term) || 0;
      let weight = tf * idf;
      
      // Boost travel-specific terms
      if (this.isTravelEntity(term)) {
        weight *= 3; // Triple weight for travel entities
      }
      
      vector.set(term, weight);
    });
    
    return {
      articleId: article.id,
      vector,
      entities: this.extractKeyEntities(article),
      magnitude: this.calculateMagnitude(vector)
    };
  }
  
  /**
   * Smart tokenization that preserves important phrases
   */
  private tokenize(text: string): string[] {
    const lower = text.toLowerCase();
    
    // Preserve important multi-word entities
    const preservedPhrases = [
      'american express', 'centurion lounge', 'priority pass',
      'chase sapphire', 'business class', 'first class',
      'lounge access', 'credit card', 'annual fee'
    ];
    
    let processed = lower;
    const placeholders = new Map<string, string>();
    
    // Replace phrases with placeholders
    preservedPhrases.forEach((phrase, i) => {
      const placeholder = `__phrase${i}__`;
      processed = processed.replace(new RegExp(phrase, 'g'), placeholder);
      placeholders.set(placeholder, phrase.replace(' ', '_'));
    });
    
    // Tokenize
    let tokens = processed
      .replace(/[^a-z0-9_\s]/g, ' ')
      .split(/\s+/)
      .filter(t => t.length > 2);
    
    // Restore phrases
    tokens = tokens.map(token => placeholders.get(token) || token);
    
    return tokens;
  }
}
```

### **2. Cosine Similarity Scoring**

```typescript
// src/lib/services/vector-similarity.ts
export class VectorSimilarity {
  /**
   * Calculate similarity between two articles using cosine similarity
   */
  calculateSimilarity(a: ArticleVector, b: ArticleVector): SimilarityResult {
    const sharedTerms = new Set<string>();
    let dotProduct = 0;
    
    // Calculate dot product and find shared terms
    a.vector.forEach((weightA, term) => {
      const weightB = b.vector.get(term);
      if (weightB) {
        dotProduct += weightA * weightB;
        sharedTerms.add(term);
      }
    });
    
    // Cosine similarity
    const cosineSim = dotProduct / (a.magnitude * b.magnitude);
    
    // Entity overlap bonus (for your Amex example)
    const entityBonus = this.calculateEntityOverlap(a.entities, b.entities);
    
    // Combined score
    const finalScore = (cosineSim * 100) + (entityBonus * 50);
    
    // Identify key connections
    const connections = this.identifyConnections(a, b, sharedTerms);
    
    return {
      articleId: b.articleId,
      score: finalScore,
      cosineSimilarity: cosineSim,
      entityOverlap: entityBonus,
      connections
    };
  }
  
  /**
   * Calculate entity overlap with smart weighting
   */
  private calculateEntityOverlap(a: ExtractedEntities, b: ExtractedEntities): number {
    let overlap = 0;
    
    // Credit cards are super important for cross-category links
    const sharedCards = this.getShared(a.creditCards, b.creditCards);
    overlap += sharedCards.length * 0.4;
    
    // Airlines/alliances create strong connections
    const sharedAirlines = this.getShared(a.airlines, b.airlines);
    overlap += sharedAirlines.length * 0.3;
    
    // Airports still matter
    const sharedAirports = this.getShared(a.airports, b.airports);
    overlap += sharedAirports.length * 0.2;
    
    // Lounges
    const sharedLounges = this.getShared(a.lounges, b.lounges);
    overlap += sharedLounges.length * 0.3;
    
    return overlap;
  }
  
  /**
   * Identify why articles are connected
   */
  private identifyConnections(
    a: ArticleVector, 
    b: ArticleVector, 
    sharedTerms: Set<string>
  ): string[] {
    const connections: string[] = [];
    
    // Check for specific entity connections
    if (this.getShared(a.entities.creditCards, b.entities.creditCards).includes('amex')) {
      connections.push('Both discuss American Express benefits');
    }
    
    if (sharedTerms.has('centurion_lounge') || sharedTerms.has('lounge_access')) {
      connections.push('Related lounge access content');
    }
    
    // Look for concept connections
    const concepts = ['business_class', 'first_class', 'award_booking', 'status_match'];
    const sharedConcepts = concepts.filter(c => sharedTerms.has(c));
    
    if (sharedConcepts.length > 0) {
      connections.push(`Similar topics: ${sharedConcepts.join(', ')}`);
    }
    
    return connections;
  }
}
```

### **3. Optimized Recommendation Engine**

```typescript
// src/lib/services/smart-recommendation-engine.ts
export class SmartRecommendationEngine {
  private vectorizer: LightweightVectorizer;
  private similarity: VectorSimilarity;
  private vectorIndex: Map<string, ArticleVector> = new Map();
  
  constructor() {
    this.vectorizer = new LightweightVectorizer();
    this.similarity = new VectorSimilarity();
  }
  
  /**
   * Build or rebuild the vector index
   */
  async rebuildIndex(): Promise<void> {
    console.log('Rebuilding vector index...');
    
    const allArticles = await db.articles.find({ status: 'published' });
    const vectors = await this.vectorizer.buildVectorIndex(allArticles);
    
    // Store in memory (or Redis for production)
    this.vectorIndex.clear();
    vectors.forEach(v => this.vectorIndex.set(v.articleId, v));
    
    console.log(`Index built with ${vectors.length} articles`);
  }
  
  /**
   * Get recommendations across ALL categories
   */
  async getSmartRecommendations(
    articleId: string, 
    options: {
      limit?: number;
      minScore?: number;
      boostSameCategory?: boolean;
    } = {}
  ): Promise<SmartRecommendation[]> {
    const { limit = 5, minScore = 20, boostSameCategory = true } = options;
    
    // Get article vector
    const articleVector = this.vectorIndex.get(articleId);
    if (!articleVector) {
      // Article not in index, compute on the fly
      const article = await db.articles.findById(articleId);
      const vector = await this.vectorizer.vectorizeArticle(article);
      this.vectorIndex.set(articleId, vector);
      return this.getSmartRecommendations(articleId, options);
    }
    
    // Compare with ALL other articles
    const scores: SimilarityResult[] = [];
    
    for (const [otherId, otherVector] of this.vectorIndex) {
      if (otherId === articleId) continue;
      
      const similarity = this.similarity.calculateSimilarity(
        articleVector, 
        otherVector
      );
      
      // Optional category boost
      if (boostSameCategory) {
        const article = await db.articles.findById(articleId);
        const other = await db.articles.findById(otherId);
        
        if (article.category === other.category) {
          similarity.score *= 1.2; // 20% boost for same category
        }
      }
      
      if (similarity.score >= minScore) {
        scores.push(similarity);
      }
    }
    
    // Sort and get top results
    const topResults = scores
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);
    
    // Enrich with article data
    return this.enrichResults(topResults);
  }
  
  /**
   * Update single article in index
   */
  async updateArticleVector(articleId: string): Promise<void> {
    const article = await db.articles.findById(articleId);
    const vector = await this.vectorizer.vectorizeArticle(article);
    this.vectorIndex.set(articleId, vector);
  }
}
```

### **4. Example: Travel Hack → Centurion Lounge Connection**

```typescript
// Article A: "5 Travel Hacks to Maximize Your Amex Points"
// Category: Travel Hacks
const travelHackVector = {
  'amex': 8.5,          // High TF-IDF score
  'points': 6.2,
  'maximize': 4.1,
  'centurion_lounge': 2.1,  // Mentioned once
  'travel_hack': 7.8,
  entities: {
    creditCards: ['amex-plat', 'amex-gold']
  }
};

// Article B: "Complete Guide to Centurion Lounges"
// Category: Lounges
const loungeVector = {
  'centurion_lounge': 12.4,  // Very high score
  'amex': 5.2,              // Moderate score
  'lounge_access': 8.1,
  'platinum_card': 4.3,
  entities: {
    creditCards: ['amex-plat'],
    lounges: ['centurion']
  }
};

// Similarity calculation:
// - Cosine similarity: 0.42 (moderate text overlap)
// - Entity bonus: 0.4 (shared Amex Platinum)
// - Final score: 62 (well above threshold!)
// - Connection: "Both discuss American Express benefits"
```

### **5. Implementation Tips**

```typescript
// Periodic index rebuild (daily)
cron.schedule('0 3 * * *', async () => {
  await recommendationEngine.rebuildIndex();
});

// Real-time updates
async function onArticleSave(article: Article) {
  // Update just this article's vector
  await recommendationEngine.updateArticleVector(article.id);
}

// Smart caching with Redis
class CachedRecommendationEngine extends SmartRecommendationEngine {
  async getSmartRecommendations(articleId: string, options = {}) {
    const cacheKey = `recs:${articleId}:${JSON.stringify(options)}`;
    
    // Check cache
    const cached = await redis.get(cacheKey);
    if (cached) return JSON.parse(cached);
    
    // Calculate
    const recs = await super.getSmartRecommendations(articleId, options);
    
    // Cache for 6 hours
    await redis.setex(cacheKey, 21600, JSON.stringify(recs));
    
    return recs;
  }
}
```

## **Why This Works**

1. **No ML costs**: Just math and smart weighting
2. **Cross-category**: Finds connections anywhere
3. **Entity-aware**: Credit cards, airlines, etc. get boosted
4. **Fast**: Vectors can be precomputed and cached
5. **Explainable**: Shows why articles are connected

Your Amex travel hack article will now connect to Centurion Lounge articles because:
- High weight on shared "amex" term
- Entity overlap on credit cards
- Related concepts detected

Want me to show how to add user behavior tracking to improve recommendations over time?