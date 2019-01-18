module.exports = (req, res, next) => {
  if (req.url.includes('tags') || req.url.includes('posts')) {
    req.query.isDeleted = 'false'
  }
  next()
}
