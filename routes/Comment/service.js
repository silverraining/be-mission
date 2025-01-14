/**
 * create : POST   - add
 * read   : GET    - fetch
 * update : PATCH  - modify
 * delete : DELETE - remove
 */

//POST 블로그에 댓글 작성
const createComment = async ({ blogId, content, author }, res) => {
  if (!blogId) {
    return res.status(400).json({ message: "blog not found" });
  }

  const comment = new Comment({ blogId, content, author });
  await comment.save(); // Save the comment to the database
  res.status(201).json({ message: "댓글 등록 성공~", comment }); // Respond with success message and the saved comment
};

//GET 특정 블로그의 댓글 조회
// 경로 /blogs/blogID/comments
const getCommentsByBlogId = async ({ blogId }, res) => {
  const comments = await Comment.find({ blogId }); // Fetch by blog ID
  res.json(comments);
};

// PATCH 특정 댓글 수정
// 경로 /blogs/blogID/comments/commentID
const updateCommentById = async ({ blogId, commentId, content }, res) => {
  const comment = await Comment.findOne({ _id: commentId, blogId }); // by ID(comment) and blog ID
  comment.content = content;
  await comment.save(); // Save the updated comment
  res.status(200).json({ message: "Comment updated successfully.", comment });
};

// DELETE 특정 댓글 삭제
const deleteCommentById = async (commentId) => {
  const comment = await Comment.findByIdAndDelete(commentId);
  if (!comment) {
    throw new Error("Comment not found.");
  }
  return comment;
};

// 대댓글 기능
// 경로 /blogs/blogID/comments/commentID
const createReplyToComment = async (
  parentCommentId,
  { content, author, blogId }
) => {
  const parentComment = await Comment.findById(parentCommentId);
  if (!parentComment) {
    throw new Error("Parent comment not found.");
  }

  const reply = new Comment({
    content,
    author,
    blogId,
    parentCommentId,
  });

  await reply.save();
  return reply;
};
