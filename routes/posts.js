import express from 'express'
import {
  bookmarkPost,
  createPost,
  createReply,
  getFeedPosts,
  getPostReplies,
  getTagPosts,
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
router.get('/:postId/replies', getPostReplies)
router.get('/tag/:tagName', getTagPosts)

/* UPDATE */
router.patch('/:postId/like', verifyToken, likePost)
router.patch('/:postId/bookmark', verifyToken, bookmarkPost)

export default router
