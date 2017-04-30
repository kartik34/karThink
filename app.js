// mongod --dbpath /data/db --repair
var express    = require("express"), 
    app        = express(), 
    bodyparser = require("body-parser"),
    mongoose  = require("mongoose"),
    methodoverride = require("method-override")
    
//APP CONFIG 
app.set("view engine", "ejs"); 
mongoose.connect("mongodb://localhost/restful_blog_app"); 
app.use(express.static("public"))
app.use(bodyparser.urlencoded({extended: true}))
app.use(methodoverride("_method")); 
//MONGOOSE SCHEMA CONFIG
var blogSchema = new mongoose.Schema({
    title: String,
    image: String, 
    body: String,
    created: {type: Date, default: Date.now}
})

var Blog = mongoose.model("blog", blogSchema)

//RESTFUL ROUTES
app.get("/", function(req, res) {
    res.redirect("/blog")
})


app.get("/blog/new", function(req, res) {
    res.render("makeblog");
})
app.get("/blog", function(req,res){
    
    Blog.find({}, function(err,blogs){
        if(err){
            console.log(err)
        }else{
            res.render("index.ejs", {blogs: blogs})
        }
    })
    
    
})

app.get("/blog/:id/edit", function(req, res) {
     Blog.findById(req.params.id, function(err, blog){
        if(err){
            console.log(err)
        }else{
             res.render("edit", {blog: blog})
        }
    })

})
app.post("/blog", function(req,res){
    Blog.create(
        req.body.blog 
    , function(err,blog){
        if(err){
            console.log(err)
        }else{
            res.redirect("/blog"); 
        }
    })
})

app.put("/blog/:id", function(req,res){
    console.log("hello")
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err,foundblog){
        if(err){
            res.redirect("/blog")
        }else{
            res.redirect("/blog/" + req.params.id)
        }
    })
})


app.get("/blog/:id", function(req, res) {
    Blog.findById(req.params.id, function(err, blog){
        if(err){
            console.log(err)
        }else{
             res.render("show", {blog: blog})
        }
    })
   
})

// Blog.create({
//     title: "Architecture",
//     image: "https://upload.wikimedia.org/wikipedia/commons/9/94/Top_of_Rock_Cropped.jpg", 
//     body: "New york is a really close place you should visit", 

// })

app.delete("/blog/:id", function(req,res){
     Blog.findByIdAndRemove(req.params.id, function(err){
         if(err){
             res.redirect("/blog"); 
         }else{
             res.redirect("/blog"); 
         }
     })
     
    
})




















app.listen(process.env.PORT, process.env.IP, function(){
    console.log("server is running")
})



