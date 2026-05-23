const express = require('express');
const cors = require('cors');
const { Client } = require('pg');

const app = express();
app.use(express.json());
app.use(cors());

const client = new Client({
    host: "localhost",
    user: "postgres",
    password: "Hyuntae0107",
    database: "project_manager"
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
        const sql = "SELECT * FROM project"
        const data = await client.query(sql);
        return res.json(data.rows);
    } catch (error) {
        console.error("error fetching projects: ", error);
        return res.status(500).json({ error: "Internal server error" });
    }
});

app.post("/api/projects", async (req, res) => {
    try {
        const { name, description } = req.body;
        if (!name) {
            return res.status(400).json({ error: "missing required fields" });
        }
        const sql = `
            INSERT INTO project (name, description, author_id) 
            VALUES ($1, $2, 1)
            RETURNING *
        `;

        const values = [name, description];

        const data = await client.query(sql, values);
        return res.status(201).json(data.rows[0]);
    } catch (error) {
        console.error("error creating project: ", error);
        return res.status(500).json({ error: "Internal server error" });
    }
})

app.listen(8081, () => {
    console.log("listening on port :8081");
})
