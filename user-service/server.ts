import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

// MongoDB Connection
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/user_db';
let isMongoConnected = false;
const mockUsers: any[] = [];

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('User Service: Connected to MongoDB');
    isMongoConnected = true;
  })
  .catch(err => console.log('User Service: Running in-memory mode (MongoDB unavailable)'));

// User Model
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: 'user' }
});

const User = mongoose.model('User', userSchema);

// Helper to handle data
const saveUser = async (data: any) => {
  if (isMongoConnected) {
    const newUser = new User(data);
    return await newUser.save();
  } else {
    const newUser = { ...data, _id: Date.now().toString() };
    mockUsers.push(newUser);
    return newUser;
  }
};

const getUsers = async () => {
  if (isMongoConnected) return await User.find();
  return mockUsers;
};

// Routes
app.post('/users/register', async (req, res) => {
  try {
    const user = await saveUser(req.body);
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.post('/users/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    let user;
    if (isMongoConnected) {
      user = await User.findOne({ email, password });
    } else {
      user = mockUsers.find(u => u.email === email && u.password === password);
    }
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });
    res.json({ message: 'Login successful', user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/users', async (req, res) => {
  try {
    const users = await getUsers();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/users/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`User Service running on port ${PORT}`);
});
