const router = require('express').Router()

const { Blog, BlogUser } = require('../models')

const blogFinder = async (req, res, next) => {
  req.blog = await Blog.findByPk(req.params.id)
  if(!req.blog) throw Error(`There is no blog with id: ${req.params.id}`)
  next()
}

router.get('/', async (req, res) => {
  const blogs = await Blog.findAll(
  //   {
  //   attributes:{
  //     exclude: ['userId']},
  //     include: {
  //       model: BlogUser,
  //       attributes: ['name']
  //     }
  // }
  )
  res.json(blogs)
})

router.post('/', async (req, res) => {
    const blog = await Blog.create(req.body)
    res.json(blog)
})

router.get('/:id',blogFinder, async (req, res) => {
  res.json(req.blog)
})

router.delete('/:id',blogFinder, async (req, res) => {
  await req.blog.destroy()
  res.status(204).end()
})

router.put('/:id',blogFinder, async (req, res) => {
  req.blog.likes = req.body.likes
  await req.blog.save()
  res.json(req.blog)
})

module.exports = router