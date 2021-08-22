const express = require('express')

const app = express()
const port = process.env.PORT || 3000
app.use(express.json())

const userRoute = require('./routes/user.route')
app.use('/user', userRoute)

app.get('/', (req, res) => {
    res.send('Test Server')
})

app.listen(port, () => {
    console.log('Server is up on port ' + port)
})