import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5002;

app.use(cors());
app.use(express.json());

// MongoDB Connection
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/task_db';
let isMongoConnected = false;
const mockTasks: any[] = [];

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('Task Service: Connected to MongoDB');
    isMongoConnected = true;
  })
  .catch(err => console.log('Task Service: Running in-memory mode'));

// Task Model
const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  assignedUser: String,
  priority: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Medium' },
  deadline: Date,
  status: { type: String, enum: ['Pending', 'In Progress', 'Completed'], default: 'Pending' }
});

const Task = mongoose.model('Task', taskSchema);

// Helpers
const saveTask = async (data: any) => {
  if (isMongoConnected) return await new Task(data).save();
  const t = { ...data, _id: Date.now().toString() };
  mockTasks.push(t);
  return t;
};

const getTasks = async () => {
  if (isMongoConnected) return await Task.find();
  return mockTasks;
};

app.post('/tasks', async (req, res) => {
  try {
    const task = await saveTask(req.body);
    res.status(201).json(task);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get('/tasks', async (req, res) => {
  try {
    const tasks = await getTasks();
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/tasks/:id', async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(task);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.delete('/tasks/:id', async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Task Service running on port ${PORT}`);
});
