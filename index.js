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
        password: req.body.password
    }
    users.push(newUser)

    fs.writeFileSync('users.json', JSON.stringify(users, null, 4))
    res.sendStatus(200)
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})