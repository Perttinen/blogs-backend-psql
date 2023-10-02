const express = require('express')
const app = express()

const { PORT } = require('./util/config')
const { connectToDatabase } = require('./util/db')

const blogsRouter = require('./controllers/blogs')

app.use(express.json())

app.use('/api/blogs', blogsRouter)

const start = async () => {
  await connectToDatabase()
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })
}

start()

// require('dotenv').config()
// const { Sequelize, Model, DataTypes, TEXT } = require('sequelize')
// const express = require('express')
// const app = express()

// app.use(express.json())

// const sequelize = new Sequelize(process.env.DATABASE_URL)

// class Blog extends Model {}

// Blog.init({
//   id: {
//     type: DataTypes.INTEGER,
//     primaryKey: true,
//     autoIncrement: true
//   },
//   author: {
//     type: DataTypes.TEXT
//   },
//   url: {
//     type: DataTypes.TEXT,
//     allowNull: false
//   },
//   likes: {
//     type: DataTypes.INTEGER,
//     defaulValue: 0
//   },
//   title: {
//     type: TEXT,
//     allowNull: false
//   }
// }, {
//   sequelize,
//   underscored: true,
//   timestamps: false,
//   modelName: 'blog'
// })

// Blog.sync()

// app.get('/api/blogs', async (req, res) => {
//   const blogs = await Blog.findAll()
//   res.json(blogs)
// })

// // app.get('/api/blogs/:id', async (req, res) => {
// //   const blog = await Blog.findByPk(req.params.id)
// //   if (blog) {
// //     res.json(blog)
// //   } else {
// //     res.status(404).end()
// //   }
// // })

// app.post('/api/blogs', async (req, res) => {
//   try {
//     const blog = await Blog.create(req.body)
//     return res.json(blog)
//   } catch(error) {
//     return res.status(400).json({ error })
//   }
// })

// // app.put('/api/blogs/:id', async (req, res) => {
// //   const blog = await Blog.findByPk(req.params.id)
// //   if (blog) {
// //     blog.important = req.body.important
// //     await blog.save()
// //     res.json(blog)
// //   } else {
// //     res.status(404).end()
// //   }
// // })

// app.delete('/api/blogs/:id', async (req,res) => {
//   await Blog.destroy({
//     where: {
//       id: req.params.id
//     }
//   })
// })

// const PORT = process.env.PORT || 3001
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`)
// })