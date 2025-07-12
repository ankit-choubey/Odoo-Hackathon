import { spawn } from "child_process";
import type { Express, Request, Response } from "express";
import { createServer } from "http";

export async function registerRoutes(app: Express) {
  // Existing enhancer route — no change here
  app.post("/api/enhance", (req: Request, res: Response) => {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: "Missing 'prompt' in request body." });
    }

    const pythonProcess = spawn("python3.10", ["ml_service/enhancer/enhance.py", prompt]);

    let output = "";
    let errorOutput = "";

    pythonProcess.stdout.on("data", (data) => {
      output += data.toString();
    });

    pythonProcess.stderr.on("data", (data) => {
      errorOutput += data.toString();
    });

    pythonProcess.on("close", (code) => {
      if (code !== 0) {
        return res.status(500).json({ error: errorOutput || "Enhancer script failed." });
      }
      return res.json({ enhancedPrompt: output.trim() });
    });
  });

  // NEW question-answer route — clean and independent
  app.post("/api/question-answer", (req: Request, res: Response) => {
    const { question, context } = req.body;

    if (!question) {
      return res.status(400).json({ error: "Missing 'question' in request body." });
    }

    const input = JSON.stringify({ question});
    const pythonProcess = spawn("python3.10", ["ml_service/question_answer/generator.py", input]);

    let output = "";
    let errorOutput = "";

    pythonProcess.stdout.on("data", (data) => {
      output += data.toString();
    });

    pythonProcess.stderr.on("data", (data) => {
      errorOutput += data.toString();
    });

    pythonProcess.on("close", (code) => {
      if (code !== 0) {
        return res.status(500).json({ error: errorOutput || "Question Answering script failed." });
      }
      try {
        const result = JSON.parse(output);
        return res.json(result);
      } catch {
        return res.status(500).json({ error: "Invalid response from Question Answering script." });
      }
    });
  });

  return createServer(app);
}
