import mongoose from 'mongoose'

const UserSchema = new mongoose.Schema(
  {
    username: {
      //@handle
      type: String,
      required: true,
      min: 2,
      max: 20,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      max: 50,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      min: 5,
    },
    fullName: {
      type: String,
      required: true,
      min: 2,
      max: 50,
    },
    description: {
      type: String,
      min: 2,
      max: 140,
    },
    imgUrl: {
      type: String,
      default: '',
    },
    coverUrl: {
      type: String,
      default: '',
    },
    followers: {
      type: Array,
      default: [],
    },
    followings: {
      type: Array,
      default: [],
    },
    bookmarks: {
      type: Array,
      default: [],
    },
    likes: {
      type: Array,
      default: [],
    },
    replies: {
      type: Array,
      default: [],
    },
    posts: {
      type: Array,
      default: [],
    },
  },
  { timestamps: true }
)

const User = mongoose.model('User', UserSchema)
export default User
