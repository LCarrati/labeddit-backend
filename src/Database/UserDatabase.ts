import { BadRequestError } from "../Errors/BadRequestError";
import { NotFoundError } from "../Errors/NotFoundError";
import { UserDB } from "../Models/UserModel";
import { BaseDatabase } from "./BaseDatabase";

export class UserDatabase extends BaseDatabase {

    public static TABELA_USUARIOS = "users";

    // conect to UserDatabase and create a new user
    public async createUser(newUser: UserDB): Promise<void> {
        await UserDatabase.connection(UserDatabase.TABELA_USUARIOS).insert(newUser)
    }

    // conect to UserDatabase and search by id
    public async findUserById(user_id: string): Promise<UserDB> {
        const user: UserDB = await UserDatabase.connection(UserDatabase.TABELA_USUARIOS).where({ user_id }).first()
        return user
    }

    // connect to UserDatabase and search by email
    public async findUserByEmail(email: string): Promise<UserDB> {
        const user: UserDB = await UserDatabase.connection(UserDatabase.TABELA_USUARIOS).where({ email }).first()
        return user
    }

    // connect to UserDatabase and search by nickname
    public async findUserByNickname(nickname: string): Promise<UserDB> {
        const user = await UserDatabase.connection(UserDatabase.TABELA_USUARIOS).where({ nickname }).first()
        return user
    }

    // update/edit user data
    public async editUser(user: UserDB): Promise<void> {
        await UserDatabase.connection(UserDatabase.TABELA_USUARIOS).update(user).where({ user_id: user.user_id })
    }

    // delete user
    public async deleteUser(user_id: string): Promise<void> {
        await UserDatabase.connection(UserDatabase.TABELA_USUARIOS).delete().where({ user_id })
    }

    // find all users
    public async findAllUsers(): Promise<UserDB[]> {
        const users = await UserDatabase.connection(UserDatabase.TABELA_USUARIOS)
        return users
    }
}