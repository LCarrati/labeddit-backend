import { Request, Response } from "express";
import { ZodError } from "zod";
import { BaseError } from "../Errors/BaseError";
import { createUserSchema } from "../dtos/createUser.dto";
import { UserBusiness } from "../Business/UserBusiness";

export class UserController {
    constructor(private userBusiness: UserBusiness) { }
  
    public signup = async (req: Request, res: Response): Promise<void> => {
      try {
        const input = createUserSchema.parse({
          nickname: req.body.name,
          email: req.body.email,
          password: req.body.password,
        });
  
        const output = await this.userBusiness.createUser(input);
  
        res.status(201).send(output);
      } catch (error) {
        if (error instanceof ZodError) {
          res.status(400).send(error.issues[0].message);
        } else if (error instanceof BaseError) {
          res.status(error.statusCode).send(error.message);
        } else {
          res.status(500).send("Erro inesperado");
        }
      }
    };
}