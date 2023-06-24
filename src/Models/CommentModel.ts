
export interface CommentDB {
    comment_id:string,
    post_id:string,
    creator_id:string,
    comment:string,
    likes:number,
    dislikes:number,
    created_at?:string,
    updated_at?:string
}

export class Comment {
  constructor(
    private comment_id: string,
    private post_id: string,
    private creator_Id: string,
    private comment: string,
    private likes: number = 0,
    private dislikes: number = 0,
    private created_at?: string,
    private updated_at?: string
  ) {}

    public getId() {
        return this.comment_id
    }

    public getPostId() {
        return this.post_id
    }

    public getCreatorId() {
        return this.creator_Id
    }

    public setCreatorId(creatorId: string): void {
        this.creator_Id = creatorId
    }

    public getComment() {
        return this.comment
    }

    public setComment(content: string): void {
        this.comment = content
    }

    public getLikes() {
        return this.likes
    }

    public addLike() {
        this.likes++
    }

    public removeLike() {
        this.likes--
    }

    public getDislikes() {
        return this.dislikes
    }

    public addDislike() {
        this.dislikes++
    }

    public removeDislike() {
        this.dislikes--
    }

    public getCreatedAt() {
        return this.created_at
    }

}