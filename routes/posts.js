import express from 'express'
import {
  bookmarkPost,
  createPost,
  createReply,
  getFeedPosts,
  getPost,
  getPostReplies,
  getUserLikedPosts,
  getUserPosts,
  getUserPostsAndReplies,
  likePost,
  getUserMediaPosts,
} from '../controllers/posts.js'
import { verifyToken } from '../middleware/auth.js'

const router = express.Router()

/* CREATE */
router.post('/', verifyToken, createPost)
router.post('/:postId', verifyToken, createReply)

/* READ */
router.get('/', getFeedPosts)
router.get('/profile/:userId', getUserPosts)
router.get('/profile/all/:userId', getUserPostsAndReplies)
router.get('/profile/media/:userId', getUserMediaPosts)
router.get('/profile/likes/:userId', getUserLikedPosts)
router.get('/:postId', getPost)
router.get('/:postId/replies', getPostReplies)

/* UPDATE */
router.patch('/:postId/like', verifyToken, likePost)
router.patch('/:postId/bookmark', verifyToken, bookmarkPost)

export default router
