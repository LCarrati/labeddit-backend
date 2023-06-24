import { CommentDatabase } from "../Database/CommentDatabase";
import { PostDatabase } from "../Database/PostDatabase";
import { UserDatabase } from "../Database/UserDatabase";
import { AlreadyExistsError } from "../Errors/AlreadyExistsError";
import { BadRequestError } from "../Errors/BadRequestError";
import { NotFoundError } from "../Errors/NotFoundError";
import { Comment } from "../Models/CommentModel";
import { USER_ROLES } from "../Models/UserModel";
import { IdGenerator } from "../Services/IdGenerator";
import { TokenManager } from "../Services/TokenManager";
import { CreateCommentOutputDTO } from "../dtos/CommentDtos/createComment.dto";
import { CreateCommentInputDTO } from "../dtos/CommentDtos/createComment.dto";
import { DeleteCommentInputDTO, DeleteCommentOutputDTO } from "../dtos/CommentDtos/deleteComment.dto";
import { EditCommentInputDTO, EditCommentOutputDTO } from "../dtos/CommentDtos/editComment.dto";
import { FindCommentInputDTO, FindCommentOutputDTO, GetAllCommentsInputDTO, GetAllCommentsOutputDTO } from "../dtos/CommentDtos/getComment.dto";

export class CommentBusiness {
    constructor(
        private commentDatabase: CommentDatabase,
        private userDatabase: UserDatabase,
        private postDatabase: PostDatabase,
        private idGenerator: IdGenerator,
        private tokenManager: TokenManager
    ) { }

    // create a comment
    public async addComment(input: CreateCommentInputDTO): Promise<CreateCommentOutputDTO> {
        const { token, comment, post_id } = input;

        const payload = this.tokenManager.getPayload(token)
        if (payload === null) {
            throw new BadRequestError("'token' inválido")
        }

        const comment_id = this.idGenerator.generate();
        const idAlreadyExists = await this.commentDatabase.findCommentById(comment_id);
        if (idAlreadyExists) {
            throw new AlreadyExistsError('Comment ID já cadastrada');
        }

        const creator_id = payload.user_id;
        const newComment = new Comment(comment_id, post_id, creator_id, comment);
        const newCommentDB = {
            comment_id: newComment.getId(),
            post_id: newComment.getPostId(),
            creator_id: newComment.getCreatorId(),
            comment: newComment.getComment(),
            likes: newComment.getLikes(),
            dislikes: newComment.getDislikes(),
        };
        await this.commentDatabase.createComment(newCommentDB);
        await this.postDatabase.addCommentCount(post_id);

        // const output: any = {
        const output: CreateCommentOutputDTO = {
            message: "Comentário criado com sucesso",
            comment_id: newCommentDB.comment_id,
            post_id: newCommentDB.post_id,
            comment: newCommentDB.comment,
            created_at: newComment.getCreatedAt(),
            nickname: payload.nickname
        };

        return output;
    }

    // edit a comment
    public async editComment(input: EditCommentInputDTO): Promise<EditCommentOutputDTO> {
        const { token, comment_id, newContent } = input;

        const payload = this.tokenManager.getPayload(token)
        if (payload === null) {
            throw new BadRequestError("'token' inválido")
        }

        const comment = await this.commentDatabase.findCommentById(comment_id);
        if (!comment) {
            throw new NotFoundError('Comentário não encontrado');
        }

        if (payload.user_role !== USER_ROLES.ADMIN) {
            if (comment.creator_id !== payload.user_id) {
                throw new BadRequestError("Você não tem permissão para editar este comentário");
            }
        }

        await this.commentDatabase.editComment(input);

        const output = {
            message: "Post editado com sucesso"
        }

        return output
    }

    // delete a comment
    public async deleteComment(input: DeleteCommentInputDTO): Promise<DeleteCommentOutputDTO> {
        const { token, comment_id, post_id } = input;

        const payload = this.tokenManager.getPayload(token)
        if (payload === null) {
            throw new BadRequestError("'token' inválido")
        }

        const comment = await this.commentDatabase.findCommentById(comment_id);
        if (!comment) {
            throw new NotFoundError('Comentário não encontrado');
        }

        if (payload.user_role !== USER_ROLES.ADMIN) {
            if (comment.creator_id !== payload.user_id) {
                throw new BadRequestError("Você não tem permissão para deletar este comentário");
            }
        }

        await this.commentDatabase.deleteComment(comment_id);
        await this.postDatabase.removeCommentCount(post_id);

        const output = {
            message: "Comentário deletado com sucesso"
        }

        return output
    }

    // find a comment by ID
    public async getCommentById(input: FindCommentInputDTO): Promise<FindCommentOutputDTO> {
        const { token, comment_id } = input;

        const payload = this.tokenManager.getPayload(token)
        if (payload === null) {
            throw new BadRequestError("'token' inválido")
        }

        const comment = await this.commentDatabase.findCommentById(comment_id);
        if (!comment) {
            throw new NotFoundError('Comentário não encontrado');
        }

        const creator = await this.userDatabase.findUserById(comment.creator_id);
        const creatorNickname = creator.nickname;

        const output = {
            message: "Comentário encontrado com sucesso",
            post_id: comment.post_id,
            comment: comment.comment,
            likes: comment.likes,
            dislikes: comment.dislikes,
            created_at: comment.created_at,
            nickname: creatorNickname
        }

        return output
    }

    // get all coments for a post
    public async getAllCommentsFromPost(input: GetAllCommentsInputDTO): Promise<GetAllCommentsOutputDTO[]> {
        const { token, post_id } = input;

        const payload = this.tokenManager.getPayload(token)
        if (payload === null) {
            throw new BadRequestError("'token' inválido")
        }

        const post = await this.postDatabase.findPostById(post_id);
        if (!post) {
            throw new NotFoundError('Post não encontrado');
        }

        // isso vai retornar um array de comment_id, preciso pegar várias informaões no return do DB
        const comments = await this.commentDatabase.getAllCommentsFromPost(post_id);

        const commentsOutput = comments.map(async comment => {
            const creator = await this.userDatabase.findUserById(comment.creator_id);
            const creatorNickname = creator.nickname;
            return {
                post_id: comment.post_id,
                comment_id: comment.comment_id,
                comment: comment.comment,
                likes: comment.likes,
                dislikes: comment.dislikes,
                created_at: comment.created_at,
                updated_at: comment.updated_at,
                nickname: creatorNickname
            }
        })

        return Promise.all(commentsOutput);
    }
}