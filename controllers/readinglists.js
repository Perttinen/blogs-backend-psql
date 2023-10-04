const router = require('express').Router()

const Sequelize = require('sequelize')

const {Readinglist} = require('../models')

router.get('/', async (req, res) => {
  const readinglist = await Readinglist.findAll()
  res.json(readinglist);
})

router.post('/', async (req,res) => {
  const reading = await Readinglist.create(req.body)
  res.json(reading)
})

module.exports = router