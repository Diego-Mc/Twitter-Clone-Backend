import User from '../models/User.js'

/* READ */
export const getUser = async (req, res) => {
  try {
    const { id } = req.params
    const user = await User.findById(id)
    res.status(200).json(user)
  } catch (err) {
    res.status(404).json({ error: err.message })
  }
}

export const getUserFollowers = async (req, res) => {
  try {
    const { id } = req.params
    const user = await User.findById(id)

    const followers = await Promise.all(
      user.followers.map((id) => User.findById(id))
    )

    const formattedFollowers = followers.map(
      ({ _id, username, fullName, imgUrl, description }) => {
        _id, username, fullName, imgUrl, description
      }
    )

    res.status(200).json(formattedFollowers)
  } catch (err) {
    res.status(404).json({ error: err.message })
  }
}

export const getUserFollowing = async (req, res) => {
  try {
    const { id } = req.params
    const user = await User.findById(id)

    const followings = await Promise.all(
      user.followings.map((id) => User.findById(id))
    )

    const formattedFollowings = followings.map(
      ({ _id, username, fullName, imgUrl, description }) => {
        _id, username, fullName, imgUrl, description
      }
    )

    res.status(200).json(formattedFollowings)
  } catch (err) {
    res.status(404).json({ error: err.message })
  }
}

/* UPDATE */
export const toggleFollow = async (req, res) => {
  try {
    const { id: userId, userToFollowId } = req.params
    const user = await User.findById(userId)
    const userToFollow = await User.findById(userToFollowId)

    if (user.followings.includes(userToFollowId)) {
      user.followings = user.followings.filter((id) => id !== userToFollowId)
      userToFollow.followers = userToFollow.followers.filter(
        (id) => id !== userId
      )
    } else {
      user.followings.push(userToFollowId)
      userToFollow.followers.push(userId)
    }

    await user.save()
    await userToFollow.save()

    const followings = await Promise.all(
      user.followings.map((id) => User.findById(id))
    )

    const formattedFollowings = followings.map(
      ({ _id, username, fullName, imgUrl, description }) => {
        _id, username, fullName, imgUrl, description
      }
    )

    res.status(200).json(formattedFollowings)
  } catch (err) {
    res.status(404).json({ error: err.message })
  }
}
