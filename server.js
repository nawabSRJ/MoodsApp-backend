import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import mongodbURL from './config.js';
import Post from './models/post.js';
import cors from 'cors';  // Import CORS middleware

const app = express();
const port = 8000;

// Body Parser Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Enable CORS
app.use(cors({
    origin: 'https://moodsapp.netlify.app'  // Replace with your Netlify app URL
}));

// Setup Static folder
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, 'public')));

// Connect to MongoDB
mongoose.connect(mongodbURL)
    .then(() => {
        console.log('App connected to Database!');
        app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
    })
    .catch((error) => {
        console.log(error);
    });

// New Post
app.post('/posts', async (req, res) => {
    try {
        const { name, content } = req.body;
        if (!name || !content) {
            return res.status(400).send({ message: 'Name and content are required' });
        }
        const newPost = new Post({ name, content });
        await newPost.save();
        return res.status(201).send(newPost);
    } catch (error) {
        console.log(error);
        res.status(500).send('Failed to create post');
    }
});

// Get all posts
app.get('/posts', async (req, res) => {
    try {
        const posts = await Post.find();
        res.status(200).json(posts);
    } catch (error) {
        console.log(error);
        res.status(500).send('Failed to fetch posts');
    }
});
