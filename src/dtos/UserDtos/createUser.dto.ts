import z from "zod"
import { USER_ROLES } from "../../Models/UserModel"

export interface CreateUserInputDTO {
    nickname: string,
    email: string,
    password: string,
    role?: USER_ROLES
}

export interface CreateUserOutputDTO {
    message: string,
}

export const createUserSchema = z.object({
    nickname: z.string().min(3),
    email: z.string().email(),
    password: z.string().min(3),
    role: z.nativeEnum(USER_ROLES).optional()
}).transform(data => data as CreateUserInputDTO)