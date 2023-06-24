import { Request, Response } from "express";
import { ZodError } from "zod";
import { BaseError } from "../Errors/BaseError";
import { LikesBusiness } from "../Business/LikesBusiness";
import { likeDislikeCommentSchema, likeDislikeSchema } from "../dtos/LikesDtos/likes.dto";

export class LikesController {
    constructor(private likesBusiness: LikesBusiness) { }

    public likedislike = async (req: Request, res: Response): Promise<void> => {
        try {
            const token = req.cookies.lctkn as string;
            const input = likeDislikeSchema.parse({
                post_id: req.body.post_id,
                likeDislike: req.body.likeDislike,
                token
            })
            const output = await this.likesBusiness.likeDislike(input);
            res.status(200).send(output);
        } catch (error) {
            if (error instanceof ZodError) {
                res.status(400).send(error.issues[0].message);
            } else if (error instanceof BaseError) {
                res.status(error.statusCode).send(error.message);
            } else {
                res.status(500).send("Erro inesperado");
            }
        }
    }

    public commentLikeDislike = async (req: Request, res: Response): Promise<void> => {
        try {
            const token = req.cookies.lctkn as string;
            const input = likeDislikeCommentSchema.parse({
                comment_id: req.body.comment_id,
                likedislike: req.body.likeDislike,
                token
            })
            const output = await this.likesBusiness.commentLikeDislike(input);
            res.status(200).send(output);
        } catch (error) {
            if (error instanceof ZodError) {
                res.status(400).send(error.issues[0].message);
            } else if (error instanceof BaseError) {
                res.status(error.statusCode).send(error.message);
            } else {
                res.status(500).send("Erro inesperado");
            }
        }
    }

    public checkLikeStatus = async (req: Request, res: Response): Promise<void> => {
        try {
            const token = req.cookies.lctkn as string;
            const input = {
                post_id: req.body.post_id,
                token
            }
            const output = await this.likesBusiness.checkLikeStatus(input);
            res.status(200).send(output);
        } catch (error) {
            if (error instanceof ZodError) {
                res.status(400).send(error.issues[0].message);
            } else if (error instanceof BaseError) {
                res.status(error.statusCode).send(error.message);
            } else {
                res.status(500).send("Erro inesperado");
            }
        }
    }

    public checkCommentLikeStatus = async (req: Request, res: Response): Promise<void> => {
        try {
            const token = req.cookies.lctkn as string;
            const input = {
                comment_id: req.body.comment_id,
                token
            }
            const output = await this.likesBusiness.checkCommentLikeStatus(input);
            res.status(200).send(output);
        } catch (error) {
            if (error instanceof ZodError) {
                res.status(400).send(error.issues[0].message);
            } else if (error instanceof BaseError) {
                res.status(error.statusCode).send(error.message);
            } else {
                res.status(500).send("Erro inesperado");
            }
        }
    }
}