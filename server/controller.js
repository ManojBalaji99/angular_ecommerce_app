const db = require("./db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken")
const util = require('util');
const queryAsync = util.promisify(db.query.bind(db));

// const staticCustomer_id = 'CU01';


//user

const handleErrors = (err) => {
  if (err.sqlState) {
    console.error(`ErrorState: ${err.sqlState}, ErrorMessage: ${err.sqlMessage}`);
  } else if (err) {
    console.error(err.message);
  }
};

const addCustomer = async (req, res) => {
  const { first_name, last_name, email, phone_number, address, password } = req.body;

  try {
    await queryAsync("INSERT INTO customers(first_name, last_name,email,phone_number,address) VALUES (?,?,?,?,?)",
      [first_name, last_name, email, phone_number, address]);

    const customer_idDB = await queryAsync("SELECT customer_id FROM customers WHERE email = ?", [email]);

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    await queryAsync("INSERT INTO customerValidation (customer_id,password) VALUES(?, ?)", [customer_idDB[0].customer_id, hash]);

    res.json({ success: true, message: "Customer added successfully" });
  } catch (error) {
    handleErrors(error)
    res.status(500).send("Internal Server Error");
  }
};

const loginValidation = async (req, res) => {
  const { email, password } = req.body;

  try {
    const userArray = await queryAsync("SELECT customers.customer_id, customers.first_name,customers.email, customervalidation.password FROM customers JOIN customervalidation USING(customer_id) WHERE customers.email = ?",
      [email]);

    const user = userArray[0]
    if (!user) {
      res.json({ success: false, message: "Invalid user" });
    } else {
      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (isPasswordValid) {
        const secretKey = "EComHub"
        const token = jwt.sign({ email }, secretKey, { expiresIn: '2h' })
        res.json({ success: true, message: "Valid Password",user_id : user.customer_id,token_id : token});
      } else {
        res.json({ success: false, message: "Invalid Password" });
      }
    }
  } catch (error) {
    handleErrors(error)
    console.log(error)
    res.status(500).send("Internal Server Error");
  }
};

//getProducts

const getProducts = async (req, res) => {
  try {
    let { limit, sort, category } = req.query;

    let query = "SELECT products.product_name, categories.category_name, products.price, products.stock_quantity FROM products JOIN categories ON products.category_id = categories.category_id";

    if (category) {
      query += " WHERE categories.category_name = '" + category + "'";
    }

    query += ` ORDER BY products.product_name ${sort} LIMIT ${limit}`;

    const products = await queryAsync(query);

    res.json(products);
  } catch (error) {
    handleErrors(error);
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
};

// cart product

const cartProductbyCustomer =  async (req, res)=>{

  let { customer_id, products } = req.body
  
  try {
    await queryAsync("DELETE FROM cartProducts WHERE customer_id = ?", [customer_id])
    if (products.length > 0) {
      products.forEach(async (product) => {
        await queryAsync("INSERT INTO cartProducts (customer_id, product_name,quantity) VALUES (?, ?,?)",[customer_id,product.product_name,product.quantity])
      })
      res.json({success : " True"})
    }
  }
  catch(error) {
    handleErrors(error);
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
}
  
const getCartProductofCustomer = async (req, res) => {
  let { customer_id } = req.query;

  try {
    if (customer_id) {
      const products = await queryAsync(
        "SELECT cartProducts.product_name, cartProducts.quantity, products.price FROM products JOIN cartProducts ON cartProducts.product_name = products.product_name JOIN categories on products.category_id = categories.category_id  WHERE cartProducts.customer_id=?",
        [customer_id]
      );
      res.json(products);
    } else {
      res.json({ products: "" });
    }
  } catch (error) {
    handleErrors(error);
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
};

const orderPlaced = async (req, res) => {
  const { paymentDetails, products, shippingAddress } = req.body;

  try {
    const total_amount_products = products.reduce((total, product) => {
      let subtotal = product.quantity * Number(product.price);
      return total + subtotal;
    }, 0);

   

    await queryAsync("INSERT INTO orders (customer_id, total_amount, status, payment_method, payments_details) VALUES (?, ?, ?, ?, ?)",
      [shippingAddress.customer_id, total_amount_products, "Placed", paymentDetails.method, JSON.stringify(paymentDetails.details)]);

    const order_idDB = await queryAsync("SELECT order_id FROM orders ORDER BY order_id DESC LIMIT 1");

  
    // shipping address

          await queryAsync("INSERT INTO customerShippingAddress (customer_id, order_id, full_name, address, city) VALUES (?, ?, ?, ?, ?)",
        [shippingAddress.customer_id, order_idDB[0].order_id, shippingAddress.full_name, shippingAddress.address, shippingAddress.city]);
   // order details and quantity update
    for (const product of products) {
      let product_amount = product.quantity * Number(product.price);



      await queryAsync("INSERT INTO order_details (order_id, product_id, quantity, subtotal) VALUES (?, (SELECT product_id FROM products WHERE product_name = ?), ?, ?)",
        [order_idDB[0].order_id, product.product_name, product.quantity, product_amount]);


      await queryAsync("UPDATE products AS p1 " +
        "JOIN (SELECT stock_quantity FROM products WHERE product_name = ?) AS p2 " +
        "SET p1.stock_quantity = p2.stock_quantity - ? " +
        "WHERE p1.product_name = ?",
        [product.product_name, product.quantity, product.product_name]);
    }

    res.json({ success: true, message: "Order Placed", order_id: order_idDB[0].order_id });
  } catch (error) {
    console.error(error); // Log the error
    handleErrors(error);
    res.status(500).send("Internal Server Error");
  }
};

// get order history

const getOrderHistory = async (req, res) => {
  const { customer_id } = req.query 

  try {
    const query = `
      SELECT
        orders.order_id,
        orders.customer_id,
        orders.status,
        products.product_name,
        order_details.quantity,
        order_details.subtotal,
        orders.total_amount,
        orders.placed_time,
        orders.cancelled_time,
        orders.delivered_time,
        customerShippingAddress.full_name,
        customerShippingAddress.address,
        customerShippingAddress.city
      FROM
        orders
      JOIN
        order_details ON orders.order_id = order_details.order_id
      JOIN
        products ON products.product_id = order_details.product_id
      JOIN
        customerShippingAddress ON customerShippingAddress.order_id = orders.order_id
      WHERE
        orders.customer_id = ?
    `;

    const orderHistory = await queryAsync(query, [customer_id]);
    res.json(orderHistory);
  } catch (error) {
    console.error(error); // Log the error
    handleErrors(error);
    res.status(500).send("Internal Server Error");
  }
};

const orderCancelled = async (req, res) => {
  const { customer_id, order_id } = req.body;

  try {
    // Retrieve the products
    const products = await queryAsync(
      "SELECT order_details.product_id, order_details.quantity FROM orders " +
        "JOIN order_details ON orders.order_id = order_details.order_id " +
        "WHERE order_details.order_id = ? && orders.customer_id = ? ",
      [order_id, customer_id]
    );

    // Update the status
    await queryAsync("UPDATE orders SET status = ? WHERE order_id = ?", [
      "Cancelled",
      order_id,
    ]);

    // Update the quantity for each product
    for (const product of products) {
      await queryAsync(
        "UPDATE products AS p1 " +
          "JOIN (SELECT stock_quantity FROM products WHERE product_id = ?) AS p2 " +
          "SET p1.stock_quantity = p2.stock_quantity + ? " +
          "WHERE p1.product_id = ?",
        [product.product_id, product.quantity, product.product_id]
      );
    }

    res.json({ message: "Order Cancelled" });
  } catch (error) {
    handleErrors(error);
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
};

const orderDelivered = async (req, res) => {
  const { customer_id, order_id } = req.body;

  try {
     await queryAsync("UPDATE orders SET status = ? WHERE order_id = ?", [
      "Delivered",
      order_id,
     ]);
    
    res.json({message : "orderDelivered"})
  }
  catch(error){
    handleErrors(error);
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
}




module.exports={addCustomer,loginValidation,getProducts,cartProductbyCustomer,getCartProductofCustomer,orderPlaced,getOrderHistory,orderCancelled,orderDelivered}