const express = require(`express`)
const app = express()

const PORT = 5000
/** load library cors */
const cors = require(`cors`)
app.use(express.static(__dirname))
const bodyParser = require("body-parser")
app.use(cors())
app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json())

const userRoute = require(`./routes/user-route`)
const tipekamarRoute = require(`./routes/tipe-kamar-route`)
const kamarRoute = require(`./routes/kamar-route`)
const pemesananRoute = require(`./routes/pemesanan-route`)

app.use(pemesananRoute)
app.use(tipekamarRoute)
app.use(kamarRoute)
app.use(userRoute)


app.listen(PORT, () => {
    console.log(`Server of Wikusama Hotel runs on port ${PORT}`)
})