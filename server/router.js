const express = require('express')
const {getProducts,addCustomer,loginValidation,cartProductbyCustomer,getCartProductofCustomer,orderPlaced,getOrderHistory,orderCancelled,orderDelivered} = require ('./controller')
const {authenticateToken} = require("./middleware")
const router = express.Router()


//custom routes without middlwware
router.post("/addCustomer", addCustomer)
router.put("/login", loginValidation)


router.use(authenticateToken)

// router with middleware
router.get("/products", getProducts)
router.post("/cartproducts", cartProductbyCustomer)
router.get("/getCartProduct", getCartProductofCustomer)
router.post("/orderPlaced", orderPlaced)
router.get("/getorderhistory",getOrderHistory)
router.put("/orderCancelled", orderCancelled)
router.put("/orderDelivered",orderDelivered)

module.exports = router