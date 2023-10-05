const router = require('express').Router()
const { Op } = require('sequelize')

const { Blog, User } = require('../models')
const { authorizer, blogFinder } = require('../util/middleware')

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

router.post('/',authorizer, async (req, res) => {
    const user = await User.findByPk(req.decodedToken.id)
    const blog = await Blog.create({...req.body ,userId: user.id})
    res.json(blog)
})

router.get('/:id',blogFinder, async (req, res) => {
  res.json(req.blog)
})

router.delete('/:id', blogFinder, authorizer, async (req, res) => {
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