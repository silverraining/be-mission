import express from "express";
import mongoose from "mongoose";
import { DATABASE_URL } from "./env.js";
import Blog from "./models/Blog.js";
import Comment from "./models/Comment.js";
// import router from "./routes/index.js";

import * as dotenv from "dotenv";
dotenv.config();

// import BlogService from "./routes/Blog/service.js";
const app = express();
const PORT = 8001;
app.use(express.json());

mongoose
  .connect(DATABASE_URL)
  .then(() => console.log("몽고디비 연결 성공^^"))
  .catch((e) => console.log(error));

// 기본 라우트 (서버 동작 확인)
app.get("/", (req, res) => {
  res.send("서버가 정상적으로 동작중입니다!");
});
// app.use("/", router);

//서버 포트 listen
app.listen(PORT, () => {
  console.log(`서버가 http://localhost:${PORT} 에서 실행 중입니다`);
});

//POST 새로운 블로그 포스트 추가.
app.post("/blogs", async (req, res) => {
  const { title, content, author } = req.body;
  try {
    const blog = new Blog({ title, content, author });
    await blog.save();
    res.status(201).json({ message: "Blog post created successfully!", blog });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET 블로그 글 전체 조회
// app.get("/blogs", async (req, res) => {
//   const { limit } = req.query;
//   try {
//     const blogs = await Blog.find().limit(parseInt(limit) || 0); //default 10
//     res.status(200).json(blogs);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

// GET 블로그 글 전체 조회
//
app.get("/blogs", async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 5;
    const blogs = await Blog.find().limit(limit);
    if (blogs.length === 0) {
      return res.status(404).json({ message: "데이터가 존재하지 않습니다." });
    }
    res.status(200).json(blogs);
  } catch (err) {
    res.status(500).send("에러발생");
  }
});

//특정 블로그 글 조회
app.get("/blogs/:id", async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).send("블로그 글을 찾을 수 없습니다.");
    }
    res.status(200).json(blog);
  } catch (error) {
    res.status(500).send("에러가 발생했습니다.");
  }
});

//PATCH 특정 블로그 글 수정
//author은 수정 불가능, title, content만 수정 가능
app.patch("/blogs/:id", async (req, res) => {
  const { title, content } = req.body;
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).send("야 블로그 없잖아 ㅡㅡ");
    if (req.body.author) {
      return res.status(400).send("Author는 수정 불가능~~");
    }
    if (title) blog.title = title;
    if (content) blog.content = content;
    await blog.save();
    res.status(204).send(blog);
  } catch (error) {
    res.status(500).send("야 에러다");
  }
});

// DELETE 특정 블로그 글 삭제
app.delete("/blogs/:id", async (req, res) => {
  try {
    const blog = await Blog.findByIdAndDelete(req.params.id);

    if (!blog) {
      return res.status(404).send("블로그 없잖아 ㅡㅡ");
    }

    res.status(204).send("블로그 삭제 성공");
  } catch (err) {
    res.status(500).send("야 에러다");
  }
});

//-------------------comment--------------------------
// POST: 블로그에 댓글 작성
app.post("/blogs/:blogId/comments", async (req, res) => {
  const { blogId } = req.params;
  const { content, author } = req.body;

  if (!blogId) {
    return res.status(400).json({ message: "blog not found" });
  }

  try {
    const comment = new Comment({ blogId, content, author });
    await comment.save();
    res.status(201).json({ message: "댓글 등록 성공~", comment }); // Respond with success message and the saved comment
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET: 특정 블로그의 댓글 조회
// 경로 /blogs/blogID/comments
app.get("/blogs/:blogId/comments", async (req, res) => {
  const { blogId } = req.params;

  try {
    const comments = await Comment.find({ blogId });
    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PATCH: 특정 댓글 수정
// 경로 /blogs/blogID/comments/commentID
app.patch("/blogs/:blogId/comments/:commentId", async (req, res) => {
  const { blogId, commentId } = req.params;
  const { content } = req.body;

  try {
    const comment = await Comment.findOne({ _id: commentId, blogId }); // by ID(comment) and blog ID
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    comment.content = content; // 수정
    await comment.save();
    res.status(200).json({ message: "댓글 업데이트 성공~~ ", comment });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// DELETE: 특정 댓글 삭제
app.delete("/blogs/:blogId/comments/:commentId", async (req, res) => {
  const { commentId } = req.params;

  try {
    const comment = await Comment.findByIdAndDelete(commentId);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found." });
    }
    res.json({ message: "댓글 삭제 성공 ~~ " });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST: 대댓글 작성 (parentCommentId 사용)
// 경로 /blogs/blogID/comments/commentID/reply
app.post("/blogs/:blogId/comments/:commentId/reply", async (req, res) => {
  const { commentId } = req.params;
  const { content, author, blogId } = req.body;

  try {
    const parentComment = await Comment.findById(commentId);
    if (!parentComment) {
      return res.status(404).json({ message: "댓글 not found" });
    }

    const reply = new Comment({
      content,
      author,
      blogId,
      parentCommentId: commentId,
    });

    await reply.save();
    res.status(201).json({ message: "대댓글 작성 성공", reply });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
