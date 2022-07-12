// implement your server here
const express = require("express");

const server = express();

server.use(express.json());

// require your posts router and connect it here

const postsRouter = require("./posts/posts-router");

// const Posts = require("./posts/posts-model");

server.use("/api/posts", postsRouter);

module.exports = server;
