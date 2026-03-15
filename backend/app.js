const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const prisma = require("./prismaClient");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/tasks", async (req, res) => {
  try {
    const tasks = await prisma.task.findMany({
      orderBy: { id: "asc" },
    });
    res.json(tasks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch tasks" });
  }
});

app.post("/tasks", async (req, res) => {
  try {
    const { title } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ error: "Title is required" });
    }

    const task = await prisma.task.create({
      data: { title: title.trim() },
    });

    res.status(201).json(task);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create task" });
  }
});

app.put("/tasks/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { title } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ error: "Title is required" });
    }

    const task = await prisma.task.update({
      where: { id },
      data: { title: title.trim() },
    });

    res.json(task);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update task" });
  }
});

app.delete("/tasks/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

    await prisma.task.delete({
      where: { id },
    });

    res.json({ message: "Task deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete task" });
  }
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
