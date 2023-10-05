const jwt = require('jsonwebtoken')
const { SECRET } = require('../util/config')
const { Session } = require('../models')

const blogFinder = async (req, res, next) => {
  req.blog = await Blog.findByPk(req.params.id)
  if(!req.blog) throw Error(`There is no blog with id: ${req.params.id}`)
  next()
}


const authorizer = async (req, res, next) => {
  const authorization = req.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    const token = authorization.substring(7)
    const session = await Session.findAll({where: {token}})
    if(session.length === 0){
      return res.status(401).json({error: 'token disabled'})
    }
    req.decodedToken = jwt.verify(token, SECRET)
  }
  else {
    return res.status(401).json({ error: 'missing token' })
  }
  next()
}

module.exports = {
  blogFinder, authorizer
}