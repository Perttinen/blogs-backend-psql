const Blog = require('./blog')
const User = require('./user')
const Readinglist = require('./readinglist')

Blog.belongsTo(User)
User.hasMany(Blog)

User.belongsToMany(Blog, { through: Readinglist, as: 'readings' })
Blog.belongsToMany(User, { through: Readinglist, as: 'usersMarked' })

module.exports = {
  Blog, User, Readinglist
}