import { Router } from "express"
const router = Router()
const userController = require("../controllers/mobile/user")
const dashboardController = require("../controllers/mobile/dashboard")
const shopController = require("../controllers/mobile/shop")
const productController = require("../controllers/mobile/product")
const ticketController = require("../controllers/mobile/ticket")


// User
router.post('/login', userController.userUpdate)
router.post('/userUpdate', userController.userUpdate)
router.post('/wallet/recharge', userController.recharge)
router.get('/wallet/transactions', userController.userTransaction)

// Address
router.get('/address', userController.address)
router.post('/address/add', userController.addAddress)
router.delete('/address/delete/:id', userController.addAddress)

// Dashboard 
router.get('/', dashboardController.dashboard)

// Shop 
router.post('/shops/:id', shopController.shopsByCategory)
router.post('/shop/:id', shopController.shop)


// Product 
router.post('/product/:id', productController.product)


module.exports = router