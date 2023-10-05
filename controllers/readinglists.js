const router = require('express').Router()
const jwt = require('jsonwebtoken')

const { SECRET } = require('../util/config')
const {Readinglist} = require('../models')

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
  const readinglist = await Readinglist.findAll()
  res.json(readinglist);
})

router.post('/', async (req,res) => {
  const reading = await Readinglist.create(req.body)
  res.json(reading)
})

router.put('/:id',tokenExtractor, async (req,res) => {
  const reading = await Readinglist.findByPk(req.params.id)
  if(req.decodedToken.id === reading.userId){
    reading.read = req.body.read
    await reading.save()
    res.json(reading)
  } else {
    res.status(404).end()
  }
})

module.exports = router