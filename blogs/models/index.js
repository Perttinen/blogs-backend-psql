const Blog = require('./blog')
const BlogUser = require('./blogUser')

BlogUser.hasMany(Blog)
Blog.belongsTo(BlogUser)

Blog.sync({alter: true})
BlogUser.sync({alter: true})

module.exports = {
  Blog, BlogUser
}