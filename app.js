//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose");


// Mongoose
mongoose.connect("mongodb://0.0.0.0:27017/postsDB");

// Creates the schema of posts
const postsSchema = new mongoose.Schema({
  title: String,
  content: String
});

// Creates the model for the mongoose
const Post = mongoose.model("Post", postsSchema);

// Finish mongoose


const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));



app.get("/", function(req, res){
  // searches in the database for all the posts and adds the results in the res.render "posts"
  Post.find({}, function(err, results){
    res.render("home", {
      startingContent: homeStartingContent,
      posts: results
      });
  });
});

app.get("/about", function(req, res){
  res.render("about", {aboutContent: aboutContent});
});

app.get("/contact", function(req, res){
  res.render("contact", {contactContent: contactContent});
});

app.get("/compose", function(req, res){
  res.render("compose" );
});


app.post("/compose", function(req, res){
  const postTitle = req.body.postTitle
  const postContent = req.body.postBody
 // This part creates a new post in the compose part of the page by adding its title and content into the databe
  const newPost = new Post({
    title: postTitle,
    content: postContent
  })
  newPost.save()
  res.redirect("/");
});

//this part makes the :postID flexible by using Express route parameter
app.get("/posts/:postID", function(req, res){
  const requestedID = req.params.postID;
//This part finds the post by its ID and renders it into "post" in the "views" folder which has a "title" and "content"
  Post.findById({_id:requestedID}, function(err, foundItems){
    if (err){
      console.log(err)
    } else {
      // tap into the foundItems.title and content to render it
      res.render("post", {
        title: foundItems.title,
        content: foundItems.content
      })
      }
    });
});




//
// Post.find({_id:requestedID}, function(err, foundItems){
//   if (err){
//     console.log(err)
//   } else {
//     if (foundItems._id === requestedID){
//       res.render("post", {
//         storedTitle: foundItems.title,
//         storedContent: foundItems.content
//       });
//     }
//   }
// });
// });




app.listen(3000, function() {
  console.log("Server started on port 3000");
});
