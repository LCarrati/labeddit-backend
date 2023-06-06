import { UserDB } from "../Models/UserModel";
import { BaseDatabase } from "./BaseDatabase";

export class UserDatabase extends BaseDatabase {

    public static TABELA_USUARIOS = "users";

    // conect to UserDatabase and create a new user
    public async createUser(newUser: UserDB) {
        await UserDatabase.connection(UserDatabase.TABELA_USUARIOS).insert(newUser)
    }

    // conect to UserDatabase and search by id
    public async findUserById(id: string) {
        const user = await UserDatabase.connection(UserDatabase.TABELA_USUARIOS).where({ id }).first()
        return user
    }

    // connect to UserDatabase and search by email
    public async findUserByEmail(email: string) {
        const user = await UserDatabase.connection(UserDatabase.TABELA_USUARIOS).where({ email }).first()
        return user
    }

    // connect to UserDatabase and search by nickname
    public async findUserByNickname(nickname: string) {
        const user = await UserDatabase.connection(UserDatabase.TABELA_USUARIOS).where({ nickname }).first()
        return user
    }
}