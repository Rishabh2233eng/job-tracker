const jwt = require('jsonwebtoken')

const authMiddleware = (req, res, next) => {
  try {
    // 1. Get the token from the request header
    const authHeader = req.headers.authorization

    // 2. Check if header exists and starts with "Bearer "
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided' })
    }

    // 3. Extract the token (remove "Bearer " prefix)
    const token = authHeader.split(' ')[1]

    // 4. Verify the token using our secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    // 5. Attach the userId to the request object
    // Now any route using this middleware can access req.userId
    req.userId = decoded.userId

    // 6. Call next() to move to the actual route handler
    next()

  } catch (error) {
    return res.status(401).json({ error: 'Invalid or expired token' })
  }
}

module.exports = authMiddleware