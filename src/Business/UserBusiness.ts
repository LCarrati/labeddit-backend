import { UserDatabase } from "../Database/UserDatabase";
import { AlreadyExistsError } from "../Errors/AlreadyExistsError";
import { TokenPayload, User } from "../Models/UserModel";
import { HashManager } from "../Services/HashManager";
import { IdGenerator } from "../Services/IdGenerator";
import { TokenManager } from "../Services/TokenManager";
import { CreateUserInputDTO, CreateUserOutputDTO } from "../dtos/createUser.dto";


export class UserBusiness {
    constructor(
      private userDatabase: UserDatabase,
      private idGenerator: IdGenerator,
      private tokenManager: TokenManager,
      private hashManager: HashManager
    ) {}
  
    // regras para cadastrar um usuário
    public createUser = async (
      input: CreateUserInputDTO
    ): Promise<CreateUserOutputDTO> => {
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
  
      //modelagem do objeto (payload)
      const tokenPayload: TokenPayload = {
        user_id: newUser.getId(),
        user_nickname: newUser.getNickname(),
        user_role: newUser.getRole(),
      };
  
      // criação do token string a partir do payload
      const token = this.tokenManager.createToken(tokenPayload);
  
      const output: CreateUserOutputDTO = {
        message: "Usuário registrado com sucesso",
        token
      };
  
      return output;
    };
}