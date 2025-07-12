import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { insertQuestionSchema, insertAnswerSchema, insertVoteSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Question routes - Allow guests to view questions
  app.get('/api/questions', async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 20;
      const offset = parseInt(req.query.offset as string) || 0;
      const questions = await storage.getQuestionsWithDetails(limit, offset);
      res.json(questions);
    } catch (error) {
      console.error("Error fetching questions:", error);
      res.status(500).json({ message: "Failed to fetch questions" });
    }
  });

  // Allow guests to view individual questions
  app.get('/api/questions/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const question = await storage.getQuestionWithDetails(id);
      
      if (!question) {
        return res.status(404).json({ message: "Question not found" });
      }

      // Increment view count
      await storage.incrementQuestionViews(id);
      
      res.json(question);
    } catch (error) {
      console.error("Error fetching question:", error);
      res.status(500).json({ message: "Failed to fetch question" });
    }
  });

  app.post('/api/questions', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const questionData = insertQuestionSchema.parse({
        ...req.body,
        authorId: userId,
      });

      const question = await storage.createQuestion(questionData);

      // Handle tags
      if (req.body.tags && req.body.tags.length > 0) {
        const tags = await storage.getOrCreateTags(req.body.tags);
        await storage.addTagsToQuestion(question.id, tags.map(t => t.id));
      }

      res.json(question);
    } catch (error) {
      console.error("Error creating question:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid question data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create question" });
    }
  });

  // Answer routes - Allow guests to view answers
  app.get('/api/questions/:id/answers', async (req, res) => {
    try {
      const questionId = parseInt(req.params.id);
      const answers = await storage.getAnswersByQuestionId(questionId);
      
      // Get vote counts for each answer
      const answersWithVotes = await Promise.all(
        answers.map(async (answer) => {
          const voteCount = await storage.getVoteCount(answer.id);
          return { ...answer, voteCount };
        })
      );

      res.json(answersWithVotes);
    } catch (error) {
      console.error("Error fetching answers:", error);
      res.status(500).json({ message: "Failed to fetch answers" });
    }
  });

  app.post('/api/questions/:id/answers', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const questionId = parseInt(req.params.id);
      
      const answerData = insertAnswerSchema.parse({
        ...req.body,
        authorId: userId,
        questionId,
      });

      const answer = await storage.createAnswer(answerData);
      res.json(answer);
    } catch (error) {
      console.error("Error creating answer:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid answer data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create answer" });
    }
  });

  app.post('/api/questions/:questionId/answers/:answerId/accept', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const questionId = parseInt(req.params.questionId);
      const answerId = parseInt(req.params.answerId);

      await storage.acceptAnswer(questionId, answerId, userId);
      res.json({ message: "Answer accepted successfully" });
    } catch (error) {
      console.error("Error accepting answer:", error);
      res.status(500).json({ message: "Failed to accept answer" });
    }
  });

  // Vote routes
  app.post('/api/answers/:id/vote', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const answerId = parseInt(req.params.id);
      
      const voteData = insertVoteSchema.parse({
        userId,
        answerId,
        voteType: req.body.voteType,
      });

      await storage.createOrUpdateVote(voteData);
      const newVoteCount = await storage.getVoteCount(answerId);
      const userVote = await storage.getUserVote(userId, answerId);

      res.json({ 
        voteCount: newVoteCount,
        userVote: userVote?.voteType || null 
      });
    } catch (error) {
      console.error("Error voting on answer:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid vote data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to vote on answer" });
    }
  });

  app.post('/api/questions/:id/vote', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const questionId = parseInt(req.params.id);
      
      const voteData = insertVoteSchema.parse({
        userId,
        questionId,
        voteType: req.body.voteType,
      });

      await storage.createOrUpdateVote(voteData);
      const newVoteCount = await storage.getVoteCount(undefined, questionId);
      const userVote = await storage.getUserVote(userId, undefined, questionId);

      res.json({ 
        voteCount: newVoteCount,
        userVote: userVote?.voteType || null 
      });
    } catch (error) {
      console.error("Error voting on question:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid vote data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to vote on question" });
    }
  });

  // Tag routes - Allow guests to view tags
  app.get('/api/tags', async (req, res) => {
    try {
      const tags = await storage.getTags();
      res.json(tags);
    } catch (error) {
      console.error("Error fetching tags:", error);
      res.status(500).json({ message: "Failed to fetch tags" });
    }
  });

  // Notification routes
  app.get('/api/notifications', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const notifications = await storage.getNotifications(userId);
      res.json(notifications);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      res.status(500).json({ message: "Failed to fetch notifications" });
    }
  });

  app.get('/api/notifications/count', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const count = await storage.getUnreadNotificationCount(userId);
      res.json({ count });
    } catch (error) {
      console.error("Error fetching notification count:", error);
      res.status(500).json({ message: "Failed to fetch notification count" });
    }
  });

  app.post('/api/notifications/:id/read', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const notificationId = parseInt(req.params.id);
      
      await storage.markNotificationAsRead(notificationId, userId);
      res.json({ message: "Notification marked as read" });
    } catch (error) {
      console.error("Error marking notification as read:", error);
      res.status(500).json({ message: "Failed to mark notification as read" });
    }
  });

  // Stats route - Allow guests to view stats
  app.get('/api/stats', async (req, res) => {
    try {
      const stats = await storage.getStats();
      res.json(stats);
    } catch (error) {
      console.error("Error fetching stats:", error);
      res.status(500).json({ message: "Failed to fetch stats" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
