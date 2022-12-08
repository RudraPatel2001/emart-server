const express = require('express');
const app = express();
const cors = require('cors');
const db = require('./database');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
require('dotenv').config()

app.use(cors({ origin: ['http://localhost:3000'], credentials: true }));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(session({
    secret: 'abcdefghijklmnopqrstuvwxyz',
    resave: false,
    saveUninitialized: true
}))
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

let loginStatus = false;

// Database Connection
db.connect((err) => {
    if (err) throw err
    else console.log('Connected!')
});

// Fetching all the Users
app.get('/users', async (req, res) => {
    try {
        const users = await db.query('SELECT * FROM users WHERE auth = 2');
        res.json(users.rows);
    } catch (e) {
        res.send({ message: `Error Loading Page! ${e.message}` })
    }
})

// Creating a new User
app.post('/register', async (req, res) => {
    try {
        const { fName, lName, username, password, email } = req.body;
        const newUser = await db.query(`INSERT INTO users(fname, lname, username, password, email) VALUES($1,$2,$3,$4,$5)`, [fName, lName, username, password, email]);
        res.json(newUser.rows[0]);
    } catch (e) {
        res.send({ message: `Try to Register Again! ${e.message}` })
    }
})

// Keep User LoggedIn
app.get('/login', (req, res) => {
    if (req.session.user && loginStatus) {
        res.send({ loggedIn: loginStatus, user: req.session.user })
    } else {
        res.send({ loggedIn: false })
    }
})

// User Login
app.post('/login', async (req, res) => {
    const { username, password } = req.body
    try {
        loginStatus = true;
        const users = await db.query(`SELECT fname, lname, username, email, uid, auth FROM users WHERE username = $1 AND password = $2`, [username, password]);
        req.session.user = users.rows
        res.json(users.rows);
    } catch (e) {
        res.send({ message: `Invalid Credentials! ${e.message}` });
    }
})

// Logout User
app.get('/logout', (req, res) => {
    loginStatus = false;
    req.session.destroy(err => {
        if (err)
            res.send({ loggedIn: true })
        else {
            res.send({ loggedIn: false })
        }
    })
    // res.send({loggedIn: false, user: []})
})

// Update a User
app.post("/update", async (req, res) => {
    const { fname, lname, username, email, oldUsername } = req.body;
    try {
        const update = await db.query("UPDATE users SET fname = $1, lname = $2, username = $3, email = $4 WHERE username = $5", [fname, lname, username, email, oldUsername])
        res.json(update.rows)
    } catch (e) {
        res.send({ message: `Error Updating User! ${e.message}` });
    }
})

// Delete a User
app.delete('/deleteuser/:id', async (req, res) => {
    const { id } = req.params;
    const delUser = await db.query("DELETE FROM users WHERE uid = $1", [id])
    res.json(delUser.rows)
})

// Fetching Products Table
app.get('/products', async (req, res) => {
    try {
        const prods = await db.query("SELECT * FROM products");
        res.json(prods.rows)
    } catch (e) {
        res.send({ message: `Error Loading Products! ${e.message}` });
    }
})

// Sort Products Table
app.get('/sortproducts', async (_, res) => {
    try {
        const sortProds = await db.query("SELECT * FROM products ORDER BY name")
        res.json(sortProds.rows)
    } catch (e) {
        res.send({ message: `Error Sorting Products! ${e.message}` });
    }
})

// Reverse Sort Products Table
app.get('/revsortprods', async (_, res) => {
    try {
        const revsort = await db.query("SELECT * FROM products ORDER BY name DESC")
        res.json(revsort.rows)
    } catch (e) {
        res.send({ message: `Error Sorting Products! ${e.message}` });
    }
})

// Add to Cart
app.post('/addtocart', async (req, res) => {
    const { x, y, z } = req.body;
    try {
        const add = await db.query("INSERT INTO cart(p_name, p_price, p_img) VALUES($1,$2,$3)", [x, y, z]);
        res.json(add.rows[0])
    } catch (e) {
        res.send({ message: `Failed to Add Item to Cart! ${e.message}` });
    }
})

// Display Cart
app.get('/cart', async (req, res) => {
    try {
        const cart = await db.query('SELECT * FROM cart');
        res.json(cart.rows);
    } catch (e) {
        res.send({ message: `Failed to Load Cart! ${e.message}` });
    }
})

// Remove from Cart
app.delete("/rfcart/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const del = await db.query("DELETE FROM cart WHERE p_id = $1", [id])
        res.json("Removed from cart")
    } catch (e) {
        res.send({ message: `Failed to Remove Item from Cart! ${e.message}` })
    }
})

// Empty Cart
app.get('/emptycart', async (req, res) => {
    const emptycart = await db.query("TRUNCATE TABLE cart")
    res.json(emptycart.rows)
})

// Feedback
app.post('/feedback', async (req, res) => {
    try {
        const { username, currentVal, feedback, uid } = req.body;
        const fback = await db.query('INSERT INTO feedback(username, stars, feedback, userid) VALUES($1,$2,$3,$4)', [username, currentVal, feedback, uid])
        res.json(fback.rows)
    } catch (e) {
        res.send({ message: `Feedback Error! ${e.message}` })
    }
})

app.get('/stars', async (req, res) => {
    try {
        const avgStars = await db.query('SELECT stars FROM feedback')
        res.json(avgStars.rows)
    } catch (e) {
        res.send({ message: `Error fetching stars! ${e.message}` })
    }
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log('App running on ' + PORT))