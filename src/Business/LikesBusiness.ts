import { CommentDatabase } from "../Database/CommentDatabase";
import { LikesDatabase } from "../Database/LikesDatabase";
import { PostDatabase } from "../Database/PostDatabase";
import { UserDatabase } from "../Database/UserDatabase";
import { BadRequestError } from "../Errors/BadRequestError";
import { NotFoundError } from "../Errors/NotFoundError";
import { LikeDislikeCommentDB, LikeDislikeDB } from "../Models/LikesModel";
import { TokenManager } from "../Services/TokenManager";
import { LikeDislikeCommentInputDTO, LikeDislikeCommentOutputDTO, LikeDislikeInputDTO, LikeDislikeOutputDTO } from "../dtos/LikesDtos/likes.dto";

export class LikesBusiness {
    constructor(
        private likesDatabase: LikesDatabase,
        private commentDatabase: CommentDatabase,
        private postDatabase: PostDatabase,
        private userDatabase: UserDatabase,
        private tokenManager: TokenManager) { }

    public likeDislike = async (input: LikeDislikeInputDTO): Promise<LikeDislikeOutputDTO> => {
        const { post_id, likeDislike, token } = input

        const payload = this.tokenManager.getPayload(token)
        if (payload === null) {
            throw new BadRequestError("'token' inválido")
        }
        const user_id = payload.user_id as string

        const post = await this.postDatabase.findPostById(post_id);
        if (!post) {
            throw new NotFoundError('Post não encontrado')
        }

        const user = await this.userDatabase.findUserById(user_id)
        if (!user) {
            throw new NotFoundError('Usuário não encontrado')
        }

        const [interactionExists]: LikeDislikeDB[] = await this.likesDatabase.findInteraction(post_id, user_id)

        // não teve interação
        if (!interactionExists) {
            // usuário deu like
            if (likeDislike === 1) {
                await this.likesDatabase.addLike(post_id, user_id)
                await this.postDatabase.addLike(post_id)
                const likesdislikes = await this.postDatabase.findPostById(post_id)
                const likesdislikeoutput = {
                    likes: likesdislikes.likes,
                    dislikes: likesdislikes.dislikes
                }
                const output = {
                    message: "usuário deu like",
                    likesdislikeoutput
                }
                return output
            }

            // usuário deu dislike
            else if (likeDislike === 0) {
                await this.likesDatabase.addDislike(post_id, user_id)
                await this.postDatabase.addDislike(post_id)
                const likesdislikes = await this.postDatabase.findPostById(post_id)
                const likesdislikeoutput = {
                    likes: likesdislikes.likes,
                    dislikes: likesdislikes.dislikes
                }
                const output = {
                    message: "usuário deu dislike",
                    likesdislikeoutput
                }
                return output
            }

            // valor incorreto para like ou dislike
            else {
                throw new Error("Valor incorreto para like ou dislike")
            }
        }

        // já teve interação 
        else if (interactionExists) {
            const likeStatus: number = interactionExists?.like
            // usuário deu like mas já tinha dado like
            if (likeDislike === 1 && likeStatus === 1) {
                await this.postDatabase.removeLike(post_id)
                await this.likesDatabase.remove(post_id, user_id)
                const likesdislikes = await this.postDatabase.findPostById(post_id)
                const likesdislikeoutput = {
                    likes: likesdislikes.likes,
                    dislikes: likesdislikes.dislikes
                }
                const output = {
                    message: "vc removeu seu like",
                    likesdislikeoutput
                }
                return output
            }
            // usuário deu like mas já tinha dado dislike
            else if (likeDislike === 1 && likeStatus === 0) {
                await this.likesDatabase.changeLike(post_id, user_id, likeDislike)
                await this.postDatabase.addLike(post_id)
                await this.postDatabase.removeDislike(post_id)
                const likesdislikes = await this.postDatabase.findPostById(post_id)
                const likesdislikeoutput = {
                    likes: likesdislikes.likes,
                    dislikes: likesdislikes.dislikes
                }
                const output = {
                    message: "vc trocou dislike por like",
                    likesdislikeoutput
                }
                return output
            }
            // usuário deu dislike mas já tinha dado like
            else if (likeDislike === 0 && likeStatus === 1) {
                await this.likesDatabase.changeLike(post_id, user_id, likeDislike)
                await this.postDatabase.addDislike(post_id)
                await this.postDatabase.removeLike(post_id)
                const likesdislikes = await this.postDatabase.findPostById(post_id)
                const likesdislikeoutput = {
                    likes: likesdislikes.likes,
                    dislikes: likesdislikes.dislikes
                }
                const output = {
                    message: "vc trocou like por dislike",
                    likesdislikeoutput
                }
                return output
            }
            // usuário deu dislike mas já tinha dado dislike
            else {
                await this.postDatabase.removeDislike(post_id)
                await this.likesDatabase.remove(post_id, user_id)
                const likesdislikes = await this.postDatabase.findPostById(post_id)
                const likesdislikeoutput = {
                    likes: likesdislikes.likes,
                    dislikes: likesdislikes.dislikes
                }
                const output = {
                    message: "vc removeu seu dislike",
                    likesdislikeoutput
                }
                return output
            }
        }

        else {
            throw new BadRequestError("Erro ao consultar like/dislike")
        }

    }

    public commentLikeDislike = async (input: LikeDislikeCommentInputDTO): Promise<LikeDislikeCommentOutputDTO> => {
        const { comment_id, likedislike, token } = input

        const payload = this.tokenManager.getPayload(token)
        if (payload === null) {
            throw new BadRequestError("'token' inválido")
        }
        const user_id = payload.user_id as string

        const post = await this.commentDatabase.findCommentById(comment_id);
        if (!post) {
            throw new NotFoundError('Comentário não encontrado')
        }

        const user = await this.userDatabase.findUserById(user_id)
        if (!user) {
            throw new NotFoundError('Usuário não encontrado')
        }

        const [interactionExists]: LikeDislikeCommentDB[] = await this.likesDatabase.findCommentsInteraction(comment_id, user_id)

        // não teve interação
        if (!interactionExists) {
            // usuário deu like
            if (likedislike === 1) {
                // console.log('nao teve interacao, deu like')
                await this.likesDatabase.addCommentLike(comment_id, user_id)
                await this.commentDatabase.addLike(comment_id)
                const likesdislikes = await this.commentDatabase.findCommentById(comment_id)
                const likesdislikeoutput = {
                    likes: likesdislikes.likes,
                    dislikes: likesdislikes.dislikes
                }
                const output = {
                    message: "usuário deu like",
                    likesdislikeoutput
                }
                return output
            }

            // usuário deu dislike
            else if (likedislike === 0) {
                // console.log('nao teve interacao, deu dislike')
                await this.likesDatabase.addCommentDislike(comment_id, user_id)
                await this.commentDatabase.addDislike(comment_id)
                const likesdislikes = await this.commentDatabase.findCommentById(comment_id)
                const likesdislikeoutput = {
                    likes: likesdislikes.likes,
                    dislikes: likesdislikes.dislikes
                }
                const output = {
                    message: "usuário deu dislike",
                    likesdislikeoutput
                }
                return output
            }

            // valor incorreto para like ou dislike
            else {
                throw new Error("Valor incorreto para like ou dislike")
            }
        }

        // já teve interação 
        else if (interactionExists) {
            const likeStatus: number = interactionExists?.likes
            // usuário deu like mas já tinha dado like
            if (likedislike === 1 && likeStatus === 1) {
                // console.log('usuário deu like mas já tinha dado like')
                await this.commentDatabase.removeLike(comment_id)
                await this.likesDatabase.removeCommentInteraction(comment_id, user_id)
                const likesdislikes = await this.commentDatabase.findCommentById(comment_id)
                const likesdislikeoutput = {
                    likes: likesdislikes.likes,
                    dislikes: likesdislikes.dislikes
                }
                const output = {
                    message: "vc removeu seu like",
                    likesdislikeoutput
                }
                return output
            }
            // usuário deu like mas já tinha dado dislike
            else if (likedislike === 1 && likeStatus === 0) {
                // console.log('usuário deu like mas já tinha dado dislike')
                await this.likesDatabase.changeCommentLike(comment_id, user_id, likedislike)
                await this.commentDatabase.addLike(comment_id)
                await this.commentDatabase.removeDislike(comment_id)
                const likesdislikes = await this.commentDatabase.findCommentById(comment_id)
                const likesdislikeoutput = {
                    likes: likesdislikes.likes,
                    dislikes: likesdislikes.dislikes
                }
                const output = {
                    message: "vc trocou dislike por like",
                    likesdislikeoutput
                }
                return output
            }
            // usuário deu dislike mas já tinha dado like
            else if (likedislike === 0 && likeStatus === 1) {
                // console.log('usuário deu dislike mas já tinha dado like')
                await this.likesDatabase.changeCommentLike(comment_id, user_id, likedislike)
                await this.commentDatabase.addDislike(comment_id)
                await this.commentDatabase.removeLike(comment_id)
                const likesdislikes = await this.commentDatabase.findCommentById(comment_id)
                const likesdislikeoutput = {
                    likes: likesdislikes.likes,
                    dislikes: likesdislikes.dislikes
                }
                const output = {
                    message: "vc trocou like por dislike",
                    likesdislikeoutput
                }
                return output
            }
            // usuário deu dislike mas já tinha dado dislike
            else {
                // console.log('usuário deu dislike mas já tinha dado dislike')
                await this.commentDatabase.removeDislike(comment_id)
                await this.likesDatabase.removeCommentInteraction(comment_id, user_id)
                const likesdislikes = await this.commentDatabase.findCommentById(comment_id)
                const likesdislikeoutput = {
                    likes: likesdislikes.likes,
                    dislikes: likesdislikes.dislikes
                }
                const output = {
                    message: "vc removeu seu dislike",
                    likesdislikeoutput
                }
                return output
            }
        }

        else {
            throw new BadRequestError("Erro ao consultar like/dislike")
        }
    }

    public checkLikeStatus = async (input: any) => {
        const { post_id, token } = input

        const payload = this.tokenManager.getPayload(token)
        if (payload === null) {
            throw new BadRequestError("'token' inválido")
        }
        const user_id = payload.user_id as string

        const post = await this.postDatabase.findPostById(post_id);
        if (!post) {
            throw new NotFoundError('Post não encontrado')
        }

        const user = await this.userDatabase.findUserById(user_id)
        if (!user) {
            throw new NotFoundError('Usuário não encontrado')
        }

        const [interactionExists]: LikeDislikeDB[] = await this.likesDatabase.findInteraction(post_id, user_id)

        // não teve interação
        if (!interactionExists) {
            const output = {
                like: 0
            }
            return output
        }

        // já teve interação 
        else if (interactionExists) {
            const likeStatus: number = interactionExists?.like
            // usuário deu like mas já tinha dado like
            if (likeStatus === 1) {
                const output = {
                    like: 1
                }
                return output
            }
            // usuário deu like mas já tinha dado dislike
            else if (likeStatus === 0) {
                const output = {
                    like: -1
                }
                return output
            }

            // usuário deu dislike mas já tinha dado dislike
            else {
                throw new BadRequestError("Erro ao consultar like/dislike")
            }
        }

        else {
            throw new BadRequestError("Erro ao consultar like/dislike")
        }
    }

    public checkCommentLikeStatus = async (input: any) => {
        const { comment_id, token } = input
        const payload = this.tokenManager.getPayload(token)
        if (payload === null) {
            throw new BadRequestError("'token' inválido")
        }
        const user_id = payload.user_id as string

        const comment = await this.commentDatabase.findCommentById(comment_id);
        if (!comment) {
            throw new NotFoundError('Comentário não encontrado')
        }

        const user = await this.userDatabase.findUserById(user_id)
        if (!user) {
            throw new NotFoundError('Usuário não encontrado')
        }

        const [interactionExists]: any[] = await this.likesDatabase.findCommentsInteraction(comment_id, user_id)

        // não teve interação
        if (!interactionExists) {
            const output = {
                like: 0
            }
            return output
        }

        // já teve interação 
        else if (interactionExists) {
            const likeStatus: number = interactionExists?.likes
            // usuário deu like mas já tinha dado like
            if (likeStatus === 1) {
                const output = {
                    like: 1
                }
                return output
            }
            // usuário deu like mas já tinha dado dislike
            else if (likeStatus === 0) {
                const output = {
                    like: -1
                }
                return output
            }

            // usuário deu dislike mas já tinha dado dislike
            else {
                throw new BadRequestError("Erro ao consultar like/dislike")
            }
        }

        else {
            throw new BadRequestError("Erro ao consultar like/dislike")
        }
    }
}