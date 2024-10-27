const express = require(`express`)
const app = express()

app.use(express.json())

const PemesananController = require(`../controllers/pemesanan-controller`)
const { checkRole } = require("../middleware/check-role");
const auth = require(`../auth/auth`)

//resepsionis
app.get(`/pemesanan`, auth.authVerify, checkRole(['resepsionis']), PemesananController.getAllPemesanan)
app.put(`/pemesanan/:id_pemesanan`, auth.authVerify, checkRole(['resepsionis']), PemesananController.updatePemesanan)
app.post(`/byname`, auth.authVerify, checkRole(['resepsionis']), PemesananController.getPemesananByName)
app.post(`/bycheckin`, auth.authVerify, checkRole(['resepsionis']), PemesananController.getPemesananByTglCheckIn)

//customer
app.post(`/pemesanan/save`, auth.authVerify, checkRole(['customer']), PemesananController.addPemesanan)
app.get(`/byid/:id_user`, auth.authVerify, checkRole(['customer']), PemesananController.getPemesananById)
app.post(`/bynomor`, auth.authVerify, checkRole(['customer']), PemesananController.getPemesananByNomor)



module.exports = app