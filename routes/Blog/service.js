/**
 * create : POST   - add
 * read   : GET    - fetch
 * update : PATCH  - modify
 * delete : DELETE - remove
 */
const postBlog = async ({ title, content, author }) => {
  const blog = new Blog({ title, content, author });
  await blog.save();
  res.status(201).json(blog, "post 성공~");

  //(controller 사용
  //   ("/blogs", async (req, res) => {
  //   try {
  //     const { title, content, author } = req.body;
  //     const blog = new Blog({
  //       title,
  //       content,
  //       author,
  //     });
  //     await blog.save();

  //     res.status(201).json(blog);
  //   } catch (error) {
  //     res.status(500).json({ message: error.message });
  //   }
  // });
};

//GET 블로그 글 전체 조회
const getBlogList = async ({ limit }) => {
  //return await Post.find().limit(limit);
  const blogs = await Blog.find().limit(limit);
  res.send(blogs);
};

// fetchById -> GET/POST 특정 블로그 글 조회 또는 수정에 사용
const fetchBlog = async (id) => {
  const blog = await Blog.findById(id);
  res.send(blog);
};

// DELETE 특정 블로그 글 삭제
const deleteBlog = async (id) => {
  const blog = await Blog.findByIdAndDelete(id);
};

const BlogService = {
  postBlog,
  getBlogList,
  fetchBlog,
  deleteBlog,
};

export default BlogService;
