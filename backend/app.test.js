const request = require('supertest');
const express = require('express');
const cors = require('cors');

// Mock Prisma — no real database needed during tests
jest.mock('./prismaClient', () => ({
  task: {
    findMany: jest.fn(),
    create:   jest.fn(),
    update:   jest.fn(),
    delete:   jest.fn(),
  },
}));

const prisma = require('./prismaClient');

// Recreate the Express app inline for testing
const app = express();
app.use(cors());
app.use(express.json());

app.get('/tasks', async (req, res) => {
  try {
    const tasks = await prisma.task.findMany({ orderBy: { id: 'asc' } });
    res.json(tasks);
  } catch {
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
});

app.post('/tasks', async (req, res) => {
  try {
    const { title } = req.body;
    if (!title || !title.trim())
      return res.status(400).json({ error: 'Title is required' });
    const task = await prisma.task.create({ data: { title: title.trim() } });
    res.status(201).json(task);
  } catch {
    res.status(500).json({ error: 'Failed to create task' });
  }
});

app.put('/tasks/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { title } = req.body;
    if (!title || !title.trim())
      return res.status(400).json({ error: 'Title is required' });
    const task = await prisma.task.update({ where: { id }, data: { title: title.trim() } });
    res.json(task);
  } catch {
    res.status(500).json({ error: 'Failed to update task' });
  }
});

app.delete('/tasks/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    await prisma.task.delete({ where: { id } });
    res.json({ message: 'Task deleted' });
  } catch {
    res.status(500).json({ error: 'Failed to delete task' });
  }
});

// ─── Tests ───────────────────────────────────────────────

describe('GET /tasks', () => {
  test('returns list of tasks with status 200', async () => {
    prisma.task.findMany.mockResolvedValue([
      { id: 1, title: 'Buy groceries' },
      { id: 2, title: 'Do laundry' },
    ]);
    const res = await request(app).get('/tasks');
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(2);
    expect(res.body[0].title).toBe('Buy groceries');
  });
});

describe('POST /tasks', () => {
  test('creates a new task and returns 201', async () => {
    prisma.task.create.mockResolvedValue({ id: 3, title: 'New task' });
    const res = await request(app)
      .post('/tasks')
      .send({ title: 'New task' });
    expect(res.statusCode).toBe(201);
    expect(res.body.title).toBe('New task');
  });

  test('returns 400 when title is empty', async () => {
    const res = await request(app)
      .post('/tasks')
      .send({ title: '' });
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe('Title is required');
  });

  test('returns 400 when title is missing', async () => {
    const res = await request(app)
      .post('/tasks')
      .send({});
    expect(res.statusCode).toBe(400);
  });
});

describe('PUT /tasks/:id', () => {
  test('updates a task and returns 200', async () => {
    prisma.task.update.mockResolvedValue({ id: 1, title: 'Updated task' });
    const res = await request(app)
      .put('/tasks/1')
      .send({ title: 'Updated task' });
    expect(res.statusCode).toBe(200);
    expect(res.body.title).toBe('Updated task');
  });

  test('returns 400 when title is empty on update', async () => {
    const res = await request(app)
      .put('/tasks/1')
      .send({ title: '' });
    expect(res.statusCode).toBe(400);
  });
});

describe('DELETE /tasks/:id', () => {
  test('deletes a task and returns 200', async () => {
    prisma.task.delete.mockResolvedValue({});
    const res = await request(app).delete('/tasks/1');
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Task deleted');
  });
});