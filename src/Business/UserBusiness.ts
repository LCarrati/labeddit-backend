import { UserDatabase } from "../Database/UserDatabase";
import { AlreadyExistsError } from "../Errors/AlreadyExistsError";
import { BadRequestError } from "../Errors/BadRequestError";
import { NotFoundError } from "../Errors/NotFoundError";
import { USER_ROLES, User, UserDB } from "../Models/UserModel";
import { HashManager } from "../Services/HashManager";
import { IdGenerator } from "../Services/IdGenerator";
import { TokenManager, TokenPayload } from "../Services/TokenManager";
import { CreateUserInputDTO, CreateUserOutputDTO } from "../dtos/UserDtos/createUser.dto";
import { DeleteUserInputDTO, DeleteUserOutputDTO } from "../dtos/UserDtos/deleteUser.dto";
import { EditUserInputDTO, EditUserOutputDTO } from "../dtos/UserDtos/editUser.dto";
import { FindUserInputDTO, FindUserOutputDTO } from "../dtos/UserDtos/getUser.dto";
import { LoginUserInputDTO, LoginUserOutputDTO } from "../dtos/UserDtos/loginUser.dto";


export class UserBusiness {
    constructor(
        private userDatabase: UserDatabase,
        private idGenerator: IdGenerator,
        private tokenManager: TokenManager,
        private hashManager: HashManager
    ) { }

    // regras para cadastrar um usuário
    public createUser = async (input: CreateUserInputDTO): Promise<CreateUserOutputDTO> => {
        //ver a tipagem desse input e da saída da função (output)

        const { nickname, email, password } = input;

        const id = this.idGenerator.generate();

        const userIdAlreadyExists = await this.userDatabase.findUserById(id);
        if (userIdAlreadyExists) {
            throw new AlreadyExistsError('ID já existe');
        }
        const userEmailAlreadyExists = await this.userDatabase.findUserByEmail(email);
        if (userEmailAlreadyExists) {
            throw new AlreadyExistsError('Email já cadastrado');
        }
        const userNicknameAlreadyExists = await this.userDatabase.findUserByNickname(nickname);
        if (userNicknameAlreadyExists) {
            throw new AlreadyExistsError('Apelido já cadastrado');
        }

        const hashedPassword = await this.hashManager.hash(password)

        const newUser = new User(id, nickname, email, hashedPassword);
        const newUserDB = {
            user_id: newUser.getId(),
            nickname: newUser.getNickname(),
            email: newUser.getEmail(),
            password: newUser.getPassword(),
            role: newUser.getRole(),
        };

        await this.userDatabase.createUser(newUserDB);

        const output: CreateUserOutputDTO = {
            message: "Usuário registrado com sucesso",
        };

        return output;
    };

    public login = async (input: LoginUserInputDTO): Promise<LoginUserOutputDTO> => {
        const { email, password } = input;
        const userExists: UserDB = await this.userDatabase.findUserByEmail(email);
        if (!userExists) {
            throw new NotFoundError("Usuário não encontrado (email)");
        }
        const user = new User(
            userExists.user_id,
            userExists.nickname,
            userExists.email,
            userExists.password,
            userExists.role
        );

        const hashedPassword = user.getPassword()
        const isPasswordCorrect = await this.hashManager.compare(password, hashedPassword)
        if (!isPasswordCorrect) {
            throw new NotFoundError("Senha incorreta");
        }

        const payload: TokenPayload = {
            user_id: user.getId(),
            nickname: user.getNickname(),
            user_role: user.getRole()
        }

        const token = this.tokenManager.createToken(payload)


        const output: LoginUserOutputDTO = {
            message: "Login realizado com sucesso",
            token,
            nickname: user.getNickname(),
            role: payload.user_role
        };

        return output;
    }

    // edit user
    public editUser = async (input: EditUserInputDTO): Promise<EditUserOutputDTO> => {
        const { nickname, newnickname, email, password, role, token } = input;

        if (token === undefined) {
            throw new BadRequestError("É necessário um token")
        }

        const payload = this.tokenManager.getPayload(token)
        if (payload === null) {
            throw new BadRequestError("'token' inválido")
        }

        const userExist = await this.userDatabase.findUserByNickname(nickname)
        if (!userExist) {
            throw new NotFoundError("Usuário não encontrado")
        }
        const user = new User (
            userExist.user_id, 
            userExist.nickname, 
            userExist.email, 
            userExist.password, 
            userExist.role
        )

        // se o usuário logado não for admin, verificar se é o próprio usuário que está tentando alterar
        if (payload.user_role !== USER_ROLES.ADMIN) {
            if (user.getId() !== payload.user_id) {
                throw new BadRequestError("Você só pode alterar o seu próprio cadastro")
            }
        }

        if (newnickname) {
            user.setNickname(newnickname)
        }

        if(password){
            const hashedPassword = await this.hashManager.hash(password)
            user.setPassword(hashedPassword)
        }

        if(role){
            user.setRole(role)
        }

        if(email){
            user.setEmail(email)
        }

        const userDB = {
            user_id: user.getId(),
            nickname: user.getNickname(),
            email: user.getEmail(),
            password: user.getPassword(),
            role: user.getRole(),
        }

        await this.userDatabase.editUser(userDB)

        const output = {
            message: "Usuário alterado com sucesso",
        }

        return output
    }

    // delete an user
    public deleteUser = async (input: DeleteUserInputDTO): Promise<DeleteUserOutputDTO> => {
        const { nickname, token } = input
        if (!nickname || !token) {
            throw new BadRequestError("É necessário um nickname e um token")
        }

        const userExist = await this.userDatabase.findUserByNickname(nickname)
        if (!userExist) {
            throw new NotFoundError("Usuário não encontrado")
        }

        const payload = this.tokenManager.getPayload(token)
        if (payload === null) {
            throw new BadRequestError("'token' inválido")
        }

        const user = new User (
            userExist.user_id, 
            userExist.nickname, 
            userExist.email, 
            userExist.password, 
            userExist.role
        )

        // se o usuário logado não for admin, verificar se é o próprio usuário que está tentando alterar
        if (payload.user_role !== USER_ROLES.ADMIN) {
            if (user.getId() !== payload.user_id) {
                throw new BadRequestError("Você só pode deletar o seu próprio cadastro")
            }
        }

        await this.userDatabase.deleteUser(user.getId())

        const output = {
            message: "Usuário deletado com sucesso",
        }
        return output
    }

    // find user
    public findUser = async (input: FindUserInputDTO): Promise<FindUserOutputDTO> => {
        const { id, nickname, email, token } = input

        const payload = this.tokenManager.getPayload(token)
        if (payload === null) {
            throw new BadRequestError("'token' inválido")
        }

        if (id) {
            const userExist = await this.userDatabase.findUserById(id)
            if (!userExist) {
                throw new NotFoundError("Usuário não encontrado")
            }
            return userExist
        }
        else if (nickname) {
            const userExist = await this.userDatabase.findUserByNickname(nickname)
            if (!userExist) {
                throw new NotFoundError("Usuário não encontrado")
            }
            return userExist
        }
        else if (email) {
            const userExist = await this.userDatabase.findUserByEmail(email)
            if (!userExist) {
                throw new NotFoundError("Usuário não encontrado")
            }
            return userExist
        } else {
            throw new BadRequestError("É necessário um id, nickname ou email")
        }
    }

    // list all users
    public listAllUsers = async (token: string): Promise<FindUserOutputDTO[]> => {
        const payload = this.tokenManager.getPayload(token)
        if (payload === null) {
            throw new BadRequestError("'token' inválido")
        }
        if (payload.user_role === USER_ROLES.ADMIN) {
            const users = await this.userDatabase.findAllUsers()
            return users
        } else {
            throw new BadRequestError("Somente admins podem listar todos os usuários")
        }
    }
}