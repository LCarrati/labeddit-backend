import { BadRequestError } from "../Errors/BadRequestError";
import { NotFoundError } from "../Errors/NotFoundError";
import { UserDB } from "../Models/UserModel";
import { BaseDatabase } from "./BaseDatabase";

export class UserDatabase extends BaseDatabase {

    public static TABELA_USUARIOS = "users";

    // conect to UserDatabase and create a new user
    public async createUser(newUser: UserDB): Promise<void> {
        try {
            await UserDatabase.connection(UserDatabase.TABELA_USUARIOS).insert(newUser)
        } catch (error) {
            throw new BadRequestError
        }
    }

    // conect to UserDatabase and search by id
    public async findUserById(user_id: string): Promise<UserDB> {
        try {
            const user: UserDB = await UserDatabase.connection(UserDatabase.TABELA_USUARIOS).where({ user_id }).first()
            return user
        } catch (error) {
            throw new NotFoundError('Usuário não encontrado (ID)')
        }
    }

    // connect to UserDatabase and search by email
    public async findUserByEmail(email: string): Promise<UserDB> {
        try {
            const user: UserDB = await UserDatabase.connection(UserDatabase.TABELA_USUARIOS).where({ email }).first()
            return user
        } catch (error) {
            throw new NotFoundError('Usuário não encontrado (Email)')
        }
    }

    // connect to UserDatabase and search by nickname
    public async findUserByNickname(nickname: string): Promise<UserDB> {
        try {
            const user = await UserDatabase.connection(UserDatabase.TABELA_USUARIOS).where({ nickname }).first()
            return user
        } catch (error) {
            throw new NotFoundError('Usuário não encontrado (Apelido)')
        }
    }

    // update/edit user data
    public async editUser(user: UserDB): Promise<void> {
        try {
            await UserDatabase.connection(UserDatabase.TABELA_USUARIOS).update(user).where({ user_id: user.user_id })
        } catch (error) {
            throw new NotFoundError('Usuário não encontrado (ID)')
        }
    }

    // delete user
    public async deleteUser(user_id: string): Promise<void> {
        try {
            await UserDatabase.connection(UserDatabase.TABELA_USUARIOS).delete().where({ user_id })
        } catch (error) {
            throw new NotFoundError('Usuário não encontrado (ID)')
        }

    }

    // find all users
    public async findAllUsers(): Promise<UserDB[]> {
        try {
            const users = await UserDatabase.connection(UserDatabase.TABELA_USUARIOS)
            return users
        } catch (error) {
            throw new NotFoundError('Usuários não encontrados')
        }
    }
}