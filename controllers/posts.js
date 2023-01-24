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
    const savedPost = await newPost.save()
    await _addPostToTags(newPost)

    res.status(201).json(savedPost)
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
    res.status(201).json(newPost)
  } catch (err) {
    res.status(409).json({ error: err.message })
  }
}

/* READ */
export const getFeedPosts = async (req, res) => {
  try {
    const filterBy = req.query
    const criteria = []
    if (filterBy) {
      if (filterBy.search) {
        criteria.push({ text: { $regex: filterBy.search, $options: 'i' } })
      }
      if (filterBy.user) {
        let userCriteria = { userId: filterBy.user }
        if (filterBy.filter === 'tweets')
          userCriteria.repliedTo = { $exists: 0 }
        if (filterBy.filter === 'replies') {
        }
        if (filterBy.filter === 'media') userCriteria.imgUrl = { $ne: '' }
        if (filterBy.filter === 'likes') {
          userCriteria = { [`likes.${filterBy.user}`]: { $exists: 1 } }
        }
        criteria.push(userCriteria)
      }
    }
    let combinedCriteria = {}
    if (criteria.length === 1) combinedCriteria = criteria[0]
    if (criteria.length >= 2) combinedCriteria.$and = [...criteria]

    const posts = await Post.find(combinedCriteria)
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
    const { userId } = req
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
    const { userId } = req
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
