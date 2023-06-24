import { PostDatabase } from "../Database/PostDatabase";
import { AlreadyExistsError } from "../Errors/AlreadyExistsError";
import { BadRequestError } from "../Errors/BadRequestError";
import { NotFoundError } from "../Errors/NotFoundError";
import { Post } from "../Models/PostModel";
import { USER_ROLES } from "../Models/UserModel";
import { IdGenerator } from "../Services/IdGenerator";
import { TokenManager } from "../Services/TokenManager";
import { CreatePostInputDTO, CreatePostOutputDTO } from "../dtos/PostDtos/createPost.dto";
import { DeletePostInputDTO, DeletePostOutputDTO } from "../dtos/PostDtos/deletePost.dto";
import { EditPostInputDTO, EditPostOutputDTO } from "../dtos/PostDtos/editPost.dto";
import { FindPostOutputDTO } from "../dtos/PostDtos/getPost.dto";

export class PostBusiness {
    constructor(
        private postDatabase: PostDatabase,
        private idGenerator: IdGenerator,
        private tokenManager: TokenManager
    ) { }

    public createPost = async (input: CreatePostInputDTO): Promise<CreatePostOutputDTO> => {
        const { token, content } = input;

        const payload = this.tokenManager.getPayload(token)
        if (payload === null) {
            throw new BadRequestError("'token' inválido")
        }

        const post_id = this.idGenerator.generate();
        const postAlreadyExists = await this.postDatabase.findPostById(post_id);
        if (postAlreadyExists) {
            throw new AlreadyExistsError('ID já cadastrado');
        }

        const creator_id = payload.user_id;
        const newPost = new Post(post_id, creator_id, content);
        const newPostDB = {
            post_id: newPost.getId(),
            creator_id: newPost.getCreatorId(),
            content: newPost.getContent(),
            // likes: newPost.getLikes(),
            // dislikes: newPost.getDislikes(),
        };

        await this.postDatabase.createPost(newPostDB);

        const output: CreatePostOutputDTO = {
            message: "Postagem criada com sucesso",
            post_id: newPostDB.post_id,
            content: newPostDB.content,
            created_at: newPost.getCreatedAt(),
            nickname: payload.nickname
        };

        return output;
    };

    public deletePost = async (input: DeletePostInputDTO): Promise<DeletePostOutputDTO> => {

        const { post_id, token } = input

        const payload = this.tokenManager.getPayload(token)
        if (payload === null) {
            throw new BadRequestError("'token' inválido")
        }

        const postToDelete = await this.postDatabase.findPostById(post_id);
        if (!postToDelete) {
            throw new NotFoundError('Postagem não encontrada')
        }

        if (payload.user_role !== USER_ROLES.ADMIN) {
            if (postToDelete.creator_id !== payload.user_id) {
                throw new BadRequestError("Você não tem permissão para deletar essa postagem")
            }
        }

        await this.postDatabase.deletePost(post_id)

        const output = {
            message: "Post deletado com sucesso"
        }

        return output
    }

    public editPost = async (input: EditPostInputDTO): Promise<EditPostOutputDTO> => {
        const { post_id, token, content } = input

        const payload = this.tokenManager.getPayload(token)
        if (payload === null) {
            throw new BadRequestError("'token' inválido")
        }

        const postToEdit = await this.postDatabase.findPostById(post_id);
        if (!postToEdit) {
            throw new NotFoundError('Postagem não encontrada')
        }

        if (payload.user_role !== USER_ROLES.ADMIN) {
            if (postToEdit.creator_id !== payload.user_id) {
                throw new BadRequestError("Você não tem permissão para editar essa postagem")
            }
        }

        await this.postDatabase.editPost(input)

        const output = {
            message: "Post editado com sucesso"
        }

        return output
    }

    public getPostById = async (post_id: string): Promise<FindPostOutputDTO> => {
        const posts = await this.postDatabase.findPostById(post_id);

        if (!posts) {
            throw new NotFoundError
        }

        const output = {
            message: "Post encontrado com sucesso",
            posts
        }

        return output
    }

    public getPostsByCreator = async (creator_id: string): Promise<FindPostOutputDTO> => {
        const posts = await this.postDatabase.findPostsByCreatorId(creator_id);

        if (!posts) {
            throw new NotFoundError
        }

        const output = {
            message: "Post encontrado com sucesso",
            posts
        }

        return output
    }

    public listAllPosts = async (token: string): Promise<FindPostOutputDTO> => {
        const payload = this.tokenManager.getPayload(token)
        if (payload === null) {
            throw new BadRequestError("'token' inválido")
        }

        const posts = await this.postDatabase.findAllPosts()
        if (!posts) {
            throw new NotFoundError
        }

        const output = {
            message: "Post encontrado com sucesso",
            posts
        }

        return output
    }
}