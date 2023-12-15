const express = require('express')
const {getProducts,addCustomer,loginValidation,cartProductbyCustomer,getCartProductofCustomer,orderPlaced,getOrderHistory,orderCancelled,orderDelivered} = require ('./controller')

const router = express.Router()


//custom routes
router.post("/addCustomer", addCustomer)
router.put("/login", loginValidation)
router.get("/products", getProducts)
router.post("/cartproducts", cartProductbyCustomer)
router.get("/getCartProduct", getCartProductofCustomer)
router.post("/orderPlaced", orderPlaced)
router.get("/getorderhistory",getOrderHistory)
router.put("/orderCancelled", orderCancelled)
router.put("/orderDelivered",orderDelivered)

module.exports = router