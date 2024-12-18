const Works = require("../../models/work"); //import the work model
const  Upload = require('../middleware/ImageUpload') // import the image upload middleware
const Supabase = require('../middleware/Supabase') // import the supabase middleware

//create the  controller too get all work in the database
exports.allWorks = async(req, res) => {

    //using the try catch block
    try {
        const workList = await Works.findAll()
        res.json({fetched:true, message: 'here are the data', Product: workList})

    } catch (error) {
        res.json({fetched: false, message: 'no data data'})
        
    }

  }


  //create the controller to fetch the particular data to be editted
  exports.editWork = async(req, res) => {

    const {id} = req.params;
  
    try {
     
      const Query = await Works.findByPk(id)
  
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
  exports.addWorks = [Upload.single('workimage'), async (req, res) => {
    try {
   const { workname, workstatus, workdetails } = req.body;
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
        workname: workname,
        workstatus: workstatus,
        workdetails: workdetails
       })
 
     res.json({ success: true, message: 'work was inserted successfully'});

   } catch (error) {

     console.error('Error uploading product:', error);
     res.status(500).json({ error: 'Failed to upload work' });
   }
 }]



 //controller to delete the work
 exports.deleteWork = async(req, res) => {
  const { id }= req.params
  
  try {
   
    const Sqlquery = await Works.findByPk(id);

    if(Sqlquery) {
      const ImageUrl = Sqlquery.workimage
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


      const Query = await Works.destroy({where: {id: id}});

      if(Query) { 
        console.log(Sqlquery.workname,'has gone');
        res.json({success: true, message:`${Sqlquery.workname} has been deleted`})
      }else{
        
        res.json({message: 'unable to delete product'})
      }
      
    }else{
      
      res.json({message: 'unable to compplete request'})
    }
  } catch (error) {
    console.error('sth went wrong', error);
    res.json({message: 'system error'})
  }
}



//controller to update work
exports.updateWork = async(req, res) => {
  const {workname, workstatus, workdetails} = req.body

  try {
    const Id = req.body.id

    const Sqlquery = await Works.findByPk(Id)

    if(Sqlquery) {
     
     await Works.update({
      workname: workname,
      workstatus: workstatus,
      workdetails: workdetails
     }, {where: {id: Id}})
     
      res.json({Updated: true, message: 'work updated successfully'})
      
    }else{
      console.log('error');
      res.json({message: 'unable to update work'})
    }
    
  } catch (error) {
    console.log(error);
    res.json({message: "Internal server error"})
  }
  
}