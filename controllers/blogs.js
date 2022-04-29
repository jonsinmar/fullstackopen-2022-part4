const blogsRouter = require("express").Router();
const Blog = require("../models/blog");

blogsRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({});
  response.status(200).json(blogs)
});

blogsRouter.post("/", async (request, response) => {
    if(!request.body.title && !request.body.url){
        return response.status(400).json({error: 'title and url are mandatory'});
    }
    let blog = request.body;
    if(!request.body.likes){
        blog = {...blog,likes:0}
    }
  const blogBSON = new Blog(blog);
  

  const result = await blogBSON.save();

  response.status(201).json(result);
});


module.exports = blogsRouter;