
const Products = require('../../models/product'); // require the product model
const  Upload = require('../middleware/ImageUpload') // import the image upload middleware
const Supabase = require('../middleware/Supabase') // imprt the supabase middleware

//controller to get all the products
exports.allProducts =  async(req, res) => {
    try {
       const products = await Products.findAll();
       
       res.json({fetched: true, message:'products fetched', products})
       
    } catch (error) {

      res.json({message: 'something went wrong'})
    }
  
  }


//create the controller to fetch the particular data to be editted
  exports.editProduct = async(req, res) => {
    const {id} = req.params;
  
    try {
      
      const Query = await Products.findByPk(id)
  
      if(Query) {
        
        res.json({fetched:true, result: Query})

      }else{
        
        res.json({fetched: false, message: 'unable to get product details'})
      }
    } catch (error) {
     
      res.json('status: 500, Falied to proccess request . Internal sever error')
    }
  }


//create a controller to add new products
  exports.addProducts = [Upload.single('productImage'), async (req, res) => {

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
            productimage: data.publicUrl,
            productname: productname,
            productstatus: productStatus,
            productprice: productPrice,
            productdescription: productDescription,
            producturl: productUrl
           });
    
        res.json({ success: true, message: 'Product was inserted successfully'});
      } catch (error) {

        console.error('Error uploading product:', error);
        res.status(500).json({ error: 'Failed to upload product' });
      }
    }]



    //controller too delete proucts
    exports.deleteProduct = async(req, res) => {
      const { id }= req.params
      
      try {
        const Sqlquery = await Products.findByPk(id);
  
        if(Sqlquery) {
          const ImageUrl = Sqlquery.productimage
          console.log(ImageUrl);
  
          const filepath = ImageUrl.split('/storage/v1/object/public/imageList/', -1)[1];
          console.log(filepath);
          
  
        const {error: storageError} =  await Supabase
          .storage
          .from('imageList')
          .remove([filepath])
  
          if(storageError){
            console.log(storageError);
          }
  
          const Query = await Products.destroy({where: {id: id}});
  
          if(Query) {
            console.log(Sqlquery.productname,'has been deleted');
            res.json({success: true, message:`${Sqlquery.productname} has been deleted`})
          }else{
            console.log('error occured');
            res.json({message: 'unable to process request'})
          }
          
        }else{
          console.log('hmmmm');
          res.json({message: 'unable to delete image'})
        }
        
      } catch (error) {
        console.error('sth went wrong', error);
        res.json({message: 'Something went wrong'})
      }
    }


    exports.updateProduct = async(req, res) => {
      const {productname, productstatus, productprice, productdescription, producturl} = req.body
  
      try {
        const Id = req.body.id
  
        const Sqlquery = await Products.findByPk(Id)

        if(Sqlquery) {
         
           await Products.update({
            productname: productname, 
            productstatus: productstatus, 
            productprice: productprice, 
            productdescription: productdescription, 
            producturl: producturl
           }, {where: {id: Id}})
           
          res.json({Updated: true, message: 'product updated successfully'})
          
        }else{
          console.log('error');
          res.json({message: 'unable to update product'})
        }
        
      } catch (error) {
        console.log(error);
        res.json({message: "Internal server error"})
      }
      
    }