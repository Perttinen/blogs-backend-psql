const router = require('express').Router()

const User = require('../models/user')
const Session = require('../models/session')
const { authorizer } = require('../util/middleware')

router.delete('/', authorizer, async (req,res) => {
  const user = await User.findByPk(req.decodedToken.id)
  await Session.destroy({
    where: {user_id: user.id }
  })
  res.status(204).send('logged out')
})

module.exports = router