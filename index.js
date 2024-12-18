require('dotenv').config() // import the dotenv package to be able to call variable names
const express = require('express') // import the express frmework package
const app = express();
const cors = require('cors'); // import the cors package
const ConfigCores = {
  origin:["http://localhost:5173", "https://www.adebisitobi.com"],
  Credential: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"]
}
const port = process.env.PORT || 5000


//import your routes
const productRoutes = require("./src/routes/products")
const workRoutes = require("./src/routes/work")



app.use(cors(ConfigCores));
app.use(express.json());
app.options("", cors(ConfigCores))

app.get('/', (req, res) => {
   return res.send('very good')
})

app.use(productRoutes)
app.use(workRoutes)
  

app.listen(port, () => {
    console.log(`ok ${port}`);
})


