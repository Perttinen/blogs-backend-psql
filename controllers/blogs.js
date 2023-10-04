const router = require('express').Router()
const { Op } = require('sequelize')

const { Blog, User } = require('../models')

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
  let where = {}

  if (req.query.search) {
    where = {
      [Op.or] : [
        { title: { [Op.iLike]: '%' + req.query.search + '%' } },
        { author: { [Op.iLike]: '%' + req.query.search + '%' } },
      ]
    }
  }

  const blogs = await Blog.findAll(
    {
    attributes:{
      exclude: ['userId']},
      include: {
        model: User,
        attributes: ['name']
      },
      order: [
        ['likes', 'DESC']
      ],
      where
  }
  )
  res.json(blogs)
})

router.post('/',tokenExtractor, async (req, res) => {
    const user = await User.findByPk(req.decodedToken.id)
    console.log(user.id);
    console.log({...req.body, userId: user.id});
    const blog = await Blog.create({...req.body ,userId: user.id})
    res.json(blog)
})

router.get('/:id',blogFinder, async (req, res) => {
  res.json(req.blog)
})

router.delete('/:id', blogFinder, tokenExtractor, async (req, res) => {
  const blog = await Blog.findByPk(req.params.id)
  if(req.decodedToken.id === blog.userId){
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