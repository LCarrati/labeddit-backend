
export interface PostDB {
    post_id:string,
    creator_id:string,
    content:string,
    likes?:number,
    dislikes?:number,
    comments?:number,
    created_at?:string,
    updated_at?:string
}
// export interface PostDB {
//     creator_Id: string,
//     content: string
// }

export class Post {
  constructor(
    private id: string,
    private creator_Id: string,
    private content: string,
    private likes: number = 0,
    private dislikes: number = 0,
    private created_at?: string
  ) {}

    public getId() {
        return this.id
    }

    public getCreatorId() {
        return this.creator_Id
    }

    public setCreatorId(creatorId: string): void {
        this.creator_Id = creatorId
    }

    public getContent() {
        return this.content
    }

    public setContent(content: string): void {
        this.content = content
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
