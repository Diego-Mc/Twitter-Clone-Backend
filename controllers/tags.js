import Post from '../models/Post.js'
import Tag from '../models/Tag.js'

export const getTagPosts = async (req, res) => {
  try {
    const { tagName } = req.params
    const tag = await Tag.findOne({ tagName })
    const MAX_RESULTS = 6
    const postsIds = Array.from(tag.posts.keys()).slice(0, MAX_RESULTS)
    const postsPrms = postsIds.map((post) => Post.findOne({ _id: post }))
    const posts = await Promise.all(postsPrms)
    res.status(200).json(posts)
  } catch (err) {
    res.status(404).json({ error: err.message })
  }
}

export const getTrends = async (req, res) => {
  try {
    const trends = await Tag.aggregate([
      {
        $project: {
          tagName: 1,
          posts: 1,
          size: { $size: { $objectToArray: '$posts' } },
        },
      },
      { $sort: { size: -1 } },
      { $limit: 6 },
    ])
    res.status(200).json(trends)
  } catch (err) {
    res.status(404).json({ error: err.message })
  }
}
