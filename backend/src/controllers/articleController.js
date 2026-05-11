import Article from '../models/Article.js'

// GET ALL ARTICLES
export const getArticles = async (req, res) => {
  try {
    const { branch, topic } = req.query
    const filter = {}
    if (branch) filter.branch = branch
    if (topic) filter.topic = topic

    const articles = await Article.find(filter)
      .populate('author', 'name email')
      .sort({ createdAt: -1 })

    res.json(articles)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// GET SINGLE ARTICLE
export const getArticle = async (req, res) => {
  try {
    const article = await Article.findById(req.params.id)
      .populate('author', 'name email')

    if (!article) {
      return res.status(404).json({ message: 'Article not found' })
    }

    // increase view count
    article.views += 1
    await article.save()

    res.json(article)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// CREATE ARTICLE (Admin only)
export const createArticle = async (req, res) => {
  try {
    const { title, content, summary, branch, topic, tags } = req.body

    const article = await Article.create({
      title,
      content,
      summary,
      branch,
      topic,
      tags: tags || [],
      author: req.user.id
    })

    res.status(201).json({
      message: 'Article created successfully!',
      article
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// UPDATE ARTICLE (Admin only)
export const updateArticle = async (req, res) => {
  try {
    const article = await Article.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    )

    if (!article) {
      return res.status(404).json({ message: 'Article not found' })
    }

    res.json({ message: 'Article updated!', article })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// DELETE ARTICLE (Admin only)
export const deleteArticle = async (req, res) => {
  try {
    const article = await Article.findByIdAndDelete(req.params.id)

    if (!article) {
      return res.status(404).json({ message: 'Article not found' })
    }

    res.json({ message: 'Article deleted!' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
