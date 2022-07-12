// implement your posts router here
const express = require("express");

const Posts = require("./posts-model");

const router = express.Router();

// 1	GET	/api/posts	Returns an array of all the post objects contained in the database
router.get("/", (req, res) => {
  Posts.find(req.query)
    .then((post) => {
      res.status(200).json(post);
    })
    .catch((err) => {
      console.log(err);
      res
        .status(500)
        .json({ message: "The posts information could not be retrieved" });
    });
});
// 2	GET	/api/posts/:id	Returns the post object with the specified id
router.get("/:id", (req, res) => {
  Posts.findById(req.params.id)
    .then((post) => {
      if (!post) {
        res
          .status(404)
          .json({ message: "The post with the specified ID does not exist" });
      } else {
        res.status(200).json(post);
      }
    })
    .catch((err) => {
      res.status(500).json({
        message: "The post information could not be retrieved",
        err: err.message,
        stack: err.stack,
      });
    });
});
// 3	POST	/api/posts	Creates a post using the information sent inside the request body and returns the newly created post object
router.post("/", (req, res) => {
  const article = req.body;
  if (!article.title || !article.contents) {
    res
      .status(400)
      .json({ message: "Please provide title and contents for the post" });
  } else {
    Posts.insert(article)
      .then(({ id }) => {
        return Posts.findById(id);
      })
      .then((posts) => {
        res.status(201).json(posts);
      })
      .catch((err) => {
        res.status(500).json({
          message: "There was an error while saving the post to the database",
          err: err.message,
          stack: err.stack,
        });
      });
  }
});
// 4	PUT	/api/posts/:id	Updates the post with the specified id using data from the request body and returns the modified document, not the original
router.put("/:id", (req, res) => {
  //   try {
  //     const possiblePost = await Posts.findById(req.params.id);
  //     if (!possiblePost) {
  //       res
  //         .status(404)
  //         .json({ message: "The post with the specified ID does not exist" });
  //     } else {
  //       const body = req.body;
  //       if (!body.title || !body.contents) {
  //         res
  //           .status(400)
  //           .json({ message: "Please provide title and contents for the post" });
  //       } else {
  //         const updatedPost = await Posts.update(req.params.id, req.body);
  //         res.status(200).json(updatedPost);
  //       }
  //     }
  //   } catch (err) {
  //     res.status(500).json({
  //       message: "The post information could not be modified",
  //       err: err.message,
  //       stack: err.stack,
  //     });
  //   }
  const body = req.body;
  if (!body.title || !body.contents) {
    res
      .status(400)
      .json({ message: "Please provide title and contents for the post" });
  } else {
    Posts.findById(req.params.id)
      .then((post) => {
        if (!post) {
          res
            .status(404)
            .json({ message: "The post with the specified ID does not exist" });
        } else {
          return Posts.update(req.params.id, req.body);
        }
      })
      .then((post) => {
        if (post) {
          return Posts.findById(req.params.id);
        }
      })
      .then((post) => {
        res.status(200).json(post);
      })
      .catch((err) => {
        res.status(500).json({
          message: "The post information could not be modified",
          err: err.message,
          stack: err.stack,
        });
      });
  }
});

// 5	DELETE	/api/posts/:id	Removes the post with the specified id and returns the deleted post object
router.delete("/:id", async (req, res) => {
  try {
    const deletedPost = await Posts.findById(req.params.id);
    if (!deletedPost) {
      res
        .status(404)
        .json({ message: "The post with the specified ID does not exist" });
    } else {
      await Posts.remove(req.params.id);
      res.status(200).json(deletedPost);
    }
  } catch (err) {
    res.status(500).json({
      message: "The post could not be removed",
      err: err.message,
      stack: err.stack,
    });
  }
});
// 6	GET	/api/posts/:id/comments	Returns an array of all the comment objects associated with the post with the specified id

router.get("/:id/comments", (req, res) => {});

module.exports = router;
