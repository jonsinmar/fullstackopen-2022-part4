const dummy = (blogs) => {
  return 1;
};

const totalLikes = (blogs) => {
  if (blogs.length === 0) {
    return 0;
  }

  if (blogs.length === 1) {
    return blogs[0].likes;
  }

  return blogs?.reduce((blogA, blogB) => {
    const newBlog = { ...blogA, likes: blogA.likes + blogB.likes };
    return newBlog;
  }).likes;
};

const favouriteBlog = (blogs) => {
  const favourite = blogs.sort((blogA, blogB) => blogB.likes - blogA.likes)[0];
  return {
    title: favourite.title,
    author: favourite.author,
    likes: favourite.likes,
  };
};

const mostBlogs = (blogs) => {
  let authors = [];
  blogs.forEach(blog => {
      const authorIndex = authors.findIndex(author=>blog.author === author.author);
      if(authorIndex !== -1){
        authors[authorIndex]= {author: blog.author, blogs: authors[authorIndex].blogs+1 }
      }else{
          authors.push({author: blog.author, blogs:1})
      }
  });
  const favourite = authors.sort((authorA, authorB) => authorB.blogs - authorA.blogs)[0];
  return favourite;
};

const mostLikes = (blogs)=>{
    let authors = [];
    blogs.forEach(blog => {
        const authorIndex = authors.findIndex(author=>blog.author === author.author);
        if(authorIndex !== -1){
          authors[authorIndex]= {...authors[authorIndex], likes: authors[authorIndex].likes + blog.likes  }
        }else{
            authors.push({author: blog.author, likes:blog.likes})
        }
    });
    console.log(authors)
    const favourite = authors.sort((authorA, authorB) => authorB.likes - authorA.likes)[0];
    return favourite;
}

module.exports = {
  dummy,
  totalLikes,
  favouriteBlog,
  mostBlogs,
  mostLikes
};
