import { BadRequestError } from "../Errors/BadRequestError";
import { NotFoundError } from "../Errors/NotFoundError";
import { LikeDislikeCommentDB, LikeDislikeDB } from "../Models/LikesModel";
import { BaseDatabase } from "./BaseDatabase";

export class LikesDatabase extends BaseDatabase {
    public static TABELA_LIKES = 'likes_dislikes'
    public static TABELA_LIKES_COMMENTS = 'comment_likes_dislikes'

    public async findInteraction(post_id: string, user_id: string): Promise<LikeDislikeDB[]> {
        const interactionExists = await BaseDatabase
            .connection(LikesDatabase.TABELA_LIKES)
            .where({ post_id }).andWhere({ user_id })

        if (!interactionExists) {
            throw new NotFoundError
        }

        return interactionExists
    }

    public async addLike(postId: string, userId: string): Promise<void> {
        const like = {
            user_id: userId,
            post_id: postId,
            like: 1
        }
        try {
            await BaseDatabase.connection(LikesDatabase.TABELA_LIKES).insert(like)
        } catch (error) {
            throw new BadRequestError('Erro ao adicionar like')
        }
    }

    public async addDislike(postId: string, userId: string): Promise<void> {
        const dislike = {
            user_id: userId,
            post_id: postId,
            like: 0
        }
        try {
            await BaseDatabase.connection(LikesDatabase.TABELA_LIKES).insert(dislike)
        } catch (error) {
            throw new BadRequestError('Erro ao adicionar dislike')
        }
    }

    public async changeLike(post_id: string, user_id: string, like: number): Promise<void> {
        try {
            await BaseDatabase
                .connection(LikesDatabase.TABELA_LIKES)
                .where({ post_id }).andWhere({ user_id })
                .update({ like })
        } catch (error) {
            throw new BadRequestError('Erro ao modificar like')
        }
    }

    public async remove(post_id: string, user_id: string): Promise<void> {
        try {
            await BaseDatabase
                .connection(LikesDatabase.TABELA_LIKES)
                .delete().where({ post_id }).andWhere({ user_id })
        } catch (error) {
            throw new BadRequestError('Erro ao remover like')
        }
    }

    public async findCommentsInteraction(comment_id: string, user_id: string): Promise<LikeDislikeCommentDB[]> {
        const interactionExists = await BaseDatabase
            .connection(LikesDatabase.TABELA_LIKES_COMMENTS)
            .where({ comment_id }).andWhere({ user_id })

        if (!interactionExists) {
            throw new NotFoundError
        }
        return interactionExists
    }
    public async addCommentLike(comment_id: string, userId: string): Promise<void> {
        const like = {
            user_id: userId,
            comment_id: comment_id,
            likes: 1
        }
        try {
            await BaseDatabase.connection(LikesDatabase.TABELA_LIKES_COMMENTS).insert(like)
        } catch (error) {
            throw new BadRequestError('Erro ao adicionar like')
        }
    }

    public async addCommentDislike(comment_id: string, userId: string): Promise<void> {
        const dislike = {
            user_id: userId,
            comment_id: comment_id,
            likes: 0
        }
        try {
            await BaseDatabase.connection(LikesDatabase.TABELA_LIKES_COMMENTS).insert(dislike)
        } catch (error) {
            throw new BadRequestError('Erro ao adicionar dislike')
        }
    }

    public async removeCommentInteraction(comment_id: string, user_id: string): Promise<void> {
        try {
            await BaseDatabase
                .connection(LikesDatabase.TABELA_LIKES_COMMENTS)
                .delete().where({ comment_id }).andWhere({ user_id })
        } catch (error) {
            throw new BadRequestError('Erro ao remover interação')
        }
    }

    public async changeCommentLike(comment_id: string, user_id: string, likes: number): Promise<void> {
        try {
            await BaseDatabase
                .connection(LikesDatabase.TABELA_LIKES_COMMENTS)
                .where({ comment_id }).andWhere({ user_id })
                .update({ likes })
        } catch (error) {
            throw new BadRequestError('Erro ao atualizar likes')
        }
    }

}