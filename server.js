const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const User = require('./models/User');
const Recipe = require('./models/Recipe');  // Import Recipe model
const bcrypt = require('bcryptjs');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(cors());

// Home page API
app.get('/', (req, res) => {
    res.send("<h1 align=center>Welcome to the MERN stack week 2 session</h1>");
});

// 📌 **User Registration API**
app.post('/register', async (req, res) => {
    const { username, email, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ username, email, password: hashedPassword });
        await user.save();
        res.json({ message: "User Registered.." });
        console.log("User Registration completed...");
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Error registering user" });
    }
});

// 📌 **User Login API**
app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(400).json({ message: "Invalid Credentials" });
        }
        res.json({ message: "Login Successful", username: user.username });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Error logging in" });
    }
});

// 📌 **Add Recipe API**
app.post('/recipes', async (req, res) => {
    const { name, description, imageUrl, ingredients, instructions } = req.body;
    try {
        const recipe = new Recipe({ name, description, imageUrl, ingredients, instructions });
        await recipe.save();
        res.json({ message: "Recipe Added Successfully!" });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Error adding recipe" });
    }
});

// 📌 **Get All Recipes API**
app.get('/recipes', async (req, res) => {
    try {
        const recipes = await Recipe.find();
        res.json(recipes);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Error fetching recipes" });
    }
});

// 📌 **Get Single Recipe by ID**
app.get('/recipes/:id', async (req, res) => {
    try {
        const recipe = await Recipe.findById(req.params.id);
        if (!recipe) {
            return res.status(404).json({ message: "Recipe not found" });
        }
        res.json(recipe);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Error fetching recipe" });
    }
});

// 📌 **Update Recipe API**
app.put('/recipes/:id', async (req, res) => {
    const { name, description, imageUrl, ingredients, instructions } = req.body;
    try {
        const updatedRecipe = await Recipe.findByIdAndUpdate(req.params.id, 
            { name, description, imageUrl, ingredients, instructions }, 
            { new: true }
        );
        if (!updatedRecipe) {
            return res.status(404).json({ message: "Recipe not found" });
        }
        res.json({ message: "Recipe Updated Successfully", updatedRecipe });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Error updating recipe" });
    }
});

// 📌 **Delete Recipe API**
app.delete('/recipes/:id', async (req, res) => {
    try {
        const deletedRecipe = await Recipe.findByIdAndDelete(req.params.id);
        if (!deletedRecipe) {
            return res.status(404).json({ message: "Recipe not found" });
        }
        res.json({ message: "Recipe Deleted Successfully" });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Error deleting recipe" });
    }
});

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("DB connected successfully.."))
    .catch((err) => console.log(err));

// Start the server
app.listen(PORT, (err) => {
    if (err) {
        console.log(err);
    }
    console.log("Server is running on port: " + PORT);
});
