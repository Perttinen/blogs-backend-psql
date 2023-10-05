const router = require('express').Router()

const {Readinglist} = require('../models')
const { authorizer } = require('../util/middleware')

router.get('/', async (req, res) => {
  const readinglist = await Readinglist.findAll()
  res.json(readinglist);
})

router.post('/', async (req,res) => {
  const reading = await Readinglist.create(req.body)
  res.json(reading)
})

router.put('/:id', authorizer, async (req,res) => {
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