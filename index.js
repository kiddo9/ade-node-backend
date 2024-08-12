require('dotenv')
const express = require('express')
const app = express();
const cors = require('cors');
const ConfigCores = {
  origin:"*",
  Credential: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"]
}
const client = require('./src/config/db_connection')
const port = process.env.PORT || 5000
const Supabase = require('./src/middleware/Supabase')
const multer = require('multer')
const Storage = multer.memoryStorage();

const Upload = multer({
    storage: Storage
});


app.use(cors(ConfigCores));
app.use(express.json());
app.options("", cors(ConfigCores))

app.get('/', (req, res) => {
   return res.send('very good')
})
app.get('/AllProducts', async(req, res) => {
  try {
     const ProductList = await client.query('SELECT * FROM products_abe');

    if(ProductList){
        console.log('here', ProductList);
        res.json({fetched:true, message: 'here are the data', Product: ProductList})
    }else{
        console.log('wahala done dey ooo');
        res.json({fetched: false, message: 'no data data'})
    }
  } catch (error) {
    console.error(error);
    
  }

})

app.get('/Allworks', async(req, res) => {
  const workList = await client.query('SELECT * FROM work');

  if(workList){
      console.log('here', workList);
      res.json({fetched:true, message: 'here are the data', Product: workList})
  }else{
      console.log('wahala done dey ooo');
      res.json({fetched: false, message: 'no data data'})
  }
})

app.post('/productDetails', Upload.single('productImage'), async (req, res) => {
  try {
    const { productname, productPrice, productStatus, productDescription, productUrl } = req.body;
    const file = req.file;
  
    const { originalname, buffer, mimetype } = file;
    const filepath = `${Date.now()}_${originalname}`;
  
       await Supabase
        .storage
        .from('imageList')
        .upload(filepath, buffer, {
          contentType: mimetype,
          upsert: true,
        });

        const {data} = Supabase
        .storage
        .from('imageList')
        .getPublicUrl(filepath)
        
      await Products.create({
        productImage: data.publicUrl,
        productname,
        productPrice,
        productStatus,
        productDescription,
        productUrl,
      });
  
      res.json({ success: true, message: 'Product was inserted successfully' });
    } catch (error) {
      console.error('Error uploading product:', error);
      res.status(500).json({ error: 'Failed to upload product' });
    }
  });

  app.post('/workdetails', Upload.single('workimage'), async (req, res) => {
     try {
    const { workname, workstatus, workdetails, } = req.body;
    const file = req.file;
  
    const { originalname, buffer, mimetype } = file;
    const filepath = `${Date.now()}_${originalname}`;
  
       await Supabase
        .storage
        .from('imageList')
        .upload(filepath, buffer, {
          contentType: mimetype,
          upsert: true,
        });

        const {data} = Supabase
        .storage
        .from('imageList')
        .getPublicUrl(filepath)
        
      await Works.create({
        workimage: data.publicUrl,
        workname,
        workstatus,
        workdetails,
      });
  
      res.json({ success: true, message: 'work was inserted successfully' });
    } catch (error) {
      console.error('Error uploading product:', error);
      res.status(500).json({ error: 'Failed to upload work' });
    }
  });
  

app.listen(port, () => {
    console.log(`ok ${port}`);
})


