const router = require('express').Router()

const { User, Blog, Readinglist } = require('../models')

router.get('/', async (req, res) => {
  const users = await User.findAll(
    {
    include: {
      model: Blog,
      attributes: {exclude: ['userId']}
    }
  }
  )
  res.json(users)
})

router.post('/', async (req, res) => {
  try{
    const user = await User.create(req.body)
    res.json(user)
  }catch(e){
    return res.status(400).json({e})
  }
})

router.get('/:id', async (req, res) => {
  let where = {}

  if(req.query.read){
    where = {read: req.query.read}
  }

  const user = await User.findByPk(req.params.id, { 
    attributes: { exclude: ['id', 'createdAt', 'updatedAt'] } ,
    include:[{
      model: Blog,
      as: 'readings',
      attributes: { exclude: ['userId']},
      through: {
        model: Readinglist,
        as: 'readinglists',
        attributes: ['read', 'id'],
        where
      },
    }],
  })
    res.json(user)
})

router.put('/:username', async (req,res) => {
  const user = await User.findOne({where: {username: req.params.username}})
  if (user) {
    user.username = req.body.username
    await user.save()
    res.json(user)
  } else {
    res.status(404).end()
  }
})

router.delete('/:id', async (req,res) => {
  const user = await User.findByPk(req.params.id)
  await user.destroy()
  res.status(204).end()
})

module.exports = router