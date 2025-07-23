import { 
  users, categories, actors, articles, userBookmarks, userFollows,
  type User, type InsertUser, type Category, type InsertCategory, 
  type Actor, type InsertActor, type Article, type InsertArticle,
  type UserBookmark, type InsertUserBookmark, type UserFollow, type InsertUserFollow,
  type ArticleWithDetails
} from "@shared/schema";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Category methods
  getCategories(): Promise<Category[]>;
  getCategoryBySlug(slug: string): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;

  // Actor methods
  getActors(): Promise<Actor[]>;
  getActorById(id: number): Promise<Actor | undefined>;
  getActorBySlug(slug: string): Promise<Actor | undefined>;
  createActor(actor: InsertActor): Promise<Actor>;

  // Article methods
  getArticles(categorySlug?: string, limit?: number, offset?: number): Promise<ArticleWithDetails[]>;
  getArticleById(id: number): Promise<ArticleWithDetails | undefined>;
  createArticle(article: InsertArticle): Promise<Article>;
  searchArticles(query: string): Promise<ArticleWithDetails[]>;
  getArticlesByHashtag(hashtag: string): Promise<ArticleWithDetails[]>;
  getArticlesByActor(actorId: number): Promise<ArticleWithDetails[]>;

  // User interaction methods
  bookmarkArticle(bookmark: InsertUserBookmark): Promise<UserBookmark>;
  removeBookmark(userId: number, articleId: number): Promise<void>;
  getUserBookmarks(userId: number): Promise<ArticleWithDetails[]>;
  followActor(follow: InsertUserFollow): Promise<UserFollow>;
  followHashtag(follow: InsertUserFollow): Promise<UserFollow>;
  unfollow(userId: number, actorId?: number, hashtag?: string): Promise<void>;
  getUserFollowing(userId: number): Promise<{ actors: Actor[], hashtags: string[] }>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private categories: Map<number, Category>;
  private actors: Map<number, Actor>;
  private articles: Map<number, Article>;
  private userBookmarks: Map<number, UserBookmark>;
  private userFollows: Map<number, UserFollow>;
  private currentId: { [key: string]: number };

  constructor() {
    this.users = new Map();
    this.categories = new Map();
    this.actors = new Map();
    this.articles = new Map();
    this.userBookmarks = new Map();
    this.userFollows = new Map();
    this.currentId = {
      users: 1,
      categories: 1,
      actors: 1,
      articles: 1,
      userBookmarks: 1,
      userFollows: 1,
    };

    this.seedData();
  }

  private seedData() {
    // Seed categories
    const categoryData = [
      { name: "Top", slug: "top", color: "hsl(267, 45%, 51%)", icon: "star" },
      { name: "Entertainment", slug: "entertainment", color: "hsl(35, 91%, 48%)", icon: "film" },
      { name: "Celebrity", slug: "celebrity", color: "hsl(0, 84%, 60%)", icon: "users" },
      { name: "Lifestyle", slug: "lifestyle", color: "hsl(325, 78%, 56%)", icon: "heart" },
      { name: "World", slug: "world", color: "hsl(158, 64%, 52%)", icon: "globe" },
      { name: "Tech", slug: "tech", color: "hsl(195, 91%, 42%)", icon: "cpu" },
    ];

    categoryData.forEach(cat => {
      const id = this.currentId.categories++;
      this.categories.set(id, { id, ...cat });
    });

    // Seed actors
    const actorData = [
      { 
        name: "Taylor Swift", 
        slug: "taylor-swift", 
        category: "music",
        sunSign: "Sagittarius",
        moonSign: "Cancer", 
        risingSign: "Scorpio",
        profileImage: "https://via.placeholder.com/128"
      },
      { 
        name: "Elon Musk", 
        slug: "elon-musk", 
        category: "tech",
        sunSign: "Cancer",
        moonSign: "Virgo", 
        risingSign: "Leo",
        profileImage: "https://via.placeholder.com/128"
      },
      { 
        name: "Beyoncé", 
        slug: "beyonce", 
        category: "music",
        sunSign: "Virgo",
        moonSign: "Scorpio", 
        risingSign: "Libra",
        profileImage: "https://via.placeholder.com/128"
      },
    ];

    actorData.forEach(actor => {
      const id = this.currentId.actors++;
      this.actors.set(id, { 
        id, 
        ...actor,
        sunSign: actor.sunSign || null,
        moonSign: actor.moonSign || null,
        risingSign: actor.risingSign || null,
        profileImage: actor.profileImage || null
      });
    });

    // Seed articles
    const articlesData = [
      {
        title: "Taylor Swift Announces Surprise Album During Mercury Retrograde",
        summary: "The pop superstar drops hints about her upcoming release, coinciding with powerful astrological transits...",
        content: "Full article content would go here...",
        categoryId: 3, // Celebrity
        astroAnalysis: "This announcement comes during a powerful Mercury retrograde period, highlighting themes of revisiting past work and unexpected revelations. Swift's natal Mercury in Capricorn suggests this timing is particularly significant for her creative expression.",
        astroGlyphs: [
          { planet: "mercury", color: "hsl(210, 100%, 50%)", symbol: "Rx" },
          { planet: "venus", color: "hsl(45, 100%, 50%)" },
          { planet: "mars", color: "hsl(0, 100%, 50%)" }
        ],
        hashtags: ["#TaylorSwift", "#mercuryretrograde", "#newmusic"],
        actorIds: [1],
        likeCount: 247,
        shareCount: 89,
        bookmarkCount: 156,
        isCelebrity: true,
      },
      {
        title: "Elon Musk Launches New Venture Under Powerful Jupiter Transit",
        summary: "SpaceX founder announces revolutionary project as Jupiter forms beneficial aspects to his natal chart...",
        content: "Full article content would go here...",
        categoryId: 6, // Tech
        astroAnalysis: "Musk's announcement coincides with Jupiter transiting his 10th house of career and public image, suggesting this venture will have significant impact on his legacy and public perception.",
        astroGlyphs: [
          { planet: "jupiter", color: "hsl(35, 100%, 50%)", symbol: "!" },
          { planet: "saturn", color: "hsl(45, 80%, 40%)" }
        ],
        hashtags: ["#ElonMusk", "#Jupiter", "#innovation"],
        actorIds: [2],
        likeCount: 189,
        shareCount: 67,
        bookmarkCount: 92,
        isCelebrity: true,
      },
      {
        title: "Global Climate Summit Begins During Powerful Eclipse Season",
        summary: "World leaders gather as lunar eclipse creates intense transformational energy for environmental policy...",
        content: "Full article content would go here...",
        categoryId: 5, // World
        astroAnalysis: "The lunar eclipse in Scorpio brings intense transformational energy to global environmental discussions, highlighting the need for deep, systemic changes in how we approach climate policy.",
        astroGlyphs: [
          { planet: "moon", color: "hsl(210, 15%, 40%)", symbol: "!" },
          { planet: "sun", color: "hsl(45, 100%, 60%)" },
          { planet: "pluto", color: "hsl(260, 70%, 40%)" }
        ],
        hashtags: ["#eclipse", "#climate", "#transformation", "#globalchange"],
        actorIds: [],
        likeCount: 324,
        shareCount: 143,
        bookmarkCount: 78,
        isCelebrity: false,
      },
      {
        title: "Venus in Gemini Brings Social Renaissance to Dating Apps",
        summary: "Astrologers report surge in romantic connections as Venus enters communicative Gemini, affecting social dynamics...",
        content: "Full article content would go here...",
        categoryId: 4, // Lifestyle
        astroAnalysis: "Venus's transit through Gemini encourages communication, curiosity, and intellectual connection in relationships. This is an ideal time for meeting new people and exploring different forms of romantic expression.",
        astroGlyphs: [
          { planet: "venus", color: "hsl(325, 100%, 60%)" },
          { planet: "mercury", color: "hsl(200, 100%, 50%)" }
        ],
        hashtags: ["#VenusInGemini", "#dating", "#relationships"],
        actorIds: [],
        likeCount: 156,
        shareCount: 45,
        bookmarkCount: 67,
        isCelebrity: false,
      }
    ];

    articlesData.forEach(article => {
      const id = this.currentId.articles++;
      this.articles.set(id, { 
        id, 
        publishedAt: new Date(), 
        ...article,
        astroGlyphs: article.astroGlyphs as { planet: string; color: string; symbol?: string; }[]
      });
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId.users++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getCategories(): Promise<Category[]> {
    return Array.from(this.categories.values());
  }

  async getCategoryBySlug(slug: string): Promise<Category | undefined> {
    return Array.from(this.categories.values()).find(cat => cat.slug === slug);
  }

  async createCategory(insertCategory: InsertCategory): Promise<Category> {
    const id = this.currentId.categories++;
    const category: Category = { id, ...insertCategory };
    this.categories.set(id, category);
    return category;
  }

  async getActors(): Promise<Actor[]> {
    return Array.from(this.actors.values());
  }

  async getActorById(id: number): Promise<Actor | undefined> {
    return this.actors.get(id);
  }

  async getActorBySlug(slug: string): Promise<Actor | undefined> {
    return Array.from(this.actors.values()).find(actor => actor.slug === slug);
  }

  async createActor(insertActor: InsertActor): Promise<Actor> {
    const id = this.currentId.actors++;
    const actor: Actor = { 
      id, 
      ...insertActor,
      sunSign: insertActor.sunSign || null,
      moonSign: insertActor.moonSign || null,
      risingSign: insertActor.risingSign || null,
      profileImage: insertActor.profileImage || null
    };
    this.actors.set(id, actor);
    return actor;
  }

  async getArticles(categorySlug?: string, limit = 20, offset = 0): Promise<ArticleWithDetails[]> {
    let articleList = Array.from(this.articles.values());
    
    if (categorySlug && categorySlug !== 'top') {
      const category = await this.getCategoryBySlug(categorySlug);
      if (category) {
        articleList = articleList.filter(article => article.categoryId === category.id);
      }
    }

    articleList.sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime());
    
    const paginatedArticles = articleList.slice(offset, offset + limit);
    
    return Promise.all(paginatedArticles.map(async (article) => {
      const category = this.categories.get(article.categoryId)!;
      const actors = article.actorIds.map(id => this.actors.get(id)!).filter(Boolean);
      return { ...article, category, actors };
    }));
  }

  async getArticleById(id: number): Promise<ArticleWithDetails | undefined> {
    const article = this.articles.get(id);
    if (!article) return undefined;
    
    const category = this.categories.get(article.categoryId)!;
    const actors = article.actorIds.map(id => this.actors.get(id)!).filter(Boolean);
    return { ...article, category, actors };
  }

  async createArticle(insertArticle: InsertArticle): Promise<Article> {
    const id = this.currentId.articles++;
    const article: Article = { 
      id, 
      publishedAt: new Date(), 
      ...insertArticle,
      astroGlyphs: insertArticle.astroGlyphs as { planet: string; color: string; symbol?: string; }[]
    };
    this.articles.set(id, article);
    return article;
  }

  async searchArticles(query: string): Promise<ArticleWithDetails[]> {
    const lowercaseQuery = query.toLowerCase();
    const matchingArticles = Array.from(this.articles.values()).filter(article => 
      article.title.toLowerCase().includes(lowercaseQuery) ||
      article.summary.toLowerCase().includes(lowercaseQuery) ||
      article.hashtags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
    );

    return Promise.all(matchingArticles.map(async (article) => {
      const category = this.categories.get(article.categoryId)!;
      const actors = article.actorIds.map(id => this.actors.get(id)!).filter(Boolean);
      return { ...article, category, actors };
    }));
  }

  async getArticlesByHashtag(hashtag: string): Promise<ArticleWithDetails[]> {
    const matchingArticles = Array.from(this.articles.values()).filter(article => 
      article.hashtags.some(tag => tag.toLowerCase() === hashtag.toLowerCase())
    );

    return Promise.all(matchingArticles.map(async (article) => {
      const category = this.categories.get(article.categoryId)!;
      const actors = article.actorIds.map(id => this.actors.get(id)!).filter(Boolean);
      return { ...article, category, actors };
    }));
  }

  async getArticlesByActor(actorId: number): Promise<ArticleWithDetails[]> {
    const matchingArticles = Array.from(this.articles.values()).filter(article => 
      article.actorIds.includes(actorId)
    );

    return Promise.all(matchingArticles.map(async (article) => {
      const category = this.categories.get(article.categoryId)!;
      const actors = article.actorIds.map(id => this.actors.get(id)!).filter(Boolean);
      return { ...article, category, actors };
    }));
  }

  async bookmarkArticle(insertBookmark: InsertUserBookmark): Promise<UserBookmark> {
    const id = this.currentId.userBookmarks++;
    const bookmark: UserBookmark = { id, createdAt: new Date(), ...insertBookmark };
    this.userBookmarks.set(id, bookmark);
    return bookmark;
  }

  async removeBookmark(userId: number, articleId: number): Promise<void> {
    const bookmark = Array.from(this.userBookmarks.values()).find(
      b => b.userId === userId && b.articleId === articleId
    );
    if (bookmark) {
      this.userBookmarks.delete(bookmark.id);
    }
  }

  async getUserBookmarks(userId: number): Promise<ArticleWithDetails[]> {
    const userBookmarks = Array.from(this.userBookmarks.values()).filter(
      bookmark => bookmark.userId === userId
    );
    
    const articles = userBookmarks.map(bookmark => this.articles.get(bookmark.articleId)!).filter(Boolean);
    
    return Promise.all(articles.map(async (article) => {
      const category = this.categories.get(article.categoryId)!;
      const actors = article.actorIds.map(id => this.actors.get(id)!).filter(Boolean);
      return { ...article, category, actors };
    }));
  }

  async followActor(insertFollow: InsertUserFollow): Promise<UserFollow> {
    const id = this.currentId.userFollows++;
    const follow: UserFollow = { 
      id, 
      createdAt: new Date(), 
      ...insertFollow,
      hashtag: insertFollow.hashtag || null,
      actorId: insertFollow.actorId || null
    };
    this.userFollows.set(id, follow);
    return follow;
  }

  async followHashtag(insertFollow: InsertUserFollow): Promise<UserFollow> {
    const id = this.currentId.userFollows++;
    const follow: UserFollow = { 
      id, 
      createdAt: new Date(), 
      ...insertFollow,
      hashtag: insertFollow.hashtag || null,
      actorId: insertFollow.actorId || null
    };
    this.userFollows.set(id, follow);
    return follow;
  }

  async unfollow(userId: number, actorId?: number, hashtag?: string): Promise<void> {
    const follow = Array.from(this.userFollows.values()).find(f => 
      f.userId === userId && 
      (actorId ? f.actorId === actorId : f.hashtag === hashtag)
    );
    if (follow) {
      this.userFollows.delete(follow.id);
    }
  }

  async getUserFollowing(userId: number): Promise<{ actors: Actor[], hashtags: string[] }> {
    const follows = Array.from(this.userFollows.values()).filter(f => f.userId === userId);
    
    const actors = follows
      .filter(f => f.actorId)
      .map(f => this.actors.get(f.actorId!)!)
      .filter(Boolean);
    
    const hashtags = follows
      .filter(f => f.hashtag)
      .map(f => f.hashtag!);

    return { actors, hashtags };
  }
}

export const storage = new MemStorage();
