import { BaseError } from "./BaseError";

export class AlreadyExistsError extends BaseError {
    constructor(
        message: string = "Usuário já cadastrado" // mensagem de erro padrão caso não seja enviado um argumento
    ) {
        super(409, message)
    }
}