const express = require('express')
const cors = require('cors')
const app = express()
const port = process.env.PORT || 3000
app.use(express.json())
const adminRoute = require('./routes/admin.route')
const userRoute = require('./routes/user.route')
const productRoute = require('./routes/products/product.route')
const typeRoute = require('./routes/products/type.route')
const imageRoute = require('./routes/products/images.route')
app.use(cors({
    origin: '*'
}))
app.use('/user', userRoute, productRoute, typeRoute, imageRoute)
app.use('/admin', adminRoute)
app.get('/', (req, res) => {
    res.send('Test Server')
})

app.listen(port, () => {
    console.log('Server is up on port ' + port)
})