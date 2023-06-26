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
        await BaseDatabase.connection(LikesDatabase.TABELA_LIKES).insert(like)
    }

    public async addDislike(postId: string, userId: string): Promise<void> {
        const dislike = {
            user_id: userId,
            post_id: postId,
            like: 0
        }
        await BaseDatabase.connection(LikesDatabase.TABELA_LIKES).insert(dislike)
    }

    public async changeLike(post_id: string, user_id: string, like: number): Promise<void> {
        await BaseDatabase
            .connection(LikesDatabase.TABELA_LIKES)
            .where({ post_id }).andWhere({ user_id })
            .update({ like })
    }

    public async remove(post_id: string, user_id: string): Promise<void> {
        await BaseDatabase
            .connection(LikesDatabase.TABELA_LIKES)
            .delete().where({ post_id }).andWhere({ user_id })
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
        await BaseDatabase.connection(LikesDatabase.TABELA_LIKES_COMMENTS).insert(like)
    }

    public async addCommentDislike(comment_id: string, userId: string): Promise<void> {
        const dislike = {
            user_id: userId,
            comment_id: comment_id,
            likes: 0
        }
        await BaseDatabase.connection(LikesDatabase.TABELA_LIKES_COMMENTS).insert(dislike)
    }

    public async removeCommentInteraction(comment_id: string, user_id: string): Promise<void> {
        await BaseDatabase
            .connection(LikesDatabase.TABELA_LIKES_COMMENTS)
            .delete().where({ comment_id }).andWhere({ user_id })
    }

    public async changeCommentLike(comment_id: string, user_id: string, likes: number): Promise<void> {
        await BaseDatabase
            .connection(LikesDatabase.TABELA_LIKES_COMMENTS)
            .where({ comment_id }).andWhere({ user_id })
            .update({ likes })
    }

}