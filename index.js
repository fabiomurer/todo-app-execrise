const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require('path');
const _ = require("lodash");
const cors = require('cors')
app.use(cors());
// Set the view engine to EJS
app.set("view engine", "ejs");

// Middleware for parsing application/x-www-form-urlencoded
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files directory
app.use(express.static(path.join(__dirname, "public")));

app.use("/",express.static("./node_modules/bootstrap/dist/"));
app.use("/",express.static("./node_modules/bootstrap-icons/font/"));

// Database connection
const mongoDBUri = "hehe";
mongoose.connect(mongoDBUri, { useNewUrlParser: true, useUnifiedTopology: true });



const todoSchema = new mongoose.Schema({
    todo: String,
    done: Boolean
})


const Todo = mongoose.model("Todo", todoSchema);

app.get("/", async (req, res) => {
    try {
        const todos = await Todo.find({});
        res.render("home", { todos });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching todos');
    }
});

app.post("/", async (req, res) => {
    const newTodo = new Todo({
        todo: req.body.todo,
        done: false
    });

    try {
        await newTodo.save();
        res.redirect("/");
    } catch (error) {
        console.error(error);
        res.result(500).send('Error saving todo');
    }
});

app.post('/todos/done/:id', async (req, res) => {
    try {
        const result = await Todo.findByIdAndUpdate(req.params.id, {done: true});
        if (!result) {
            return res.status(404).send('Post not found');
        }
        res.redirect('/'); // Redirect to the homepage or another appropriate page
    } catch (error) {
        console.error(error);
        res.status(500).send('Error deleting todo');
    }
});

app.post('/todos/undone/:id', async (req, res) => {
    try {
        const result = await Todo.findByIdAndUpdate(req.params.id, {done: false});
        if (!result) {
            return res.status(404).send('Post not found');
        }
        res.redirect('/'); // Redirect to the homepage or another appropriate page
    } catch (error) {
        console.error(error);
        res.status(500).send('Error deleting todo');
    }
});

app.post('/todos/delete/:id', async (req, res) => {
    try {
        const result = await Todo.findByIdAndDelete(req.params.id);
        if (!result) {
            return res.status(404).send('Post not found');
        }
        res.redirect('/'); // Redirect to the homepage or another appropriate page
    } catch (error) {
        console.error(error);
        res.status(500).send('Error deleting todo');
    }
});


// Listen on default port 8080
app.listen(8080);
