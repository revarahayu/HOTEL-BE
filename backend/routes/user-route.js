const express = require(`express`)
const app = express()

app.use(express.json())

const { checkRole } = require("../middleware/check-role");
const auth = require(`../auth/auth`)
const userController = require(`../controllers/user-controller`)

app.post("/login", userController.login)
app.post("/register", userController.register)

app.get(`/user`, auth.authVerify, checkRole(['admin']), userController.getUser)
app.post(`/user/find`, auth.authVerify,checkRole(['admin']), userController.findUser)
app.post(`/user/save`, auth.authVerify,checkRole(['admin']), userController.addUser)
app.put(`/user/:id_user`, auth.authVerify,checkRole(['admin']), userController.updateUser)
app.delete(`/user/:id_user`, auth.authVerify,checkRole(['admin']), userController.deleteUser)

module.exports = app