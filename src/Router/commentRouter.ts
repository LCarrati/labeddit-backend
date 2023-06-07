import express from "express"
import { CommentBusiness } from "../Business/CommentBusiness"
import { CommentController } from "../Controller/CommentController"
import { CommentDatabase } from "../Database/CommentDatabase"
import { PostDatabase } from "../Database/PostDatabase"
import { IdGenerator } from "../Services/IdGenerator"
import { TokenManager } from "../Services/TokenManager"

export const commentRouter = express.Router()

const commentController = new CommentController(
    new CommentBusiness(
        new CommentDatabase(),
        new PostDatabase(),
        new IdGenerator(),
        new TokenManager(),
    )
)

commentRouter.post("/addcomment", commentController.addComment)
commentRouter.put("/editcomment", commentController.editComment)
commentRouter.delete("/deletecomment", commentController.deleteComment)
commentRouter.get("/findcomment", commentController.getCommentById)
commentRouter.get("/getallcomments", commentController.getAllCommentsFromPost)