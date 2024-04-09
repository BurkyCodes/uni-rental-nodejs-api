const express = require('express')

const {register,getUsers,login,registerAdmin, deleteUser, loginAdmin} = require("../controllers/userController.js")
const { verifyToken } = require('../Utils/verifyToken.js')

const router = express.Router()

router.post("/register",register)
router.get("getAllUsers",getUsers)
router.post("/login",login)
router.delete("/deleteUser/:id",deleteUser)
router.post("/register-admin",registerAdmin)
router.post("/login-admin",loginAdmin)
router.get("/currentUser",verifyToken)

module.exports  =  router