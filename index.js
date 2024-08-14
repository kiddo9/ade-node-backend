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
     const products = ProductList.rows
     res.json({fetched: true, message:'products fetched', products})
  } catch (error) {
    console.error(error);
  }

})

app.get('/Allworks', async(req, res) => {
  const workList = await client.query('SELECT * FROM work');

  if(workList.rows){
      console.log('here', workList);
      res.json({fetched:true, message: 'here are the data', Product: workList.rows})
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
        
        const Sqlquery = 'INSERT INTO products_abe (productImage, productname, productPrice, productStatus, productDescription, productUrl) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *'
        const valueInsertion = [data.publicUrl, productname, productPrice, productStatus, productDescription, productUrl]
        const InsertData = await client.query(Sqlquery, valueInsertion);
  
      res.json({ success: true, message: 'Product was inserted successfully', InsertData });
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

        const Sqlquery = 'INSERT INTO work ( workimage, workname, workstatus, workdetails) VALUES ($1, $2, $3, $4) RETURNING *'
        const valueInsertion = [data.publicUrl, workname, workstatus, workdetails]
        const InsertData = await client.query(Sqlquery, valueInsertion);
  
      res.json({ success: true, message: 'work was inserted successfully', InsertData });
    } catch (error) {
      console.error('Error uploading product:', error);
      res.status(500).json({ error: 'Failed to upload work' });
    }
  });

  app.delete('/DelectItem/:id', async(req, res) => {
    const { id }= req.params
    
    try {
      const Query = "SELECT productImage FROM products_abe WHERE id = $1"
      const values = [id];
      const Sqlquery = await client.query(Query, values);

      if(Sqlquery.rowCount > 0) {
        const ImageUrl = Sqlquery.rows[0].productimage
        console.log(ImageUrl);

        const filepath = ImageUrl.split('/storage/v1/object/public/')[1];
        console.log(filepath);
        

      const {error: storageError} =  await Supabase
        .storage
        .from('imageList')
        .remove([filepath])

        if(storageError){
          console.log(storageError);
        }

        const DeleteQuery = 'DELETE FROM products_abe WHERE id = $1'
        const values = [id];
        const Query = await client.query(DeleteQuery, values);

        if(Query.rowCount > 0) {
          console.log(Query.rowCount,'has gone');
          res.json({success: true, message:'product has been deleted'})
        }else{
          console.log('error occured');
        }
        
      }else{
        console.log('hmmmm');
      }
    } catch (error) {
      console.error('sth went wrong', error);
    }
  })


  app.delete('/DelectWork/:id', async(req, res) => {
    const { id }= req.params
    
    try {
      const Query = "SELECT workimage FROM work WHERE id = $1"
      const values = [id];
      const Sqlquery = await client.query(Query, values);

      if(Sqlquery.rowCount > 0) {
        const ImageUrl = Sqlquery.rows[0].workimage
        console.log(ImageUrl);

        const filepath = ImageUrl.split('/storage/v1/object/public/')[1];
        console.log(filepath);
        

      const {error: storageError} =  await Supabase
        .storage
        .from('imageList')
        .remove([filepath])

        if(storageError){
          console.log(storageError);
        }

        const DeleteQuery = 'DELETE FROM work WHERE id = $1'
        const values = [id];
        const Query = await client.query(DeleteQuery, values);

        if(Query.rowCount > 0) {
          console.log(Query.rowCount,'has gone');
          res.json({success: true, message:'product has been deleted'})
        }else{
          console.log('error occured');
        }
        
      }else{
        console.log('hmmmm');
      }
    } catch (error) {
      console.error('sth went wrong', error);
    }
  })
  

app.listen(port, () => {
    console.log(`ok ${port}`);
})


