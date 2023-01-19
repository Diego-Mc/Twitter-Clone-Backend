import express from 'express'
import {
  getUser,
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
router.get('/:userId', /*verifyToken,*/ getUser)
router.get('/:userId/followers', verifyToken, getUserFollowers)
router.get('/:userId/followings', verifyToken, getUserFollowings)
router.get('/:userId/random-to-follow', getRandomToFollow)

/* UPDATE */
//TODO: not only verify token, but also verify token===user
router.patch('/:userId/:userToFollowId', verifyToken, toggleFollow)

export default router
