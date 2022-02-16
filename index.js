const cors = require('cors')
const express = require('express')
const fs = require('fs')
const app = express()
const port = 4000

app.use(cors())
app.use(express.json())

const users = require('./users.json')

app.post('/api/signup', (req, res) => {
    if (!req.body.name || !req.body.password) {
        return res.status(400).json('Missing credentials')
    }
    const userExists = users.some(user => user.name === req.body.name)
    if (userExists) {
        return res.sendStatus(409)
    }
    const newUser = {
        name: req.body.name,
        password: req.body.password,
        todos: []
    }
    users.push(newUser)

    fs.writeFileSync('users.json', JSON.stringify(users, null, 4))
    res.sendStatus(200)
})

app.post('/api/todo', (req, res) => {
    const autoHead = req.header('authorization')
    if (!autoHead) return res.sendStatus(401)

    const username = autoHead.split(':::')[0]
    const password = autoHead.split(':::')[1]

    const user = users.find(user => user.name === username && user.password === password)
    if (!user) return res.sendStatus(401);

    const todoMess = req.body.todo
    if (!todoMess) return res.sendStatus(400)

    user.todos.push(todoMess)
    fs.writeFileSync('users.json', JSON.stringify(users, null, 4))
    res.sendStatus(200)
})

app.get('/api/secret', (req, res) => {
    const autoHead = req.header('authorization')
    if (!autoHead) return res.sendStatus(401)

    const username = autoHead.split(':::')[0]
    const password = autoHead.split(':::')[1] // lehetne 2 header, 1 pw, 1 username... ::: azt mi választottuk random, ami valszeg nincs usernameben, pwben, a karakter letiltható

    const user = users.find(user => user.name === username && user.password === password)
    if (!user) return res.sendStatus(401);
    res.json({ message: 'valami' })
    console.log(autoHead)
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})