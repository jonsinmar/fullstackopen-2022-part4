const blogsRouter = require("express").Router();
const Blog = require("../models/blog");
const User = require("../models/user");
const jwt = require('jsonwebtoken');

const getTokenFrom = request => {
  const authorization = request.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    return authorization.substring(7)
  }
  return null
}

blogsRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({}).populate('user',{
    username: 1,
    name: 1,
    id:1
  });
  response.status(200).json(blogs);
});

blogsRouter.post("/", async (request, response) => {
  if (!request.body.title && !request.body.url) {
    return response.status(400).json({ error: "title and url must be provided" });
  }
  const token = getTokenFrom(request)
  const decodedToken = jwt.verify(token, process.env.SECRET)
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }
  const user = await User.findById(decodedToken.id);

  let blog = {
    title: request.body.title,
    author: request.body.author,
    url: request.body.url,
    likes: request.body.likes,
    user
  };
  if (!request.body.likes) {
    blog = { ...blog, likes: 0 };
  }
  
  const newBlog = new Blog(blog);
  const savedBlog = await newBlog.save();
  user.blogs = user.blogs.concat(savedBlog);
  await user.save();

  response.status(201).json(savedBlog);
});

module.exports = blogsRouter;
