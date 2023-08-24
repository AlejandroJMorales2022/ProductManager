/* function isAuth(req, res, next) {
  const autenticado =!!req.isAuthenticated
  console.log('estado de autenticacion'+ autenticado )
  if (autenticado) {
    next()
    return
  }

  res.redirect('/login')
}

module.exports = isAuth */
function isAuth(req, res, next) {
  if (req.user) {
    next()
    return
  }

  res.redirect('/login')
}

module.exports = isAuth