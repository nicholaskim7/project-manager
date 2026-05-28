require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Client } = require('pg');
const app = express();
app.use(express.json());
app.use(cors());
const { generateSlug } = require('./utils/slugify.js');

const client = new Client({
    host: process.env.host,
    user: process.env.user,
    password: process.env.password,
    database: process.env.database
});

async function connectDB() {
    try {
        await client.connect();
        console.log("connected to the database successfully");
    } catch (err) {
        console.error("database connection error: ", err);
    }
}
connectDB();

app.get("/api/projects", async (req, res) => {
    try {
        const sql = "SELECT * FROM projects"
        const data = await client.query(sql);
        return res.json(data.rows);
    } catch (error) {
        console.error("error fetching projects: ", error);
        return res.status(500).json({ error: "Internal server error" });
    }
});

app.get("/api/projects/:slug", async (req, res) => {
    const slug = req.params.slug;
    if (slug === "") {
        return res.status(400).json({ error: "Empty project slug" });
    }
    try {
        const sql = `SELECT * FROM projects
                     WHERE slug = $1
                    `
        const values = [slug];
        const data = await client.query(sql, values);
        return res.json(data.rows[0]);
    } catch (error) {
        console.error("error fetching project by slug: ", error);
        return res.status(500).json({ error: "Internal server error" });
    }
});

app.get("/api/projects/:id/tasks", async (req, res) => {
    const projectId = req.params.id;
    const projectIdInt = parseInt(projectId, 10);
    if (isNaN(projectIdInt)) {
        return res.status(400).json({ error: "Invalid project ID" });
    }

    try {
        const sql = `SELECT * FROM tasks
                     WHERE project_id = $1
                    `
        const values = [projectIdInt];
        const data = await client.query(sql, values);
        return res.json(data.rows);
    } catch (error) {
        console.error("error fetching tasks by project id: ", error);
        return res.status(500).json({ error: "Internal server error" });
    }
});

app.post("/api/projects", async (req, res) => {
    try {
        const { project_name, description } = req.body;
        if (!project_name) {
            return res.status(400).json({ error: "missing required fields" });
        }
        // generate slug from project name
        const slug = generateSlug(project_name);

        
        const sql = `
            INSERT INTO projects (project_name, slug, description, author_id) 
            VALUES ($1, $2, $3, $4)
            RETURNING *
        `;
        // temporarily hardcode author_id since we havent done user auth
        const values = [project_name, slug, description, 1];

        const data = await client.query(sql, values);
        return res.status(201).json(data.rows[0]);
    } catch (error) {
        console.error("error creating project: ", error);
        return res.status(500).json({ error: "Internal server error" });
    }
})


app.post("/api/projects/:id/tasks", async (req, res) => {
    const id = req.params.id;
    const idInt = parseInt(id, 10);
    if (isNaN(idInt)) {
        return res.status(400).json({ error: "Invalid project ID" });
    }
    try {
        const { task_title, description} = req.body;
        if (!task_title) {
            return res.status(400).json({ error: "missing required fields" });
        }
        
        const sql = `
            INSERT INTO tasks (task_title, description, project_id) 
            VALUES ($1, $2, $3)
            RETURNING *
        `;
        const values = [task_title, description, idInt];

        const data = await client.query(sql, values);

        return res.status(201).json(data.rows[0]);
    } catch (error) {
        console.error("error creating tasks: ", error);
        return res.status(500).json({ error: "Internal server error" });
    }
})

app.patch("/api/tasks/:id", async (req, res) => {
    const id = req.params.id;
    const idInt = parseInt(id, 10);
    const allowedStatus = ["To-Do", "In-Progress" ,"Done"]

    if (isNaN(idInt)) {
        return res.status(400).json({ error: "Invalid task ID" });
    }
    try {
        const { status } = req.body;
        if (!status) {
            return res.status(400).json({ error: "missing required fields" });
        }
        if (!allowedStatus.includes(status)) {
            return res.status(400).json({ error: "invalid status field" });
        }
        
        const sql = `
            UPDATE tasks
            SET status = $1
            WHERE task_id = $2
            RETURNING *
        `;
        const values = [status, idInt];

        const data = await client.query(sql, values);

        // no task found by that id
        if (data.rows.length === 0) {
            return res.status(404).json({ error: "Task not found" });
        }

        return res.status(200).json(data.rows[0]);
    } catch (error) {
        console.error("error updating task status: ", error);
        return res.status(500).json({ error: "Internal server error" });
    }
})

app.listen(8081, () => {
    console.log("listening on port :8081");
})
