import mongoose from 'mongoose'

const postSchema = mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    isRepost: Boolean,
    repliedTo: String, //postId
    composerId: {
      type: String,
      required: true,
    },
    text: {
      type: String,
      required: true,
      min: 1,
      max: 280,
    },
    likes: {
      type: Map, //no Set support so map: {userId: true, userId2: true}
      of: Boolean,
    },
    comments: {
      type: Map, //no Set support so map: {postId: true, postId2: true}
      of: Boolean,
    },
    reposts: {
      type: Map, //no Set support so map: {postId: true, postId2: true}
      of: Boolean,
    },
  },
  { timestamps: true }
)

const Post = mongoose.model('Post', postSchema)

export default Post
