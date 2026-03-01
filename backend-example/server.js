/**
 * Complete Express.js Backend Example for Progress Bar Component
 *
 * This is a ready-to-use Node.js/Express backend server that works with
 * the Progress Bar component for file uploads and form submissions.
 *
 * Installation:
 *   npm init -y
 *   npm install express multer cors body-parser dotenv
 *
 * Run:
 *   node server.js
 *
 * The server will start on http://localhost:5000
 */

import express from "express";
import multer from "multer";
import cors from "cors";
import bodyParser from "body-parser";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Get __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// ==================== Middleware ====================
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve uploaded files
app.use("/uploads", express.static(uploadsDir));

// ==================== Multer Configuration ====================
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    const name = path.basename(file.originalname, ext);
    cb(null, name + "-" + uniqueSuffix + ext);
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB limit
  },
  fileFilter: (req, file, cb) => {
    // Optional: Add file type restrictions
    // const allowedTypes = /pdf|doc|docx|txt|xlsx|xls|jpg|jpeg|png|gif/;
    // const ext = path.extname(file.originalname).toLowerCase();
    // if (!allowedTypes.test(ext)) {
    //   return cb(new Error('Invalid file type'));
    // }
    cb(null, true);
  },
});

// ==================== Routes ====================
const router = express.Router();

// Health check endpoint
router.get("/health", (req, res) => {
  res.json({
    status: "API is running",
    timestamp: new Date().toISOString(),
    port: PORT,
  });
});

// File upload endpoint
router.post("/upload", upload.single("file"), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    const fileUrl = `http://localhost:${PORT}/uploads/${req.file.filename}`;

    console.log(`✓ File uploaded: ${req.file.originalname}`);
    console.log(`  Size: ${(req.file.size / 1024 / 1024).toFixed(2)} MB`);
    console.log(`  Saved as: ${req.file.filename}`);

    return res.status(201).json({
      success: true,
      message: "File uploaded successfully",
      file: {
        filename: req.file.filename,
        originalName: req.file.originalname,
        size: req.file.size,
        sizeInMB: (req.file.size / 1024 / 1024).toFixed(2),
        path: `/uploads/${req.file.filename}`,
        url: fileUrl,
        mimeType: req.file.mimetype,
        uploadedAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("Upload error:", error);
    return res.status(500).json({
      success: false,
      message: "File upload failed",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// Form submission endpoint
router.post("/submit-form", async (req, res) => {
  try {
    const { name, email, message } = req.body;

    // Validation
    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: "All fields (name, email, message) are required",
      });
    }

    // Trim fields
    const trimmedData = {
      name: name.toString().trim(),
      email: email.toString().trim(),
      message: message.toString().trim(),
    };

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedData.email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email format",
      });
    }

    // Validate name length
    if (trimmedData.name.length < 2) {
      return res.status(400).json({
        success: false,
        message: "Name must be at least 2 characters",
      });
    }

    // Validate message length
    if (trimmedData.message.length < 5) {
      return res.status(400).json({
        success: false,
        message: "Message must be at least 5 characters",
      });
    }

    // Simulate processing time (1 second)
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Here you would typically save to a database
    const submission = {
      id: `submission_${Date.now()}`,
      name: trimmedData.name,
      email: trimmedData.email,
      message: trimmedData.message,
      timestamp: new Date().toISOString(),
    };

    // Log submission
    console.log("✓ Form submitted:");
    console.log(`  ID: ${submission.id}`);
    console.log(`  Name: ${submission.name}`);
    console.log(`  Email: ${submission.email}`);
    console.log(`  Message: ${submission.message.substring(0, 50)}...`);
    console.log(`  Timestamp: ${submission.timestamp}`);

    // Optional: Save to file
    const submissionsFile = path.join(__dirname, "submissions.json");
    let submissions = [];
    if (fs.existsSync(submissionsFile)) {
      const data = fs.readFileSync(submissionsFile, "utf-8");
      submissions = JSON.parse(data);
    }
    submissions.push(submission);
    fs.writeFileSync(submissionsFile, JSON.stringify(submissions, null, 2));

    return res.status(200).json({
      success: true,
      message: `Form submitted successfully for ${trimmedData.name}`,
      id: submission.id,
      submission: submission,
    });
  } catch (error) {
    console.error("Form submission error:", error);
    return res.status(500).json({
      success: false,
      message: "Error processing form submission",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// Get all submissions (optional endpoint for admin)
router.get("/submissions", (req, res) => {
  try {
    const submissionsFile = path.join(__dirname, "submissions.json");
    if (fs.existsSync(submissionsFile)) {
      const data = fs.readFileSync(submissionsFile, "utf-8");
      const submissions = JSON.parse(data);
      return res.json({
        success: true,
        count: submissions.length,
        submissions: submissions,
      });
    }
    return res.json({
      success: true,
      count: 0,
      submissions: [],
    });
  } catch (error) {
    console.error("Error reading submissions:", error);
    return res.status(500).json({
      success: false,
      message: "Error reading submissions",
    });
  }
});

// Get uploaded files list (optional endpoint for admin)
router.get("/uploads-list", (req, res) => {
  try {
    const files = fs.readdirSync(uploadsDir);
    const fileDetails = files.map((file) => {
      const filePath = path.join(uploadsDir, file);
      const stats = fs.statSync(filePath);
      return {
        filename: file,
        size: stats.size,
        sizeInMB: (stats.size / 1024 / 1024).toFixed(2),
        uploadedAt: stats.birthtime,
        url: `/uploads/${file}`,
      };
    });

    return res.json({
      success: true,
      count: files.length,
      files: fileDetails,
    });
  } catch (error) {
    console.error("Error reading uploads:", error);
    return res.status(500).json({
      success: false,
      message: "Error reading uploads",
    });
  }
});

// Mount API router
app.use("/api", router);

// ==================== Error Handling Middleware ====================
app.use((err, req, res, next) => {
  console.error("Server Error:", err);

  // Multer errors
  if (err instanceof multer.MulterError) {
    if (err.code === "FILE_TOO_LARGE") {
      return res.status(413).json({
        success: false,
        message: "File too large (max 100MB)",
      });
    }
    if (err.code === "LIMIT_FILE_COUNT") {
      return res.status(400).json({
        success: false,
        message: "Only one file allowed",
      });
    }
  }

  return res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal server error",
  });
});

// ==================== 404 Handler ====================
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Endpoint not found",
    path: req.path,
  });
});

// ==================== Start Server ====================
app.listen(PORT, () => {
  console.log("\n");
  console.log("╔════════════════════════════════════════════════════════════╗");
  console.log("║                  Progress Bar API Server                   ║");
  console.log("╚════════════════════════════════════════════════════════════╝");
  console.log(`✓ Server running on http://localhost:${PORT}`);
  console.log(`✓ API available at http://localhost:${PORT}/api`);
  console.log(`✓ Uploads directory: ${uploadsDir}`);
  console.log("\n📝 Available Endpoints:");
  console.log(
    `   GET  http://localhost:${PORT}/api/health        - Health check`,
  );
  console.log(
    `   POST http://localhost:${PORT}/api/upload        - Upload file`,
  );
  console.log(
    `   POST http://localhost:${PORT}/api/submit-form   - Submit form`,
  );
  console.log(
    `   GET  http://localhost:${PORT}/api/submissions   - List submissions`,
  );
  console.log(
    `   GET  http://localhost:${PORT}/api/uploads-list  - List uploads`,
  );
  console.log("\n🔗 Connect your frontend:");
  console.log("   VITE_API_BASE_URL=http://localhost:5000/api");
  console.log("\n💡 Press Ctrl+C to stop the server");
  console.log("\n");
});

// ==================== Graceful Shutdown ====================
process.on("SIGINT", () => {
  console.log("\n\n✓ Server shutting down gracefully...");
  process.exit(0);
});
