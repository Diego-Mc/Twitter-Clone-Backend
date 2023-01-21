import User from '../models/User.js'

//TODO: add removal of users

/* READ */
export const getUsers = async (req, res) => {
  try {
    const users = await User.find({})
    res.status(200).json(users)
  } catch (err) {
    res.status(404).json({ error: err.message })
  }
}

export const getUser = async (req, res) => {
  try {
    const { userId } = req.params
    const user = await User.findById(userId)
    res.status(200).json(user)
  } catch (err) {
    res.status(404).json({ error: err.message })
  }
}

export const getLoggedInUser = async (req, res) => {
  try {
    const { userId } = req
    const user = await User.findById(userId)
    res.status(200).json(user)
  } catch (err) {
    res.status(404).json({ error: err.message })
  }
}

export const getRandomToFollow = async (req, res) => {
  try {
    const { userId } = req.params
    const usersToFollow = await User.find({
      $and: [{ _id: { $ne: userId } }, { followers: { $nin: userId } }],
    }).limit(3)
    res.status(200).json(usersToFollow)
  } catch (err) {
    res.status(404).json({ error: err.message })
  }
}

export const getUserFollowers = async (req, res) => {
  try {
    const { userId } = req.params
    const user = await User.findById(userId)

    const followers = await Promise.all(
      user.followers.map((id) => User.findById(id))
    )

    const formattedFollowers = followers.map(
      ({ _id, username, fullName, imgUrl, description }) => ({
        _id,
        username,
        fullName,
        imgUrl,
        description,
      })
    )

    res.status(200).json(formattedFollowers)
  } catch (err) {
    res.status(404).json({ error: err.message })
  }
}

export const getUserFollowings = async (req, res) => {
  try {
    const { userId } = req.params
    const user = await User.findById(userId)

    const followings = await Promise.all(
      user.followings.map((id) => User.findById(id))
    )

    const formattedFollowings = followings.map(
      ({ _id, username, fullName, imgUrl, description }) => ({
        _id,
        username,
        fullName,
        imgUrl,
        description,
      })
    )

    res.status(200).json(formattedFollowings)
  } catch (err) {
    res.status(404).json({ error: err.message })
  }
}

/* UPDATE */
export const toggleFollow = async (req, res) => {
  try {
    const { userId, userToFollowId } = req.params
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
      ({ _id, username, fullName, imgUrl, description }) => ({
        _id,
        username,
        fullName,
        imgUrl,
        description,
      })
    )

    res.status(200).json(formattedFollowings)
  } catch (err) {
    res.status(404).json({ error: err.message })
  }
}
