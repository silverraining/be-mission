import mongoose from "mongoose";

const ReplySchema = new mongoose.Schema(
  {
    content: {
      type: String,
    },
    author: {
      type: String,
      required: true,
    },
    comment_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment", // 댓글 모델 참조
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Reply = mongoose.model("Reply", ReplySchema);
export default Reply;
