import express from  'express'
import cors from "cors"

import postRoutes from './modules/posts/post.routes'
import authRoutes from './modules/auth/auth.routes'
import commentRoutes from './modules/comments/comments.routes'
import leaderboardRoutes from './modules/leaderboard/leaderboard.routes'
import userRoutes from './modules/users/users.routes'


const app = express()

app.use(cors())
app.use(express.json())

app.use("/api/auth",authRoutes)
app.use("/api/posts",postRoutes)
app.use("/api/posts/:postId/comments",commentRoutes)
app.use("/api/user",userRoutes)
app.use("/api/posts/:postId/leaderboard",leaderboardRoutes)


export default app