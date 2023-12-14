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


module.exports={addCustomer,loginValidation,getProducts,cartProductbyCustomer,getCartProductofCustomer}