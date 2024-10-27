const express = require(`express`)
const app = express()

app.use(express.json())

const { checkRole } = require("../middleware/check-role");
const auth = require(`../auth/auth`)
const TipeKamarController = require(`../controllers/tipe-kamar-controller`)


app.get(`/tipekamar`, auth.authVerify, checkRole(['admin']),TipeKamarController.getTipeKamar)
app.post(`/tipekamar/find`,auth.authVerify, checkRole(['admin']), TipeKamarController.filterTipeKamar)
app.post(`/tipekamar/save`, auth.authVerify, checkRole(['admin']),TipeKamarController.addTipeKamar)
app.put(`/tipekamar/:id_tipe_kamar`, auth.authVerify, checkRole(['admin']),TipeKamarController.updateTipeKamar)
app.delete(`/tipekamar/:id_tipe_kamar`, auth.authVerify, checkRole(['admin']),TipeKamarController.deleteTipeKamar)

module.exports = app