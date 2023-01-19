import express from 'express'
import {
  bookmarkPost,
  createPost,
  createReply,
  getFeedPosts,
  getPost,
  getPostReplies,
  getUserBookmarkedPosts,
  getUserLikedPosts,
  getUserPosts,
  getUserPostsAndReplies,
  likePost,
} from '../controllers/posts.js'
import { verifyToken } from '../middleware/auth.js'

const router = express.Router()

/* CREATE */
router.post('/', createPost)
router.post('/:postId', createReply)

/* READ */
router.get('/', getFeedPosts)
router.get('/profile/:userId', getUserPosts)
router.get('/profile/all/:userId', getUserPostsAndReplies)
router.get('/profile/likes/:userId', getUserLikedPosts)
router.get('/profile/bookmarks/:userId', getUserBookmarkedPosts)
router.get('/:postId', getPost)
router.get('/:postId/replies', getPostReplies)

/* UPDATE */
router.patch('/:postId/like', likePost)
router.patch('/:postId/bookmark', bookmarkPost)

export default router
