const bodyParser       = require("body-parser"),
methodOverride         = require("method-override"),
expressSanitizer       = require("express-sanitizer"),
mongoose               = require("mongoose"),
express                = require('express'),
app                    = express()
port                   = 3000


// APP CONFIG
mongoose.connect("mongodb://localhost/mattUnderwood_me", {useNewUrlParser: true });
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressSanitizer());
app.use(methodOverride("_method"));


// MONGOOSE/MODEL CONFIG
var blogSchema = new mongoose.Schema ({
    title: String,
    image: String,
    body: String,
    created: {type: Date, default: Date.now}
});

var Blog = mongoose.model("Blog", blogSchema);

// SINGLE BLOG CREATION FOR TEST
// Blog.create({
//     title: "Test Blog",
//     image: "https://images.unsplash.com/photo-1529485726363-95c8d62f656f?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=0274f107ddcec622ed9e5f9aafb81cc4&auto=format&fit=crop&w=1567&q=80",
//     body: "Hello, this is a test"
// });

// RESTFUL ROUTES

// INDEX ROUTE
app.get('/', (req, res) => res.render('index'));

// BLOG ROUTE
app.get('/blogs', (req, res) => {
    Blog.find({}, (err, blogs) => {
        if (err) {
            console.log('Error');
        } else {
            res.render('blog', {blogs: blogs});
        }
    });
});

// NEW ROUTE
app.get("/blogs/new", (req, res) => {
    res.render("new");
});

// CREATE ROUTE
app.post("/blogs", (req, res) => {
    // implement middleware for sanitize line in the future
    req.body.blog.body = req.sanitize(req.body.blog.body)
    // create blog
    Blog.create(req.body.blog, (err, newBlog) => {
        if(err){
            res.render("new");
        } else {
            // then redirect to the index
            res.redirect("/blogs");
        }
    })
});

// SHOW ROUTE
app.get("/blogs/:id", (req, res) => {
    Blog.findById(req.params.id, (err, foundBlog) => {
        if(err){
            res.redirect("/blogs");
        } else {
            res.render("show", {blog: foundBlog});
        }
    })
});

// EDIT ROUTE
app.get("/blogs/:id/edit", (req, res) => {
    Blog.findById(req.params.id, (err, foundBlog) => {
        if(err){
            res.redirect("/blogs");
        } else {
            res.render("edit", {blog: foundBlog});
        }
    })
});

// UPDATE ROUTE
app.put("/blogs/:id", (req, res) => {
    // implement middleware for sanitize line in the future
    req.body.blog.body = req.sanitize(req.body.blog.body)
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, (err, updatedBlog) => {
        if(err){
            res.redirect("/blogs");
        } else {
            res.redirect(`/blogs/${req.params.id}`);
        }
    })
});

// DELETE ROUTE
app.delete("/blogs/:id", (req, res) => {
    // destroy blog
    Blog.findByIdAndRemove(req.params.id, err => {
        if(err){
            res.redirect("/blogs");
        } else {
            res.redirect("/blogs");
        }
    })
    // redirect somewhere
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`))