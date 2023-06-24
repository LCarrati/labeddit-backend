import { BadRequestError } from "../Errors/BadRequestError";
import { NotFoundError } from "../Errors/NotFoundError";
import { PostDB } from "../Models/PostModel";
import { EditPostInputDTO } from "../dtos/PostDtos/editPost.dto";
import { BaseDatabase } from "./BaseDatabase";
import { UserDatabase } from "./UserDatabase";

export class PostDatabase extends BaseDatabase {
	public static TABELA_POSTS = "posts";

	public async findPostById(post_id: string): Promise<PostDB> {
		try {
			const [post] = await BaseDatabase.connection(PostDatabase.TABELA_POSTS)
				.where({ post_id })
				.join(UserDatabase.TABELA_USUARIOS, 'users.user_id', '=', 'posts.creator_id')
				.select('posts.post_id', 'posts.creator_id', 'posts.content', 'posts.comments', 'posts.likes', 'posts.dislikes', 'posts.created_at', 'users.nickname');

			return post;
		} catch (error) {
			throw new NotFoundError('Post não encontrado (ID)')
		}
	}

	public async createPost(newPost: PostDB): Promise<void> {
		try {
			await BaseDatabase.connection(PostDatabase.TABELA_POSTS).insert(newPost)
		} catch (error) {
			throw new BadRequestError('Erro ao criar post')
		}
	}

	public async deletePost(post_id: string): Promise<void> {
		try {
			await BaseDatabase.connection(PostDatabase.TABELA_POSTS).where({ post_id }).del()
		} catch (error) {
			throw new NotFoundError('Post não encontrado (ID)')
		}
	}

	public async editPost(input: EditPostInputDTO): Promise<void> {
		try {
			const { post_id, content } = input
			await BaseDatabase
				.connection(PostDatabase.TABELA_POSTS)
				.where({ post_id })
				.update({
					content,
					updated_at: BaseDatabase.connection.raw("datetime('now', 'localtime')")
				})
		} catch (error) {
			throw new NotFoundError('Post não encontrado (ID)')
		}
	}

	public async findPostsByCreatorId(creator_id: string): Promise<PostDB[]> {
		try {
			const posts = await BaseDatabase.connection(
				PostDatabase.TABELA_POSTS)
				.where({ creator_id })
			return posts
		} catch (error) {
			throw new NotFoundError('Posts do usuário não encontrados (ID)')
		}
	}

	public async findAllPosts(): Promise<PostDB[]> {
		try {
			const posts = await BaseDatabase
				.connection(PostDatabase.TABELA_POSTS)
				.join(UserDatabase.TABELA_USUARIOS, 'users.user_id', '=', 'posts.creator_id')
				.select('posts.post_id', 'posts.creator_id', 'posts.content', 'posts.comments', 'posts.likes', 'posts.dislikes', 'posts.created_at', 'users.nickname')
			return posts
		} catch (error) {
			throw new NotFoundError('Posts não encontrados')
		}
	}

	public async addLike(post_id: string): Promise<void> {
		try {
			await BaseDatabase.connection(PostDatabase.TABELA_POSTS).increment('likes').where({ post_id })
		} catch (error) {
			throw new BadRequestError('Erro ao adicionar like')
		}
	}

	public async addDislike(post_id: string): Promise<void> {
		try {
			await BaseDatabase.connection(PostDatabase.TABELA_POSTS).increment('dislikes').where({ post_id })
		} catch (error) {
			throw new BadRequestError('Erro ao adicionar dislike')
		}
	}

	public async removeLike(post_id: string): Promise<void> {
		try {
			await BaseDatabase.connection(PostDatabase.TABELA_POSTS).decrement('likes').where({ post_id })
		} catch (error) {
			throw new BadRequestError('Erro ao remover like')
		}
	}

	public async removeDislike(post_id: string): Promise<void> {
		try {
			await BaseDatabase.connection(PostDatabase.TABELA_POSTS).decrement('dislikes').where({ post_id })
		} catch (error) {
			throw new BadRequestError('Erro ao remover dislike')
		}
	}

	public async addCommentCount(post_id: string): Promise<void> {
		try {
			await BaseDatabase.connection(PostDatabase.TABELA_POSTS).increment('comments').where({ post_id })
		} catch (error) {
			console.log(error)
		}
	}

	public async removeCommentCount(post_id: string): Promise<void> {
		try {
			await BaseDatabase.connection(PostDatabase.TABELA_POSTS).decrement('comments').where({ post_id })
		} catch (error) {
			console.log(error)
		}
	}

}