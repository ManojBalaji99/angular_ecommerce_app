const mysql = require("mysql2")

let db = mysql.createConnection({
    host: '127.0.0.1',
  user: 'root',
  password: 'ManojBalaji@99',
  database: 'ecommerce'
})

db.connect((err) => {
    if (err) {
        console.log("There is an error connecting to the database")
        return
    }

    console.log("Database connection established")
})

module.exports = db