const express = require(`express`)
const app = express()

app.use(express.json())

const KamarController = require(`../controllers/kamar-controller`)
const { checkRole } = require("../middleware/check-role");
const auth = require(`../auth/auth`)

app.get(`/kamar`, auth.authVerify, checkRole(['admin']), KamarController.getKamar)
app.post(`/kamar/find`, auth.authVerify, checkRole(['admin']), KamarController.findKamar)
app.post(`/kamar/save`, auth.authVerify, checkRole(['admin']), KamarController.addKamar)
app.put(`/kamar/:id_kamar`, auth.authVerify, checkRole(['admin']), KamarController.updateKamar)
app.delete(`/kamar/:id_kamar`, auth.authVerify, checkRole(['admin']), KamarController.deleteKamar)

app.post(`/cek`,auth.authVerify, checkRole(['customer']), KamarController.getKamarAvaible )

module.exports = app