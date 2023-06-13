import express from "express";

import { IdGenerator } from "../Services/IdGenerator";
import { TokenManager } from "../Services/TokenManager";
import { PostController } from "../Controller/PostController";
import { PostBusiness } from "../Business/PostBusiness";
import { PostDatabase } from "../Database/PostDatabase";

const postRouter = express.Router()

const postController = new PostController(
    new PostBusiness(
        new PostDatabase(),
        new IdGenerator(),
        new TokenManager(),
    )
)

postRouter.post("/createpost", postController.createPost)
postRouter.delete("/deletepost", postController.deletePost)
postRouter.put("/editpost", postController.editPost)
postRouter.get("/findpost/:post_id", postController.findPosts)
postRouter.get("/postslist", postController.listAllPosts)

export default postRouter;