import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  color: text("color").notNull(),
  icon: text("icon").notNull(),
});

export const actors = pgTable("actors", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  category: text("category").notNull(),
  sunSign: text("sun_sign"),
  moonSign: text("moon_sign"),
  risingSign: text("rising_sign"),
  profileImage: text("profile_image"),
});

export const articles = pgTable("articles", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  summary: text("summary").notNull(),
  content: text("content").notNull(),
  categoryId: integer("category_id").references(() => categories.id).notNull(),
  publishedAt: timestamp("published_at").defaultNow().notNull(),
  astroAnalysis: text("astro_analysis").notNull(),
  astroGlyphs: jsonb("astro_glyphs").$type<{
    planet: string;
    color: string;
    symbol?: string;
  }[]>().notNull(),
  hashtags: text("hashtags").array().notNull(),
  actorIds: integer("actor_ids").array().notNull(),
  likeCount: integer("like_count").default(0).notNull(),
  shareCount: integer("share_count").default(0).notNull(),
  bookmarkCount: integer("bookmark_count").default(0).notNull(),
  isCelebrity: boolean("is_celebrity").default(false).notNull(),
});

export const userBookmarks = pgTable("user_bookmarks", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  articleId: integer("article_id").references(() => articles.id).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const userFollows = pgTable("user_follows", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  actorId: integer("actor_id").references(() => actors.id),
  hashtag: text("hashtag"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertCategorySchema = createInsertSchema(categories).omit({
  id: true,
});

export const insertActorSchema = createInsertSchema(actors).omit({
  id: true,
});

export const insertArticleSchema = createInsertSchema(articles).omit({
  id: true,
  publishedAt: true,
});

export const insertUserBookmarkSchema = createInsertSchema(userBookmarks).omit({
  id: true,
  createdAt: true,
});

export const insertUserFollowSchema = createInsertSchema(userFollows).omit({
  id: true,
  createdAt: true,
});

export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Category = typeof categories.$inferSelect;
export type InsertCategory = z.infer<typeof insertCategorySchema>;
export type Actor = typeof actors.$inferSelect;
export type InsertActor = z.infer<typeof insertActorSchema>;
export type Article = typeof articles.$inferSelect;
export type InsertArticle = z.infer<typeof insertArticleSchema>;
export type UserBookmark = typeof userBookmarks.$inferSelect;
export type InsertUserBookmark = z.infer<typeof insertUserBookmarkSchema>;
export type UserFollow = typeof userFollows.$inferSelect;
export type InsertUserFollow = z.infer<typeof insertUserFollowSchema>;

export type ArticleWithDetails = Article & {
  category: Category;
  actors: Actor[];
};
