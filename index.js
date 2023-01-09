import express from 'express'
import bodyParser from 'body-parser'
import mongoose from 'mongoose'
import cors from 'cors'
import * as dotenv from 'dotenv'
import multer from 'multer'
import helmet from 'helmet'
import morgan from 'morgan'
import path from 'path'
import { fileURLToPath } from 'url'
import authRoutes from './routes/auth.js'
import userRoutes from './routes/users.js'
import postRoutes from './routes/posts.js'
import { createPost } from './controllers/posts.js'
import { register } from './controllers/auth.js'
import { verifyToken } from './middleware/auth.js'
import User from './models/User.js'
import Post from './models/Post.js'
import { users, posts } from './data/index.js'

/* CONFIG */
const __filepath = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filepath)
dotenv.config()
const app = express()
app.use(express.json())
app.use(helmet())
app.use(helmet.crossOriginResourcePolicy({ policy: 'cross-origin' }))
app.use(morgan('common'))
app.use(bodyParser.json({ limit: '30mb', extended: true }))
app.use(bodyParser.urlencoded({ limit: '30mb', extended: true }))
app.use(cors())
app.use('/assets', express.static(path.join(__dirname, 'public/assets')))

/* FILE STORAGE */
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, 'public/assets')
//   },
//   filename: function (req, file, cb) {
//     cb(null, file.originalname)
//   },
// })
// const upload = multer({ storage })

/* ROUTES WITH FILES (file upload middleware) */
// app.post('/auth/register', upload.single('picture'), register)
// app.post('/auth/register', register)

// app.post('/post', verifyToken, upload.single('picture'), createPost)

/* ROUTES */
app.use('/api/auth', authRoutes)
app.use('/api/users', userRoutes)
app.use('/api/posts', postRoutes)

/* MONGOOSE SETUP */
const PORT = process.env.PORT || 6001
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(PORT, () => console.log('Server is live at ' + PORT))

    /* ADD DATA ONLY ONCE */
    // User.insertMany(users)
    // Post.insertMany(posts)
  })
  .catch((err) => console.log('did not connect', err))
