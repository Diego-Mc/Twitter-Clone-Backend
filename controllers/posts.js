import Post from '../models/Post.js'
import User from '../models/User.js'

/* CREATE */
export const createPost = async (req, res) => {
  try {
    const { userId, description, picturePath } = req.body
    const composer = await User.findById(composerId)
    const newPost = new Post({
      userId,
      firstName: composer.firstName,
      lastName: composer.lastName,
      description,
      userPicturePath: composer.picturePath,
      picturePath,
      likes: {},
      comments: [],
    })
    await newPost.save()

    const posts = await Post.find()
    res.status(201).json(posts)
  } catch (err) {
    res.status(409).json({ error: err.message })
  }
}

//API:
//createPost
//createComment

//getFeedPosts
//getUserPosts
//getUserPostsAndComments
//getUserLikedPosts
//getUserBookmarkedPosts

//likePost
//repost
//bookmark

//removePost (if no comments remove from DB, if comments remove data (front shows "user removed his post"))

/* READ */
export const getFeedPosts = async (req, res) => {
  try {
    const posts = await Post.find()
    res.status(200).json(posts)
  } catch (err) {
    res.status(404).json({ error: err.message })
  }
}

export const getUserPosts = async (req, res) => {
  try {
    const { userId } = req.params
    const posts = await Post.find({ userId })
    res.status(200).json(posts)
  } catch (err) {
    res.status(404).json({ error: err.message })
  }
}

/* UPDATE */
export const likePost = async (req, res) => {
  try {
    const { id } = req.params
    const { userId } = req.body
    const post = await Post.findById(id)
    const isLiked = post.likes.get(userId)

    if (isLiked) post.likes.delete(userId)
    else post.likes.set(userId, true)

    const updatedPost = await Post.findByIdAndUpdate(
      id,
      { likes: post.likes },
      { new: true }
    )

    res.status(200).json(updatedPost)
  } catch (err) {
    res.status(404).json({ error: err.message })
  }
}
