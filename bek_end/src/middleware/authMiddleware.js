function authMiddleware(req, res, next) {
  if (req.session && req.session.userId) {
      next(); 
  } else {
      res.status(401).json({ message: 'Не авторизован' }); 
  }
}

module.exports = authMiddleware;