# emart-server

### This is the backend code for E-Mart ([Link](https://github.com/Rudra1402/E-Mart))

### Documentation:

Base Link
https://emart-server.onrender.com

Products listed
"/products"

Products sorted by name
"/sortproducts"

Products reverse sorted by name
"/revsortprods"

Stars given as feedback
"/stars"

Users on the site
"/users"

Products present in the Cart
"/cart"

### Fetch (using Axios)

install using npm :
npm install axios

import axios from "axios"  
axios.get(path)  
  .then(res => console.log(res.data))  
  .catch(err => console.log(err))
