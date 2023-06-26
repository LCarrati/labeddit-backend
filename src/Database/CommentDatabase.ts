import { BadRequestError } from "../Errors/BadRequestError";
import { NotFoundError } from "../Errors/NotFoundError";
import { CommentDB } from "../Models/CommentModel";
import { EditCommentInputDTO } from "../dtos/CommentDtos/editComment.dto";
import { BaseDatabase } from "./BaseDatabase";

export class CommentDatabase extends BaseDatabase {

    public static TABELA_COMMENTS = "comments";

    // find comment by comment_id;
    public async findCommentById(comment_id: string): Promise<CommentDB> {
        const comment = await CommentDatabase.connection(CommentDatabase.TABELA_COMMENTS).where({ comment_id }).first();
        return comment
    }

    // create a comment
    public async createComment(newComment: CommentDB): Promise<void> {
        await CommentDatabase.connection(CommentDatabase.TABELA_COMMENTS).insert(newComment)
    }

    // edit a comment
    public async editComment(input: EditCommentInputDTO): Promise<void> {
        const { comment_id, newContent } = input
        await CommentDatabase
            .connection(CommentDatabase.TABELA_COMMENTS)
            .update({
                comment: newContent,
                updated_at: BaseDatabase.connection.raw("datetime('now', 'localtime')")
            })
            .where({ comment_id })
    }

    // delete a comment
    public async deleteComment(comment_id: string): Promise<void> {
        await CommentDatabase.connection(CommentDatabase.TABELA_COMMENTS).where({ comment_id }).del()
    }

    // get all comments for a post
    public async getAllCommentsFromPost(post_id: string): Promise<CommentDB[]> {
        const comments = await CommentDatabase.connection(CommentDatabase.TABELA_COMMENTS).where({ post_id })
        return comments
    }

    public async addLike(comment_id: string): Promise<void> {
        await BaseDatabase.connection(CommentDatabase.TABELA_COMMENTS).increment('likes').where({ comment_id })
    }

    public async addDislike(comment_id: string): Promise<void> {
        await BaseDatabase.connection(CommentDatabase.TABELA_COMMENTS).increment('dislikes').where({ comment_id })
    }

    public async removeLike(comment_id: string): Promise<void> {
        await BaseDatabase.connection(CommentDatabase.TABELA_COMMENTS).decrement('likes').where({ comment_id })
    }

    public async removeDislike(comment_id: string): Promise<void> {
        await BaseDatabase.connection(CommentDatabase.TABELA_COMMENTS).decrement('dislikes').where({ comment_id })
    }
}