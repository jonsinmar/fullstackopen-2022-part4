const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");

const api = supertest(app);

describe("get blogs as json", () => {
  test("blogs are returned as json", async () => {
    await api
      .get("/api/blogs")
      .expect(200)
      .expect("Content-Type", /application\/json/);
  }, 100000);
  //this third parameter sets the timeout of the 'connection'
});

describe("blogs have id instead of _id", () => {
  test("returned blog objects have id parameter", async () => {
    const response = await api.get("/api/blogs");
    const blog = response.body[0];
    expect(blog.id).toBeDefined();
  }, 10000);
});

describe("POST requests add a new blog to the databse", () => {
  test("a new blog can be added", async () => {
    const initialBlogs = (await api.get("/api/blogs")).body;

    const newBlog = {
      author: "Alberto Einsteinium",
      likes: 1234,
      title: "La energía ni se crea ni se destruye: se transforma",
      url: null,
    };

    await api
      .post("/api/blogs")
      .send(newBlog)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const response = await api.get("/api/blogs");

    // const contents = response.body.map((r) => r.content);

    expect(response.body).toHaveLength(initialBlogs.length + 1);
    // expect(contents).toContain("async/await simplifies making async calls");
  });
});

describe("if 'likes' are not specified in the request it will default to 0", ()=>{
    test("after saving new blog with no likes parameter it will in the response object", async()=>{
        const newBlog = {
            author: "Alberto Einsteinium",
            title: "La energía ni se crea ni se destruye: se transforma",
            url: null,
          };
        const response = await api.post('/api/blogs').send(newBlog).expect(201);

        expect(response.body.likes).toBeDefined()
    })
});

describe('error handling when bad request',()=>{
    test.only('if url and title are not in the request, the server will respond with a status code 400', async ()=>{
        const newBlog = {
            author: "Alberto Einsteinium",
            likes: 1234,
          };
          await api.post('/api/blogs').send(newBlog).expect(400);
    })
}, 10000)

afterAll(() => {
  mongoose.connection.close();
});
