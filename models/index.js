const Blog = require('./blog')
const User = require('./user')
const Readinglist = require('./readinglist')
const Session = require('./session')

Blog.belongsTo(User)
User.hasMany(Blog)

Session.belongsTo(User)
User.hasMany(Session)


User.belongsToMany(Blog, { through: Readinglist, as: 'readings' })
Blog.belongsToMany(User, { through: Readinglist, as: 'usersMarked' })

module.exports = {
  Blog, User, Readinglist, Session
}