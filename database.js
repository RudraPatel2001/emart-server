const { Pool } = require('pg');
require('dotenv').config()

// const c = new Pool({
//     host: "localhost",
//     user: "postgres",
//     port: 5432,
//     password: "admin123",
//     database: "pern"
// })

const c = new Pool({
    host: process.env.PG_HOST,
    user: process.env.PG_USER,
    port: process.env.PG_PORT,
    password: process.env.PG_PASSWORD,
    database: process.env.PG_DATABASE,
    ssl: { rejectUnauthorized: false }
})

// const c = new Pool({
//     host: 'ec2-54-228-32-29.eu-west-1.compute.amazonaws.com',
//     user: 'puarmxbjzagnxg',
//     port: 5432,
//     password: 'b32d208ef6cdc51c961ff5fe978a9387f84915ea5521867a3d3bd6ab254e8fa0',
//     database: 'd1tarqo15v0v8f',
//     ssl: { rejectUnauthorized: false }
// })

module.exports = c;