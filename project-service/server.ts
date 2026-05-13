import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5003;

app.use(cors());
app.use(express.json());

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/project_db';
mongoose.connect(MONGO_URI)
  .then(() => console.log('Project Service: Connected to MongoDB'))
  .catch(err => console.log('Project Service: MongoDB connection error (using mock data):', err.message));

const projectSchema = new mongoose.Schema({
  projectName: { type: String, required: true },
  teamMembers: [String],
  progress: { type: Number, default: 0 },
  startDate: Date,
  endDate: Date
});

const Project = mongoose.model('Project', projectSchema);

app.post('/projects', async (req, res) => {
  try {
    const project = new Project(req.body);
    await project.save();
    res.status(201).json(project);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get('/projects', async (req, res) => {
  try {
    const projects = await Project.find();
    res.json(projects);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/projects/:id', async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(project);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Project Service running on port ${PORT}`);
});
