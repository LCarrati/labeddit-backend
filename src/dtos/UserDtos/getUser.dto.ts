import z from "zod"
import { USER_ROLES } from "../../Models/UserModel"

export interface FindUserInputDTO {
    id?: string,
    nickname?: string,
    email?: string,
    token: string
}

export interface FindUserOutputDTO {
    user_id: string,
    nickname: string,
    email: string,
    password: string,
    role: USER_ROLES
}

export const findUserSchema = z.object({
    id: z.string().min(3).optional(),
    nickname: z.string().min(3).optional(),
    email: z.string().email().optional(),
    token: z.string().min(3)
}).transform(data => data as FindUserInputDTO)