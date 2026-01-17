import express from "express";
import cors from "cors";
import bodyParser from "body-parser";

import fs from "fs";
import path from "path";
import { marked } from "marked";

import taskRoutes from "./routes/tasks.js";
import authRoutes from "./routes/auth.js";
import { authenticateToken } from "./middleware/auth.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// ✅ API documentation page
app.get("/docs", (req, res) => {
  const filePath = path.resolve(process.cwd(), "API_DOC.md");

  if (!fs.existsSync(filePath)) {
    return res.status(404).send(`API_DOC.md not found at: ${filePath}`);
  }

  const markdown = fs.readFileSync(filePath, "utf-8");
  const html = marked.parse(markdown);

  res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8"/>
        <title>API Documentation</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 40px; max-width: 900px; margin: auto; line-height: 1.6; }
          pre { background: #f4f4f4; padding: 12px; overflow-x: auto; }
          code { font-family: Consolas, monospace; }
        </style>
      </head>
      <body>${html}</body>
    </html>
  `);
});

app.use("/api/auth", authRoutes);
app.use("/api", taskRoutes);

app.get("/api/protected", authenticateToken, (req, res) => {
  res.json({
    success: true,
    message: "This is a protected route",
    user: req.user,
  });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: "Something went wrong!",
    error: process.env.NODE_ENV === "development" ? err.message : {},
  });
});

// 404 handler (must be last)
app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});

export default app;
