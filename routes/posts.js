import express from 'express'
import {
  bookmarkPost,
  createPost,
  createReply,
  getFeedPosts,
  getPost,
  getPostReplies,
  likePost,
} from '../controllers/posts.js'
import { verifyToken } from '../middleware/auth.js'

const router = express.Router()

/* CREATE */
router.post('/', verifyToken, createPost)
router.post('/:postId', verifyToken, createReply)

/* READ */
router.get('/', getFeedPosts)
router.get('/:postId', getPost)
router.get('/:postId/replies', getPostReplies)

/* UPDATE */
router.patch('/:postId/like', verifyToken, likePost)
router.patch('/:postId/bookmark', verifyToken, bookmarkPost)

export default router
