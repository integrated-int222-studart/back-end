const express = require('express')

const app = express()
const port = process.env.PORT || 3000
app.use(express.json())
const adminRoute = require('./routes/admin.route')
const userRoute = require('./routes/user.route')
const productRoute = require('./routes/product.route')
const typeRoute = require('./routes/type.route')
app.use('/user', userRoute, productRoute, typeRoute)
app.use('/admin', adminRoute)
app.get('/', (req, res) => {
    res.send('Test Server')
})

app.listen(port, () => {
    console.log('Server is up on port ' + port)
})