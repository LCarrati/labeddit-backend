import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
// import dotenv from 'dotenv'
import userRouter from './Router/userRouter'
import postRouter from './Router/postsRouter'
import { commentRouter } from './Router/commentRouter'
import likeDislikeRouter from './Router/likesRouter'
import cookieParser from 'cookie-parser'

const app = express()
// dotenv.config()

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors({
  origin: 'https://labeddit-frontend-lcarrati.vercel.app', 
  credentials: true, // permite enviar cookies e autenticação
  exposedHeaders: ["set-cookie"],
}));

app.use(express.json())

app.listen(Number(process.env.PORT || 3003), () => {
  console.log(`Servidor rodando na porta ${process.env.PORT}`)
})

app.use(cookieParser());
app.use("/labeddit-backend/users", userRouter);
app.use("/labeddit-backend/posts", postRouter);
app.use("/labeddit-backend/comment", commentRouter);
app.use("/labeddit-backend/likedislike", likeDislikeRouter);