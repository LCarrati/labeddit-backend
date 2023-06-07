import z from "zod"

export interface DeleteUserInputDTO {
    nickname: string,
    token: string
}

export interface DeleteUserOutputDTO {
    message: string,
}

export const deleteUserSchema = z.object({
    nickname: z.string().min(3),
    token: z.string().min(3)
}).transform(data => data as DeleteUserInputDTO)