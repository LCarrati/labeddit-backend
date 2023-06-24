import z from "zod"

export interface LoginUserInputDTO {
    email: string,
    password: string,
}

export interface LoginUserOutputDTO {
    message: string,
    token: string,
    nickname: string,
    role: string,
}

export const createLoginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(3),
}).transform(data => data as LoginUserInputDTO)
