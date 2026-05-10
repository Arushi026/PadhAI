import jwt from 'jsonwebtoken'

const authenticate = (req, res, next) => {
  try {
    // get token from header
    const token = req.headers.authorization?.split(' ')[1]

    if (!token) {
      return res.status(401).json({ message: 'No token — please login first' })
    }

    // verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = decoded
    next()

  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token' })
  }
}

export default authenticate