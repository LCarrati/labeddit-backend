import z from "zod"
import { USER_ROLES } from "../../Models/UserModel"

export interface EditUserInputDTO {
    nickname: string,
    newnickname?: string,
    email?: string,
    password?: string,
    role?: USER_ROLES,
    token: string
}

export interface EditUserOutputDTO {
    message: string,
}

export const editUserSchema = z.object({
    nickname: z.string().min(3),
    newnickname: z.string().min(3),
    email: z.string().email().optional(),
    password: z.string().min(3).optional(),
    role: z.nativeEnum(USER_ROLES).optional(),
    token: z.string().min(3)
}).transform(data => data as EditUserInputDTO)