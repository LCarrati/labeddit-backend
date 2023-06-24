import { Request, Response } from "express";
import { ZodError } from "zod";
import { BaseError } from "../Errors/BaseError";
import { createUserSchema } from "../dtos/UserDtos/createUser.dto";
import { UserBusiness } from "../Business/UserBusiness";
import { createLoginSchema } from "../dtos/UserDtos/loginUser.dto";
import { editUserSchema } from "../dtos/UserDtos/editUser.dto";
import { findUserSchema } from "../dtos/UserDtos/getUser.dto";
import { deleteUserSchema } from "../dtos/UserDtos/deleteUser.dto";

export class UserController {
    constructor(private userBusiness: UserBusiness) { }

    public signup = async (req: Request, res: Response): Promise<void> => {
        try {
            const input = createUserSchema.parse({
                nickname: req.body.nickname,
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

    public login = async (req: Request, res: Response): Promise<void> => {
        try {
            const input = createLoginSchema.parse({
                email: req.body.email,
                password: req.body.password,
            });
            const output = await this.userBusiness.login(input);

            res.cookie("lctkn", output.token, {
                httpOnly: true,
                maxAge: 1000 * 60 * 60 * 24 * 7,
                secure: true,
                sameSite: "none",
            }).status(200).send(output);

        } catch (error) {
            if (error instanceof ZodError) {
                res.status(400).send(error.issues[0].message);
            } else if (error instanceof BaseError) {
                res.status(error.statusCode).send(error.message);
            } else {
                res.status(500).send("Erro inesperado");
            }
        }
    }

    // edit user email, nickname, user role or password
    public editUser = async (req: Request, res: Response): Promise<void> => {
        try {
            const token = req.cookies.lctkn;
            const input = editUserSchema.parse({
                nickname: req.body.nickname,
                email: req.body.email,
                password: req.body.password,
                user_role: req.body.user_role,
                token
            })
            const output = await this.userBusiness.editUser(input);
            res.status(200).send(output);
        } catch (error) {
            if (error instanceof ZodError) {
                res.status(400).send(error.issues[0].message);
            } else if (error instanceof BaseError) {
                res.status(error.statusCode).send(error.message);
            } else {
                res.status(500).send("Erro inesperado");
            }
        }
    }

    // delete user
    public deleteUser = async (req: Request, res: Response): Promise<void> => {
        try {
            const token = req.cookies.lctkn;
            const input = deleteUserSchema.parse({
                nickname: req.body.nickname,
                token
            })
            const output = await this.userBusiness.deleteUser(input);
            res.status(200).send(output);
        } catch (error) {
            if (error instanceof ZodError) {
                res.status(400).send(error.issues[0].message);
            } else if (error instanceof BaseError) {
                res.status(error.statusCode).send(error.message);
            } else {
                res.status(500).send("Erro inesperado");
            }
        }
    }

    // get user 
    public findUser = async (req: Request, res: Response): Promise<void> => {
        try {
            const token = req.cookies.lctkn;
            const input = findUserSchema.parse({
                id: req.body.id,
                email: req.body.email,
                nickname: req.body.nickname,
                token
            })
            const output = await this.userBusiness.findUser(input);
            res.status(200).send(output);
        } catch (error) {
            if (error instanceof ZodError) {
                res.status(400).send(error.issues[0].message);
            } else if (error instanceof BaseError) {
                res.status(error.statusCode).send(error.message);
            } else {
                res.status(500).send("Erro inesperado");
            }
        }
    }

    // list all users
    public listAllUsers = async (req: Request, res: Response): Promise<void> => {
        try {
            const token = req.cookies.lctkn as string;
            const output = await this.userBusiness.listAllUsers(token);
            res.status(200).send(output);
        } catch (error) {
            if (error instanceof ZodError) {
                res.status(400).send(error.issues[0].message);
            } else if (error instanceof BaseError) {
                res.status(error.statusCode).send(error.message);
            } else {
                res.status(500).send("Erro inesperado");
            }
        }
    }

    public logout = async (req: Request, res: Response): Promise<void> => {
        // res.clearCookie("lctkn"); não funcionou
        res.cookie("lctkn", "", {
            httpOnly: true,
            maxAge: 1,
            secure: true,
            sameSite: "none",
        })
        res.sendStatus(204)
        // res.send('logout')
    }
}