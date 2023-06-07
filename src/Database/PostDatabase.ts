import { PostDB } from "../Models/PostModel";
import { EditPostInputDTO } from "../dtos/PostDtos/editPost.dto";
import { BaseDatabase } from "./BaseDatabase";
import { UserDatabase } from "./UserDatabase";

export class PostDatabase extends BaseDatabase {
	public static TABELA_POSTS = "posts";

	public async findPostById(post_id: string): Promise<PostDB> {
		const [post] = await BaseDatabase.connection(
			PostDatabase.TABELA_POSTS
		).where({ post_id });

		return post;
	}

	public async createPost(newPost: PostDB): Promise<void> {
		await BaseDatabase.connection(PostDatabase.TABELA_POSTS).insert(newPost)
	}

	public async deletePost(post_id: string): Promise<void> {
		await BaseDatabase.connection(PostDatabase.TABELA_POSTS).where({ post_id }).del()
	}

	public async editPost(input: EditPostInputDTO): Promise<void> {
		const { post_id, content } = input
		await BaseDatabase
		.connection(PostDatabase.TABELA_POSTS)
		.where({ post_id })
		.update({ 
			content, 
			updated_at: BaseDatabase.connection.raw("datetime('now', 'localtime')")
		})
	}

	public async findPostsByCreatorId(creator_id: string): Promise<PostDB[]> {
		const posts = await BaseDatabase.connection(
			PostDatabase.TABELA_POSTS)
			.where({ creator_id })
		return posts
	}

	public async findAllPosts(): Promise<PostDB[]> {
		const posts = await BaseDatabase
		.connection(PostDatabase.TABELA_POSTS)
		// .join(UserDatabase.TABELA_USUARIOS, 'users.user_id', '=', 'posts.creator_id')
		// .select('posts.post_id', 'posts.creator_id', 'posts.content', 'posts.likes', 'posts.dislikes', 'posts.created_at', 'users.nickname')
		return posts
	}

	// public async findCreatorName(postId: string){
	// 	const creatorName = await BaseDatabase
	// 	.connection(PostDatabase.TABELA_POSTS)
	// 	.where('posts.id', '=', postId) 
	// 	.join(UserDatabase.TABELA_USUARIOS, 'users.id', '=', 'posts.creator_id')
	// 	.select('users.name', 'posts.created_at')
	// 	return creatorName
	// }

	public async addLike(post_id: string): Promise<void> {
		await BaseDatabase.connection(PostDatabase.TABELA_POSTS).increment('likes').where({ post_id })
	}

	public async addDislike(post_id: string): Promise<void> {
		await BaseDatabase.connection(PostDatabase.TABELA_POSTS).increment('dislikes').where({ post_id })
	}

	public async removeLike(post_id: string): Promise<void> {
		await BaseDatabase.connection(PostDatabase.TABELA_POSTS).decrement('likes').where({ post_id })
	}

	public async removeDislike(post_id: string): Promise<void> {
		await BaseDatabase.connection(PostDatabase.TABELA_POSTS).decrement('dislikes').where({ post_id })
	}

	public async addCommentCount(post_id: string): Promise<void> {
		await BaseDatabase.connection(PostDatabase.TABELA_POSTS).increment('comment').where({ post_id })
	}

}

