import express from 'express'
import {
  getUser,
  getLoggedInUser,
  getUserFollowings,
  getUserFollowers,
  toggleFollow,
  getUsers,
  getRandomToFollow,
} from '../controllers/users.js'
import { verifyToken } from '../middleware/auth.js'

const router = express.Router()

/* READ */
router.get('/', getUsers) //TODO: add filtering
router.get('/logged-in', verifyToken, getLoggedInUser)
router.get('/:userId', getUser)
router.get('/:userId/followers', getUserFollowers)
router.get('/:userId/followings', getUserFollowings)
router.get('/random-to-follow', verifyToken, getRandomToFollow)

/* UPDATE */
//TODO: not only verify token, but also verify token===user
router.patch(':userToFollowId/follow', verifyToken, toggleFollow)

export default router
