import mongoose from 'mongoose'

const tagSchema = mongoose.Schema(
  {
    tagName: {
      type: String,
      required: true,
      unique: true,
    },
    posts: {
      type: Map, //no Set support so map: {postId: true, postId2: true}
      of: Boolean,
    },
  },
  { timestamps: true }
)

const Tag = mongoose.model('Tag', tagSchema)

export default Tag
