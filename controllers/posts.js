import Post from '../models/Post.js'
import User from '../models/User.js'

/* CREATE */
export const createPost = async (req, res) => {
  try {
    const { composerId, text, imgUrl } = req.body
    const composer = await User.findById(composerId)
    const newPost = new Post({
      userId: composerId,
      composerUsername: composer.username,
      composerFullName: composer.fullName,
      text,
      composerImgUrl: composer.imgUrl,
      imgUrl,
      likes: {},
      replies: [],
    })
    await newPost.save()

    const posts = await Post.find()
    res.status(201).json(posts)
  } catch (err) {
    res.status(409).json({ error: err.message })
  }
}

export const createReply = async (req, res) => {
  try {
    const { composerId, text, imgUrl } = req.body
    const { postId } = req.params
    const composer = await User.findById(composerId)
    let newPost = new Post({
      userId: composerId,
      repliedTo: postId,
      composerUsername: composer.username,
      composerFullName: composer.fullName,
      text,
      composerImgUrl: composer.imgUrl,
      imgUrl,
      likes: {},
      replies: [],
    })
    newPost = await newPost.save()

    const post = await Post.findById(postId)
    post.comments.push(newPost._id)
    await post.save()

    const posts = await Post.find()
    res.status(201).json(posts)
  } catch (err) {
    res.status(409).json({ error: err.message })
  }
}

//API:
//createPost
//createReply

//getFeedPosts
//getUserPosts
//getUserPostsAndReplies
//getUserLikedPosts
//getUserBookmarkedPosts
//getPostReplies (i.e with replies loaded)

//likePost
//bookmark

//removePost (if no replies remove from DB, if replies remove data (front shows "user removed his post"))

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
    const posts = await Post.find({ userId, repliedTo: { $exists: 0 } })
    res.status(200).json(posts)
  } catch (err) {
    res.status(404).json({ error: err.message })
  }
}

export const getUserPostsAndReplies = async (req, res) => {
  try {
    const { userId } = req.params
    const posts = await Post.find({ userId })
    res.status(200).json(posts)
  } catch (err) {
    res.status(404).json({ error: err.message })
  }
}

export const getUserLikedPosts = async (req, res) => {
  try {
    const { userId } = req.params
    const posts = await Post.find({ likes: { userId } })
    res.status(200).json(posts)
  } catch (err) {
    res.status(404).json({ error: err.message })
  }
}

export const getUserBookmarkedPosts = async (req, res) => {
  try {
    const { userId } = req.params
    const bookmarks = await Post.findById(userId)
    const posts = await Post.find({ _id: { $in: bookmarks } })
    res.status(200).json(posts)
  } catch (err) {
    res.status(404).json({ error: err.message })
  }
}

export const getPostReplies = async (req, res) => {
  try {
    const { postId } = req.params
    const post = await Post.findById(postId)
    const replies = await Post.find({ _id: { $in: post.replies } })
    res.status(200).json(replies)
  } catch (err) {
    res.status(404).json({ error: err.message })
  }
}

/* UPDATE */
export const likePost = async (req, res) => {
  try {
    const { postId } = req.params
    const { userId } = req.body
    const post = await Post.findById(postId)
    const isLiked = post.likes.get(userId)

    if (isLiked) post.likes.delete(userId)
    else post.likes.set(userId, true)

    const updatedPost = await Post.findByIdAndUpdate(
      postId,
      { likes: post.likes },
      { new: true }
    )

    res.status(200).json(updatedPost)
  } catch (err) {
    res.status(404).json({ error: err.message })
  }
}

export const bookmarkPost = async (req, res) => {
  try {
    const { postId } = req.params
    const { userId } = req.body
    const user = await User.findById(userId)
    const bookmarkIdx = user.bookmarks.indexOf(postId)

    if (bookmarkIdx > -1) res.status(400).json({ error: 'Already bookmarked' })
    else user.bookmarks.push(postId)

    const updatedPost = await Post.findByIdAndUpdate(
      postId,
      { bookmarks: user.bookmarks },
      { new: true }
    )

    res.status(200).json(updatedPost)
  } catch (err) {
    res.status(404).json({ error: err.message })
  }
}
