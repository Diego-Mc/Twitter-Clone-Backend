import mongoose from 'mongoose'

const postSchema = mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    repliedTo: String, //postId
    composerUsername: {
      type: String,
      required: true,
    },
    composerFullName: {
      type: String,
      required: true,
    },
    composerImgUrl: String,
    text: {
      type: String,
      required: true,
      min: 1,
      max: 280,
    },
    imgUrl: String,
    likes: {
      type: Map, //no Set support so map: {userId: true, userId2: true}
      of: Boolean,
      default: {},
    },
    replies: {
      type: Array,
      default: [],
    },
  },
  { timestamps: true }
)

const Post = mongoose.model('Post', postSchema)

export default Post
