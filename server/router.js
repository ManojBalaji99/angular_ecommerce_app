const express = require('express')
const {getProducts,addCustomer,loginValidation,orderPlaced,orderCancelled} = require ('./controller')

const router = express.Router()


//custom routes
router.post("/addCustomer", addCustomer)
router.put("/login", loginValidation)


router.get("/products", getProducts)
// router.post("/orderPlaced", orderPlaced)
// router.put("/orderCancelled", orderCancelled)


module.exports = router