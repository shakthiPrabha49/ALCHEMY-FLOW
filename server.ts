import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import bodyParser from "body-parser";
import cors from "cors";

// Derive __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DB_FILE = path.join(__dirname, "db.json");

// Initial DB structure
const initialDb = {
  employees: [
    { id: "1", name: "Admin User", role: "Admin" }
  ],
  brands: [],
  content: []
};

// Helper to read/write DB
const readDb = () => {
  if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify(initialDb, null, 2));
    return initialDb;
  }
  return JSON.parse(fs.readFileSync(DB_FILE, "utf-8"));
};

const writeDb = (data: any) => {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
};

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(bodyParser.json());

  // --- API Routes ---

  // Employees
  app.get("/api/employees", (req, res) => {
    const db = readDb();
    res.json(db.employees);
  });

  app.post("/api/employees", (req, res) => {
    const db = readDb();
    const newEmployee = { ...req.body, id: Date.now().toString() };
    db.employees.push(newEmployee);
    writeDb(db);
    res.json(newEmployee);
  });

  // Brands
  app.get("/api/brands", (req, res) => {
    const db = readDb();
    res.json(db.brands);
  });

  app.post("/api/brands", (req, res) => {
    const db = readDb();
    const newBrand = { ...req.body, id: Date.now().toString() };
    db.brands.push(newBrand);
    writeDb(db);
    res.json(newBrand);
  });

  // Content
  app.get("/api/content", (req, res) => {
    const db = readDb();
    res.json(db.content);
  });

  app.post("/api/content", (req, res) => {
    const db = readDb();
    const newItem = { 
      ...req.body, 
      id: Date.now().toString(),
      ideaStatus: req.body.ideaStatus || 'Not Done',
      createdAt: Date.now()
    };
    db.content.push(newItem);
    writeDb(db);
    res.json(newItem);
  });

  app.put("/api/content/:id", (req, res) => {
    const db = readDb();
    const index = db.content.findIndex((c: any) => c.id === req.params.id);
    if (index !== -1) {
      db.content[index] = { ...db.content[index], ...req.body };
      writeDb(db);
      res.json(db.content[index]);
    } else {
      res.status(404).send("Not found");
    }
  });

  app.delete("/api/content/:id", (req, res) => {
    const db = readDb();
    db.content = db.content.filter((c: any) => c.id !== req.params.id);
    writeDb(db);
    res.sendStatus(204);
  });

  // --- Vite & Static Serves ---

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
