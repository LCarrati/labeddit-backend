import { BadRequestError } from "../Errors/BadRequestError";
import { NotFoundError } from "../Errors/NotFoundError";
import { CommentDB } from "../Models/CommentModel";
import { EditCommentInputDTO } from "../dtos/CommentDtos/editComment.dto";
import { BaseDatabase } from "./BaseDatabase";

export class CommentDatabase extends BaseDatabase {

    public static TABELA_COMMENTS = "comments";

    // find comment by comment_id;
    public async findCommentById(comment_id: string): Promise<CommentDB> {
        try {
            const comment = await CommentDatabase.connection(CommentDatabase.TABELA_COMMENTS).where({ comment_id }).first();
            return comment
        } catch (error) {
            throw new NotFoundError('Comentário não encontrado (ID)')
        }
    }

    // create a comment
    public async createComment(newComment: CommentDB): Promise<void> {
        try {
            await CommentDatabase.connection(CommentDatabase.TABELA_COMMENTS).insert(newComment)
        } catch (error) {
            throw new BadRequestError('Erro criar comentário')
        }
    }

    // edit a comment
    public async editComment(input: EditCommentInputDTO): Promise<void> {
        try {
            const { comment_id, newContent } = input
            await CommentDatabase
                .connection(CommentDatabase.TABELA_COMMENTS)
                .update({
                    content: newContent,
                    updated_at: BaseDatabase.connection.raw("datetime('now', 'localtime')")
                })
                .where({ comment_id })
        } catch (error) {
            throw new BadRequestError('Erro ao editar comentário')
        }
    }

    // delete a comment
    public async deleteComment(comment_id: string): Promise<void> {
        try {
            await CommentDatabase.connection(CommentDatabase.TABELA_COMMENTS).where({ comment_id }).del()
        } catch (error) {
            throw new BadRequestError('Erro ao apagar comentário')
        }
    }

    // get all comments for a post
    public async getAllCommentsFromPost(post_id: string): Promise<CommentDB[]> {
        try {
            const comments = await CommentDatabase.connection(CommentDatabase.TABELA_COMMENTS).where({ post_id })
            return comments
        } catch (error) {
            throw new NotFoundError('Erro buscar comentários')
        }
    }

    public async addLike(comment_id: string): Promise<void> {
        try {
            await BaseDatabase.connection(CommentDatabase.TABELA_COMMENTS).increment('likes').where({ comment_id })
        } catch (error) {
            throw new BadRequestError('Erro ao adicionar like')
        }
    }

    public async addDislike(comment_id: string): Promise<void> {
        try {
            await BaseDatabase.connection(CommentDatabase.TABELA_COMMENTS).increment('dislikes').where({ comment_id })
        } catch (error) {
            throw new BadRequestError('Erro ao adicionar dislike')
        }
    }

    public async removeLike(comment_id: string): Promise<void> {
        try {
            await BaseDatabase.connection(CommentDatabase.TABELA_COMMENTS).decrement('likes').where({ comment_id })
        } catch (error) {
            throw new BadRequestError('Erro ao remover like')
        }
    }

    public async removeDislike(comment_id: string): Promise<void> {
        try {
            await BaseDatabase.connection(CommentDatabase.TABELA_COMMENTS).decrement('dislikes').where({ comment_id })
        } catch (error) {
            throw new BadRequestError('Erro ao remvoer dislike')
        }
    }
}