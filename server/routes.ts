import { spawn } from "child_process";
import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage.ts";

export async function registerRoutes(app: Express): Promise<Server> {
  // Prefix all routes with /api
  app.post("/api/enhance", (req, res) => {
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

  // You can register more routes here as needed
  // e.g. app.get("/api/users", ...)

  const httpServer = createServer(app);
  return httpServer;
}
