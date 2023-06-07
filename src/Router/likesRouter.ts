import express from "express";
import { LikesController } from "../Controller/LikesController";
import { LikesBusiness } from "../Business/LikesBusiness";
import { LikesDatabase } from "../Database/LikesDatabase";
import { PostDatabase } from "../Database/PostDatabase";
import { UserDatabase } from "../Database/UserDatabase";
import { TokenManager } from "../Services/TokenManager";
import { CommentDatabase } from "../Database/CommentDatabase";

const likeDislikeRouter = express.Router()

const likesController = new LikesController(
    new LikesBusiness(
        new LikesDatabase(),
        new CommentDatabase(),
        new PostDatabase(),
        new UserDatabase(),
        new TokenManager()
    )
)

likeDislikeRouter.post("/likedislike", likesController.likedislike)
likeDislikeRouter.post("/commentlikedislike", likesController.commentLikeDislike)

export default likeDislikeRouter