import express from 'express'
import {
  getUser,
  getUserFollowing,
  getUserFollowers,
  toggleFollow,
  getUsers,
} from '../controllers/users.js'
import { verifyToken } from '../middleware/auth.js'

const router = express.Router()

/* READ */
router.get('/', getUsers) //TODO: remove in prod
router.get('/:userId', verifyToken, getUser)
router.get('/:userId/followers', verifyToken, getUserFollowers)
router.get('/:userId/following', verifyToken, getUserFollowing)

/* UPDATE */
//TODO: not only verify token, but also verify token===user
router.patch('/:userId/:userToFollowId', verifyToken, toggleFollow)

export default router
