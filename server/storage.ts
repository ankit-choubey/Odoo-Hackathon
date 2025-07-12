import {
  users,
  questions,
  answers,
  tags,
  questionTags,
  votes,
  notifications,
  type User,
  type UpsertUser,
  type Question,
  type InsertQuestion,
  type Answer,
  type InsertAnswer,
  type Tag,
  type InsertTag,
  type Vote,
  type InsertVote,
  type Notification,
  type InsertNotification,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, or, sql, ne } from "drizzle-orm";

export interface IStorage {
  // User operations (mandatory for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;

  // Question operations
  getQuestions(limit?: number, offset?: number): Promise<Question[]>;
  getQuestionsWithDetails(limit?: number, offset?: number): Promise<any[]>;
  getQuestion(id: number): Promise<Question | undefined>;
  getQuestionWithDetails(id: number): Promise<any>;
  createQuestion(question: InsertQuestion): Promise<Question>;
  incrementQuestionViews(id: number): Promise<void>;
  acceptAnswer(questionId: number, answerId: number, authorId: string): Promise<void>;

  // Answer operations
  getAnswersByQuestionId(questionId: number): Promise<any[]>;
  createAnswer(answer: InsertAnswer): Promise<Answer>;

  // Tag operations
  getTags(): Promise<Tag[]>;
  getOrCreateTags(tagNames: string[]): Promise<Tag[]>;
  addTagsToQuestion(questionId: number, tagIds: number[]): Promise<void>;

  // Vote operations
  getVoteCount(answerId?: number, questionId?: number): Promise<number>;
  getUserVote(userId: string, answerId?: number, questionId?: number): Promise<Vote | undefined>;
  createOrUpdateVote(vote: InsertVote): Promise<Vote>;
  deleteVote(userId: string, answerId?: number, questionId?: number): Promise<void>;

  // Notification operations
  getNotifications(userId: string): Promise<Notification[]>;
  createNotification(notification: InsertNotification): Promise<Notification>;
  markNotificationAsRead(id: number, userId: string): Promise<void>;
  getUnreadNotificationCount(userId: string): Promise<number>;

  // Stats
  getStats(): Promise<{
    questions: number;
    answers: number;
    users: number;
    tags: number;
  }>;
}

export class DatabaseStorage implements IStorage {
  // User operations (mandatory for Replit Auth)
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Question operations
  async getQuestions(limit = 20, offset = 0): Promise<Question[]> {
    return await db
      .select()
      .from(questions)
      .orderBy(desc(questions.createdAt))
      .limit(limit)
      .offset(offset);
  }

  async getQuestionsWithDetails(limit = 20, offset = 0): Promise<any[]> {
    const questionsData = await db
      .select({
        id: questions.id,
        title: questions.title,
        content: questions.content,
        authorId: questions.authorId,
        acceptedAnswerId: questions.acceptedAnswerId,
        views: questions.views,
        createdAt: questions.createdAt,
        updatedAt: questions.updatedAt,
        author: {
          id: users.id,
          firstName: users.firstName,
          lastName: users.lastName,
          profileImageUrl: users.profileImageUrl,
          reputation: users.reputation,
        },
      })
      .from(questions)
      .leftJoin(users, eq(questions.authorId, users.id))
      .orderBy(desc(questions.createdAt))
      .limit(limit)
      .offset(offset);

    // Get tags and answer counts for each question
    const enrichedQuestions = await Promise.all(
      questionsData.map(async (question) => {
        // Get tags
        const questionTagsData = await db
          .select({
            tag: {
              id: tags.id,
              name: tags.name,
            },
          })
          .from(questionTags)
          .leftJoin(tags, eq(questionTags.tagId, tags.id))
          .where(eq(questionTags.questionId, question.id));

        // Get answer count
        const [answerCountResult] = await db
          .select({ count: sql<number>`count(*)` })
          .from(answers)
          .where(eq(answers.questionId, question.id));

        return {
          ...question,
          tags: questionTagsData.map(qt => qt.tag),
          answerCount: answerCountResult?.count || 0,
        };
      })
    );

    return enrichedQuestions;
  }

  async getQuestion(id: number): Promise<Question | undefined> {
    const [question] = await db.select().from(questions).where(eq(questions.id, id));
    return question;
  }

  async getQuestionWithDetails(id: number): Promise<any> {
    const [question] = await db
      .select({
        id: questions.id,
        title: questions.title,
        content: questions.content,
        authorId: questions.authorId,
        acceptedAnswerId: questions.acceptedAnswerId,
        views: questions.views,
        createdAt: questions.createdAt,
        updatedAt: questions.updatedAt,
        author: {
          id: users.id,
          firstName: users.firstName,
          lastName: users.lastName,
          profileImageUrl: users.profileImageUrl,
          reputation: users.reputation,
        },
      })
      .from(questions)
      .leftJoin(users, eq(questions.authorId, users.id))
      .where(eq(questions.id, id));

    if (!question) return undefined;

    // Get tags
    const questionTagsData = await db
      .select({
        tag: {
          id: tags.id,
          name: tags.name,
        },
      })
      .from(questionTags)
      .leftJoin(tags, eq(questionTags.tagId, tags.id))
      .where(eq(questionTags.questionId, id));

    return {
      ...question,
      tags: questionTagsData.map(qt => qt.tag),
    };
  }

  async createQuestion(question: InsertQuestion): Promise<Question> {
    const [newQuestion] = await db
      .insert(questions)
      .values(question)
      .returning();
    return newQuestion;
  }

  async incrementQuestionViews(id: number): Promise<void> {
    await db
      .update(questions)
      .set({ views: sql`${questions.views} + 1` })
      .where(eq(questions.id, id));
  }

  async acceptAnswer(questionId: number, answerId: number, authorId: string): Promise<void> {
    // Verify the user is the question author
    const [question] = await db
      .select()
      .from(questions)
      .where(and(eq(questions.id, questionId), eq(questions.authorId, authorId)));

    if (!question) {
      throw new Error("Only the question author can accept answers");
    }

    // Update question with accepted answer
    await db
      .update(questions)
      .set({ acceptedAnswerId: answerId })
      .where(eq(questions.id, questionId));

    // Update answer as accepted
    await db
      .update(answers)
      .set({ isAccepted: true })
      .where(eq(answers.id, answerId));

    // Create notification for answer author
    const [answer] = await db.select().from(answers).where(eq(answers.id, answerId));
    if (answer && answer.authorId !== authorId) {
      await this.createNotification({
        userId: answer.authorId,
        type: "accepted",
        title: "Answer Accepted",
        message: "Your answer has been accepted!",
        relatedQuestionId: questionId,
        relatedAnswerId: answerId,
        isRead: false,
      });
    }
  }

  // Answer operations
  async getAnswersByQuestionId(questionId: number): Promise<any[]> {
    return await db
      .select({
        id: answers.id,
        content: answers.content,
        authorId: answers.authorId,
        questionId: answers.questionId,
        isAccepted: answers.isAccepted,
        createdAt: answers.createdAt,
        updatedAt: answers.updatedAt,
        author: {
          id: users.id,
          firstName: users.firstName,
          lastName: users.lastName,
          profileImageUrl: users.profileImageUrl,
          reputation: users.reputation,
        },
      })
      .from(answers)
      .leftJoin(users, eq(answers.authorId, users.id))
      .where(eq(answers.questionId, questionId))
      .orderBy(desc(answers.isAccepted), desc(answers.createdAt));
  }

  async createAnswer(answer: InsertAnswer): Promise<Answer> {
    const [newAnswer] = await db
      .insert(answers)
      .values(answer)
      .returning();

    // Create notification for question author
    const [question] = await db.select().from(questions).where(eq(questions.id, answer.questionId));
    if (question && question.authorId !== answer.authorId) {
      await this.createNotification({
        userId: question.authorId,
        type: "answer",
        title: "New Answer",
        message: "Someone answered your question!",
        relatedQuestionId: answer.questionId,
        relatedAnswerId: newAnswer.id,
        isRead: false,
      });
    }

    return newAnswer;
  }

  // Tag operations
  async getTags(): Promise<Tag[]> {
    return await db.select().from(tags).orderBy(tags.name);
  }

  async getOrCreateTags(tagNames: string[]): Promise<Tag[]> {
    const existingTags = await db
      .select()
      .from(tags)
      .where(sql`${tags.name} = ANY(${tagNames})`);

    const existingTagNames = existingTags.map(t => t.name);
    const newTagNames = tagNames.filter(name => !existingTagNames.includes(name));

    if (newTagNames.length > 0) {
      const newTags = await db
        .insert(tags)
        .values(newTagNames.map(name => ({ name })))
        .returning();
      return [...existingTags, ...newTags];
    }

    return existingTags;
  }

  async addTagsToQuestion(questionId: number, tagIds: number[]): Promise<void> {
    if (tagIds.length > 0) {
      await db
        .insert(questionTags)
        .values(tagIds.map(tagId => ({ questionId, tagId })));
    }
  }

  // Vote operations
  async getVoteCount(answerId?: number, questionId?: number): Promise<number> {
    const conditions = [];
    if (answerId) conditions.push(eq(votes.answerId, answerId));
    if (questionId) conditions.push(eq(votes.questionId, questionId));

    const [upVotes] = await db
      .select({ count: sql<number>`count(*)` })
      .from(votes)
      .where(and(...conditions, eq(votes.voteType, "up")));

    const [downVotes] = await db
      .select({ count: sql<number>`count(*)` })
      .from(votes)
      .where(and(...conditions, eq(votes.voteType, "down")));

    return (upVotes?.count || 0) - (downVotes?.count || 0);
  }

  async getUserVote(userId: string, answerId?: number, questionId?: number): Promise<Vote | undefined> {
    const conditions = [eq(votes.userId, userId)];
    if (answerId) conditions.push(eq(votes.answerId, answerId));
    if (questionId) conditions.push(eq(votes.questionId, questionId));

    const [vote] = await db
      .select()
      .from(votes)
      .where(and(...conditions));
    return vote;
  }

  async createOrUpdateVote(vote: InsertVote): Promise<Vote> {
    const existing = await this.getUserVote(vote.userId, vote.answerId || undefined, vote.questionId || undefined);

    if (existing) {
      if (existing.voteType === vote.voteType) {
        // Same vote, remove it
        await this.deleteVote(vote.userId, vote.answerId || undefined, vote.questionId || undefined);
        return existing;
      } else {
        // Different vote, update it
        const [updatedVote] = await db
          .update(votes)
          .set({ voteType: vote.voteType })
          .where(eq(votes.id, existing.id))
          .returning();
        return updatedVote;
      }
    } else {
      // New vote
      const [newVote] = await db
        .insert(votes)
        .values(vote)
        .returning();
      return newVote;
    }
  }

  async deleteVote(userId: string, answerId?: number, questionId?: number): Promise<void> {
    const conditions = [eq(votes.userId, userId)];
    if (answerId) conditions.push(eq(votes.answerId, answerId));
    if (questionId) conditions.push(eq(votes.questionId, questionId));

    await db
      .delete(votes)
      .where(and(...conditions));
  }

  // Notification operations
  async getNotifications(userId: string): Promise<Notification[]> {
    return await db
      .select()
      .from(notifications)
      .where(eq(notifications.userId, userId))
      .orderBy(desc(notifications.createdAt))
      .limit(10);
  }

  async createNotification(notification: InsertNotification): Promise<Notification> {
    const [newNotification] = await db
      .insert(notifications)
      .values(notification)
      .returning();
    return newNotification;
  }

  async markNotificationAsRead(id: number, userId: string): Promise<void> {
    await db
      .update(notifications)
      .set({ isRead: true })
      .where(and(eq(notifications.id, id), eq(notifications.userId, userId)));
  }

  async getUnreadNotificationCount(userId: string): Promise<number> {
    const [result] = await db
      .select({ count: sql<number>`count(*)` })
      .from(notifications)
      .where(and(eq(notifications.userId, userId), eq(notifications.isRead, false)));
    return result?.count || 0;
  }

  // Stats
  async getStats(): Promise<{
    questions: number;
    answers: number;
    users: number;
    tags: number;
  }> {
    const [questionCount] = await db
      .select({ count: sql<number>`count(*)` })
      .from(questions);

    const [answerCount] = await db
      .select({ count: sql<number>`count(*)` })
      .from(answers);

    const [userCount] = await db
      .select({ count: sql<number>`count(*)` })
      .from(users);

    const [tagCount] = await db
      .select({ count: sql<number>`count(*)` })
      .from(tags);

    return {
      questions: questionCount?.count || 0,
      answers: answerCount?.count || 0,
      users: userCount?.count || 0,
      tags: tagCount?.count || 0,
    };
  }
}

export const storage = new DatabaseStorage();
