import { Request, Response } from "express";
import { ZodError } from "zod";
import { BaseError } from "../Errors/BaseError";
import { createPostSchema } from "../dtos/PostDtos/createPost.dto";
import { PostBusiness } from "../Business/PostBusiness";
import { deletePostSchema } from "../dtos/PostDtos/deletePost.dto";
import { editPostSchema } from "../dtos/PostDtos/editPost.dto";
import { BadRequestError } from "../Errors/BadRequestError";
import { findPostSchema } from "../dtos/PostDtos/getPost.dto";

export class PostController {
	constructor(private postBusiness: PostBusiness) { }

    public createPost = async (req: Request, res: Response): Promise<void> => {
		try {
            const token = req.cookies.lctkn;
			const input = createPostSchema.parse({
				token,
				content: req.body.content
			});

			const output = await this.postBusiness.createPost(input);

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
	};

	public deletePost = async (req: Request, res: Response): Promise<void> => {
		try {
            const token = req.cookies.lctkn;
			const input = deletePostSchema.parse({
               post_id: req.body.post_id,
               token
            })
			const output = await this.postBusiness.deletePost(input);

			res.status(201).send(output);
		} catch (error) {
			if (error instanceof ZodError) {
				res.status(400).send(error.issues[0].message);
			} else if (error instanceof BaseError) {
				res.status(error.statusCode).send(error.message);
			} else {
				res.status(500).send("Erro inesperado");
			}
		}
	};

	public editPost = async (req: Request, res: Response): Promise<void> => {
		try {
            const token = req.cookies.lctkn;
			const input = editPostSchema.parse({
               post_id: req.body.post_id,
               content: req.body.content,
               token
            })

			const output = await this.postBusiness.editPost(input);

			res.status(201).send(output);
			
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

	public findPosts = async (req: Request, res: Response): Promise<void> => {
		try {
            const token = req.cookies.lctkn;
            const input = findPostSchema.parse({
                post_id: req.body.id,
                creator_id: req.body.creatorId,
                token
            })

            //get post by id
			if (input.post_id) {
				const output = await this.postBusiness.getPostById(input.post_id)
				res.status(201).send(output);
			//get posts by creatorId
			} else if (input.creator_id) {
				const output = await this.postBusiness.getPostByCreator(input.creator_id)
				res.status(201).send(output);
			} else {
				//get all posts
				// const output = await this.postBusiness.getAllPosts()
				// res.status(201).send(output);
                throw new BadRequestError("Informe ID do post ou do usuário")
			}
			
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

    public listAllPosts = async (req: Request, res: Response): Promise<void> => {
        try {
            const token = req.cookies.lctkn as string;
            const output = await this.postBusiness.listAllPosts(token);
            res.status(201).send(output);
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