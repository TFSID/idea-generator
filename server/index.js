import express from 'express';
import sqlite3 from 'sqlite3';
import cors from 'cors';
import bodyParser from 'body-parser';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Database Setup
// Ensure db file is relative to the server script location
const dbPath = path.resolve(__dirname, 'ideas.db');
const verboseSqlite = sqlite3.verbose();
const db = new verboseSqlite.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
    } else {
        console.log('Connected to the SQLite database.');
        initializeDatabase();
    }
});

function initializeDatabase() {
    db.run(`CREATE TABLE IF NOT EXISTS ideas (
    id TEXT PRIMARY KEY,
    category TEXT,
    title TEXT,
    description TEXT,
    moneyValue TEXT,
    effortValue TEXT,
    monetizationStrategies TEXT,
    refinedPrompt TEXT,
    thought TEXT,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
  )`, (err) => {
        if (err) {
            console.error('Error creating table:', err.message);
        } else {
            console.log('Ideas table ready.');
        }
    });
}

// Routes

// Validate and Save Ideas
app.post('/api/validate-and-save', (req, res) => {
    const incomingIdeas = req.body.ideas;

    if (!incomingIdeas || !Array.isArray(incomingIdeas)) {
        return res.status(400).json({ error: 'Invalid input. Expected an array of ideas.' });
    }

    const newIdeas = [];
    const duplicates = [];

    const checkAndInsert = (idea) => {
        return new Promise((resolve, reject) => {
            db.get('SELECT id FROM ideas WHERE lower(title) = lower(?)', [idea.title], (err, row) => {
                if (err) {
                    reject(err);
                } else if (row) {
                    duplicates.push(idea);
                    resolve();
                } else {
                    const stmt = db.prepare(`INSERT INTO ideas (id, category, title, description, moneyValue, effortValue, monetizationStrategies, refinedPrompt, thought) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`);
                    stmt.run(
                        idea.id,
                        idea.category,
                        idea.title,
                        idea.description,
                        idea.moneyValue || null,
                        idea.effortValue || null,
                        idea.monetizationStrategies || null,
                        idea.refinedPrompt || null,
                        idea.thought || null,
                        (err) => {
                            if (err) {
                                reject(err);
                            } else {
                                newIdeas.push(idea);
                                resolve();
                            }
                        }
                    );
                    stmt.finalize();
                }
            });
        });
    };

    Promise.all(incomingIdeas.map(checkAndInsert))
        .then(() => {
            console.log(`Processed ${incomingIdeas.length} ideas. Saved ${newIdeas.length} new, found ${duplicates.length} duplicates.`);
            res.json({
                saved: newIdeas,
                duplicatesCount: duplicates.length,
                totalProcessed: incomingIdeas.length
            });
        })
        .catch((err) => {
            console.error('Error processing ideas:', err);
            res.status(500).json({ error: 'Database error occurred.' });
        });
});

// Get all saved ideas
app.get('/api/ideas', (req, res) => {
    db.all('SELECT * FROM ideas ORDER BY createdAt DESC', [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ ideas: rows });
    });
});

// Serve Static Files (Frontend Build)
// This must come AFTER API routes
app.use(express.static(path.join(__dirname, '../dist')));

// Catch-all route to serve React's index.html for client-side routing
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../dist/index.html'));
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
