import Post from '../models/Post.js'
import User from '../models/User.js'
import Tag from '../models/Tag.js'
import { utilService } from '../services/util.service.js'

//API:
//createPost
//createReply

//getFeedPosts
//getUserPosts
//getUserPostsAndReplies
//getUserLikedPosts
//getUserBookmarkedPosts
//getPostReplies
//getTagFeed

//likePost
//bookmark

//removePost (if no replies remove from DB, if replies remove data (front shows "user removed his post"))

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
    await _addPostToTags(newPost)

    const posts = await Post.find({})
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
    await _addPostToTags(newPost)

    let post = await Post.findById(postId)
    post.replies.push(newPost._id.toString())
    post = await post.save()
    res.status(201).json(post)
  } catch (err) {
    res.status(409).json({ error: err.message })
  }
}

/* READ */
export const getFeedPosts = async (req, res) => {
  try {
    const filterBy = req.query
    console.log('query', req.query)
    const criteria = {}
    if (filterBy) {
      console.log('filter', filterBy)
      if (filterBy.search)
        criteria.text = { $regex: filterBy.search, $options: 'i' }
    }
    const posts = await Post.find(criteria)
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

export const getUserMediaPosts = async (req, res) => {
  try {
    const { userId } = req.params
    const posts = await Post.find({ userId, imgUrl: { $exists: true } })
    res.status(200).json(posts)
  } catch (err) {
    res.status(404).json({ error: err.message })
  }
}

export const getUserLikedPosts = async (req, res) => {
  try {
    const { userId } = req.params
    const query = `likes.${userId}`
    const posts = await Post.find({ [query]: { $exists: true } })
    res.status(200).json(posts)
  } catch (err) {
    res.status(404).json({ error: err.message })
  }
}

export const getPost = async (req, res) => {
  try {
    const { postId } = req.params
    const post = await Post.findById(postId)
    res.status(200).json(post)
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

    if (bookmarkIdx > -1) user.bookmarks.splice(bookmarkIdx, 1)
    else user.bookmarks.push(postId)

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { bookmarks: user.bookmarks },
      { new: true }
    )

    res.status(200).json(updatedUser)
  } catch (err) {
    res.status(404).json({ error: err.message })
  }
}

/* UTILS: */
function _addPostToTags(post) {
  try {
    const postTags = utilService.getHashtags(post.text)

    const updateTagsPrms = postTags.map(async (tagName) => {
      let tag = await Tag.findOne({ tagName })

      if (!tag) {
        tag = new Tag({ tagName })
        await tag.save()
      }

      const postId = post._id.toString()
      const isTagged = tag.posts?.get(postId)

      if (isTagged) tag.posts.delete(postId)
      else tag.posts.set(postId, true)

      return await tag.save()
    })

    return Promise.all(updateTagsPrms)
  } catch (err) {
    throw err
  }
}
