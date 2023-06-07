import express from "express";
import { LikesController } from "../Controller/LikesController";
import { LikesBusiness } from "../Business/LikesBusiness";
import { LikesDatabase } from "../Database/LikesDatabase";
import { PostDatabase } from "../Database/PostDatabase";
import { UserDatabase } from "../Database/UserDatabase";

const likeDislikeRouter = express.Router()

const likesController = new LikesController(
    new LikesBusiness(
        new LikesDatabase(),
        new PostDatabase(),
        new UserDatabase()
    )
)

likeDislikeRouter.post("/likedislike", likesController.likedislike)

export default likeDislikeRouter