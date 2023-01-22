import express from 'express'
import bodyParser from 'body-parser'
import mongoose from 'mongoose'
import cors from 'cors'
import * as dotenv from 'dotenv'
import helmet from 'helmet'
import morgan from 'morgan'
import path from 'path'
import { fileURLToPath } from 'url'
import authRoutes from './routes/auth.js'
import userRoutes from './routes/users.js'
import postRoutes from './routes/posts.js'
import tagsRoutes from './routes/tags.js'
import cookieParser from 'cookie-parser'

/* CONFIG */
const __filepath = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filepath)
dotenv.config()
const app = express()
app.use(express.json())
app.use(helmet())
app.use(helmet.crossOriginResourcePolicy({ policy: 'cross-origin' }))
app.use(
  helmet.contentSecurityPolicy({
    useDefaults: true,
    directives: {
      'img-src': ["'self'", 'https: data:'],
    },
  })
)
app.use(morgan('common'))
app.use(bodyParser.json({ limit: '30mb', extended: true }))
app.use(bodyParser.urlencoded({ limit: '30mb', extended: true }))
//TODO: setup cors for dist
app.use(cookieParser())
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.resolve(__dirname, 'public')))
} else {
  app.use(cors({ credentials: true, origin: true }))
}
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
app.use('/api/tags', tagsRoutes)

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
