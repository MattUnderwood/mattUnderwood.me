const bodyParser       = require("body-parser"),
methodOverride         = require("method-override"),
expressSanitizer       = require("express-sanitizer"),
mongoose               = require("mongoose"),
express                = require('express'),
app                    = express()
port                   = 3000


// APP CONFIG
app.set('view engine', 'ejs');
app.use(express.static(__dirname + 'public'));
// NOT NEEDED YET
// app.use(bodyParser.urlencoded({extended: true}));
// app.use(expressSanitizer());
// app.use(methodOverride("_method"));


// INDEX ROUTE
app.get('/', (req, res) => res.render('index'));

// BLOG ROUTE
app.get('/blog', (req, res) => {
    Blog.find({}, (err, blogs) => {
        if (err) {
            console.log('Error');
        } else {
            res.render('blog', {blogs});
        }
    });
});

// NEW ROUTE
app.get("/blog/new", (req, res) => {
    res.render("new");
});

// CREATE ROUTE
app.post("/blog", (req, res) => {
    // implement middleware for sanitize line in the future
    req.body.blog.body = req.sanitize(req.body.blog.body)
    // create blog
    Blog.create(req.body.blog, (err, newBlog) => {
        if(err){
            res.render("new");
        } else {
            // then redirect to the index
            res.redirect("/blog");
        }
    })
});

// SHOW ROUTE
app.get("/blog/:id", (req, res) => {
    Blog.findById(req.params.id, (err, foundBlog) => {
        if(err){
            res.redirect("/blog");
        } else {
            res.render("show", {blog: foundBlog});
        }
    })
});

// EDIT ROUTE
app.get("/blog/:id/edit", (req, res) => {
    Blog.findById(req.params.id, (err, foundBlog) => {
        if(err){
            res.redirect("/blog");
        } else {
            res.render("edit", {blog: foundBlog});
        }
    })
});

// UPDATE ROUTE
app.put("/blog/:id", (req, res) => {
    // implement middleware for sanitize line in the future
    req.body.blog.body = req.sanitize(req.body.blog.body)
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, (err, updatedBlog) => {
        if(err){
            res.redirect("/blog");
        } else {
            res.redirect(`/blog/${req.params.id}`);
        }
    })
});

// DELETE ROUTE
app.delete("/blog/:id", (req, res) => {
    // destroy blog
    Blog.findByIdAndRemove(req.params.id, err => {
        if(err){
            res.redirect("/blog");
        } else {
            res.redirect("/blog");
        }
    })
    // redirect somewhere
});



app.listen(port, () => console.log(`Example app listening on port ${port}!`))