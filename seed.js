import mongoose from "mongoose";
import Blog from "./models/Blog.js";

import { DATABASE_URL } from "./env.js";
import * as dotenv from "dotenv";
dotenv.config();

const data = [
  {
    title: "JS Master",
    content: "Java Script",
    author: "강태진",
    createdAt: new Date("2023-03-23T06:34:07.617Z"),
    updatedAt: new Date("2023-03-23T06:34:07.617Z"),
  },
  {
    title: "React Master",
    content: "React",
    author: "최은비",
    createdAt: new Date("2023-03-23T06:34:09.617Z"),
    updatedAt: new Date("2023-03-23T06:34:09.617Z"),
  },
  {
    title: "TS Master",
    content: "Type Script",
    author: "정하윤",
    createdAt: new Date("2023-03-23T06:34:10.617Z"),
    updatedAt: new Date("2023-03-23T06:34:10.617Z"),
  },
  {
    title: "Nest Master",
    content: "Nest",
    author: "정한샘",
    createdAt: new Date("2023-03-23T06:34:12.617Z"),
    updatedAt: new Date("2023-03-23T06:34:12.617Z"),
  },
];

mongoose.connect(DATABASE_URL);

await Blog.deleteMany({});
await Blog.insertMany(data);

mongoose.connection.close();
