import { Request, Response } from "express";
import { ZodError } from "zod";
import { BaseError } from "../Errors/BaseError";
import { createCommentSchema } from "../dtos/CommentDtos/createComment.dto";
import { editCommentSchema } from "../dtos/CommentDtos/editComment.dto";
import { deleteCommentSchema } from "../dtos/CommentDtos/deleteComment.dto";
import { findCommentSchema, getAllCommentsSchema } from "../dtos/CommentDtos/getComment.dto";
import { CommentBusiness } from "../Business/CommentBusiness";

export class CommentController {
    constructor(private commentBusiness: CommentBusiness) { }

    // create a comment
    public addComment = async (req: Request, res: Response): Promise<void> => {
        try {
            const token = req.cookies.lctkn;

            const input = createCommentSchema.parse({
                token,
                comment: req.body.content,
                post_id: req.body.post_id
            });


            const output = await this.commentBusiness.addComment(input);

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

    // edit a comment
    public editComment = async (req: Request, res: Response): Promise<void> => {
        try {
            const token = req.cookies.lctkn;
            const input = editCommentSchema.parse({
                comment_id: req.body.comment_id,
                token,
                newContent: req.body.newContent
            })
            const output = await this.commentBusiness.editComment(input);

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

    // delete a comment
    public deleteComment = async (req: Request, res: Response): Promise<void> => {
        try {
            const token = req.cookies.lctkn;
            const input = deleteCommentSchema.parse({
                comment_id: req.body.comment_id,
                post_id: req.body.post_id,
                token
            })
            const output = await this.commentBusiness.deleteComment(input);

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

    // get a comment by comment_id
    public getCommentById = async (req: Request, res: Response): Promise<void> => {
        try {
            const token = req.cookies.lctkn;
            const input = findCommentSchema.parse({
                comment_id: req.body.comment_id,
                token
            })
            const output = await this.commentBusiness.getCommentById(input);

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

    // get all comments from a post
    public getAllCommentsFromPost = async (req: Request, res: Response): Promise<void> => {
        try {
            const token = req.cookies.lctkn;
            const input = getAllCommentsSchema.parse({
                post_id: req.params.post_id,
                token
            })
            const output = await this.commentBusiness.getAllCommentsFromPost(input);

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