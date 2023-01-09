import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import User from '../models/User.js'

/* REGISTER USER */
export const register = async (req, res) => {
  try {
    const {
      username,
      email,
      password,
      fullName,
      description,
      imgUrl,
      coverUrl,
      followers,
      following,
      bookmarks,
    } = req.body

    const salt = await bcrypt.genSalt()
    const passwordHash = await bcrypt.hash(password, salt)

    const newUser = new User({
      username,
      email,
      password: passwordHash,
      fullName,
      description,
      imgUrl,
      coverUrl,
      followers,
      following,
      bookmarks,
    })
    const savedUser = await newUser.save()
    res.status(201).json(savedUser)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

/* LOGGING IN */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body
    let user = await User.findOne({ email })
    if (!user) {
      user = await User.findOne({ username: email })
      if (!user) return res.status(400).json({ msg: 'User does not exist.' })
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials.' })

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)
    user.password = undefined
    res.status(200).json({ token, user })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}
