const router = require('express').Router()

const { Blog, BlogUser } = require('../models')

const jwt = require('jsonwebtoken')
const { SECRET } = require('../util/config')

const blogFinder = async (req, res, next) => {
  req.blog = await Blog.findByPk(req.params.id)
  if(!req.blog) throw Error(`There is no blog with id: ${req.params.id}`)
  next()
}

const tokenExtractor = (req, res, next) => {
  const authorization = req.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
      console.log(authorization.substring(7))
      req.decodedToken = jwt.verify(authorization.substring(7), SECRET)
  } else {
    return res.status(401).json({ error: 'missing token' })
  }
  next()
}

router.get('/', async (req, res) => {
  const blogs = await Blog.findAll(
    {
    attributes:{
      exclude: ['blogUserId']},
      include: {
        model: BlogUser,
        attributes: ['name']
      }
  }
  )
  res.json(blogs)
})

router.post('/',tokenExtractor, async (req, res) => {
    const user = await BlogUser.findByPk(req.decodedToken.id)
    const blog = await Blog.create({...req.body, blogUserId: user.id, date: new Date()})
    res.json(blog)
})

router.get('/:id',blogFinder, async (req, res) => {
  res.json(req.blog)
})

router.delete('/:id', blogFinder, tokenExtractor, async (req, res) => {
  const blog = await Blog.findByPk(req.params.id)
  if(req.decodedToken.id === blog.blogUserId){
    await req.blog.destroy()
    res.status(204).end()
  }else {
    return res.status(401).json({ error: 'token missing' })
  }
})

router.put('/:id',blogFinder, async (req, res) => {
  req.blog.likes = req.body.likes
  await req.blog.save()
  res.json(req.blog)
})

module.exports = router