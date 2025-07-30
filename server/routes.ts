import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all categories
  app.get("/api/categories", async (req, res) => {
    try {
      const categories = await storage.getCategories();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch categories" });
    }
  });

  // Get articles with optional category filter
  app.get("/api/articles", async (req, res) => {
    try {
      const categorySlug = req.query.category as string;
      const limit = parseInt(req.query.limit as string) || 20;
      const offset = parseInt(req.query.offset as string) || 0;
      
      const articles = await storage.getArticles(categorySlug, limit, offset);
      res.json(articles);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch articles" });
    }
  });

  // Get single article by ID
  app.get("/api/articles/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const article = await storage.getArticleById(id);
      
      if (!article) {
        return res.status(404).json({ error: "Article not found" });
      }
      
      res.json(article);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch article" });
    }
  });

  // Search articles
  app.get("/api/search", async (req, res) => {
    try {
      const query = req.query.q as string;
      if (!query) {
        return res.status(400).json({ error: "Search query is required" });
      }
      
      const articles = await storage.searchArticles(query);
      res.json(articles);
    } catch (error) {
      res.status(500).json({ error: "Failed to search articles" });
    }
  });

  // Get articles by hashtag
  app.get("/api/hashtag/:hashtag", async (req, res) => {
    try {
      const hashtag = req.params.hashtag;
      const articles = await storage.getArticlesByHashtag(hashtag);
      res.json(articles);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch articles by hashtag" });
    }
  });

  // Get all actors
  app.get("/api/actors", async (req, res) => {
    try {
      const actors = await storage.getActors();
      res.json(actors);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch actors" });
    }
  });

  // Get single actor by ID or slug
  app.get("/api/actors/:identifier", async (req, res) => {
    try {
      const identifier = req.params.identifier;
      let actor;
      
      // Try to parse as ID first, if it fails treat as slug
      if (/^\d+$/.test(identifier)) {
        const id = parseInt(identifier);
        actor = await storage.getActorById(id);
      } else {
        actor = await storage.getActorBySlug(identifier);
      }
      
      if (!actor) {
        return res.status(404).json({ error: "Actor not found" });
      }
      
      res.json(actor);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch actor" });
    }
  });

  // Get articles by actor
  app.get("/api/actors/:id/articles", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const articles = await storage.getArticlesByActor(id);
      res.json(articles);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch articles by actor" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
