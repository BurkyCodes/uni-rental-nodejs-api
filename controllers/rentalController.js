const { error } = require("console");
const Rental = require("../models/Rental")
const multer = require('multer');
const path = require('path');
const fs = require('fs');


const storage = multer.diskStorage({
    destination:(req,file,cb) => {
        cb(null,'public/Images')
    },
    filename:(req,file,cb) => {
        cb(null,Date.now() + path.extname(file.originalname))
    }
})


const upload = multer({
    storage: storage,
    limits:{fileSize:"1000000"},
    fileFilter:(req,file,cb) => {
        const fileTypes = /jpeg|jpg|png|gif/
        const mimeType = fileTypes.test(file.mimetype)
        const extname = fileTypes.test(path.extname(file.originalname))

        if(mimeType & extname){
            return cb(null,true)
        }
        cb('Give proper files formate to upload')
    }
}).single('rentalImage');


const uploadImage = (req, res) => {
    upload(req, res, (err) => {
        if (err) {
            console.error('Error uploading file:', err);
            return res.status(500).json({ error: 'File upload failed' });
        }
        res.status(200).json({ url: req.file.path }); // Return the file path
    });
};

const updateRental = async (req,res) => {
    try {
        const {id} = req.params;
        const updates = req.body;

        if(!id){
            return res.status(400).send("Rental ID is required")
        }
        if (updates.latlng) {
            updates.latlng = JSON.parse(updates.latlng);
        }
        if (req.file) {
            updates.rentalImage = req.file.filename; 
        }
        const updateRental = await Rental.findByIdAndUpdate(id,updates,{new:true})
        if(!updateRental) {
            return res.status(404).send("Rental not found");
        }
        res.status(200).json({ message: "Rental updated successfully", updateRental });

    } catch (error) {
        console.error("Error updating rental:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}

const addRental = async (req, res) => {
        try {  
            const latlng = JSON.parse(req.body.latlng);
            const newRental = new Rental({
                name: req.body.name,
                rentalImage: req.file.filename, 
                category: req.body.category,
                price: req.body.price,
                description: req.body.description,
                contact: req.body.contact,
                location: req.body.location,
                ownersName: req.body.ownersName,
                // latitude:req.body.latitude,
                // longitude:req.body.longitude,
                latlng:latlng,
                available: true,
                amenities: [req.body.amenities],
                
            });
           
            if(req.body !== ""){
                await newRental.save();
                return res.status(200).send("Rental saved successfully");
            }
             return res.status(404).send("All fields are required"); 
            
        } catch (error) {
            res.status(500).send(error);
        }
};

const addRentalWithImages = async(req, res) => {
    upload(req, res, async (err) => {
        if (err) {
            console.error('Error uploading file:', err);
            return res.status(500).json({ error: 'File upload failed' });
        }
        
        try {
            const altImagesArray = [];
            // Check if altImages are provided in the request body
            if (req.body.altImages && Array.isArray(req.body.altImages)) {
                req.body.altImages.forEach(altImage => {
                    altImagesArray.push({ altImage });
                });
            }

            const newRental = new Rental({
                name: req.body.name,
                rentalImage: req.file ? req.file.path : null,
                category: req.body.category,
                price: req.body.price,
                description: req.body.description,
                contact: req.body.contact,
                location: req.body.location,
                ownersName: req.body.ownersName,
                available: true,
                amenities: req.body.amenities,
                altImages: altImagesArray  
            });

            await newRental.save();
            res.status(200).send("Rental with images saved successfully");
        } catch (error) {
            console.error("Error saving rental with images:", error);
            res.status(500).send("Internal server error");
        }
    });
};


const DeleteImage = async (req,res) => {
    try {
        let rentalId = req.params.id;
        const rental = await Rental.findById(rentalId)
        if (!rental) {
            return res.status(404).send("No rental found");
        }  
        else{
    const imagePath = `public/images/${rental.rentalImage}`;
               
        fs.unlink(imagePath, async (err) => {
            if (err) {
                console.error("Error deleting image:", err);
                return res.status(500).send("Error deleting image");
            }
           const rental =  await Rental.findByIdAndDelete(rentalId);
           if(!rental){
            return res.status(404).send("Deletion Failed");
           }
            return res.status(200).send("Delete Successful");
        })
                    
                
                //console.log(imagePath)
              
            }
        //        res.send("found") 
        //        await Rental.findByIdAndDelete(rentalId);
        //        return res.status(200).send("Delete Successful");
        // }
    } catch (error) {
        console.log(error)
        res.status(500).send("Internal Server Error");
    }
}

const getRentals = async(req,res) => {  
    try {
        const page = parseInt(req.query.page) || 0;
        const limit = parseInt(req.query.limit) || 10
        const rentals = await Rental.find()
                                    .skip(page * limit)
                                    .limit(limit)
        if(rentals !== "")
        {
            const total = await Rental.countDocuments({})
            const response = {
                total,
                page,
                limit,
                rentals
            }
           return res.status(200).send(response)
        }
        
           return res.status(404).send("No rentals found"); 
        
    }catch(error){
        res.status(500).send("Internal Server Error");
    }
}
const getRental = async (req,res,next) => {
    try {
        const rentalid = req.params.rentalId;
        const rental = await Rental.findOne({_id:rentalid})
        if(rental !== ""){
            res.status(200).send(rental)
        }else if(rental === ""){
             res.status(404).send("No rental found"); 
        } 
        
    } catch (error) {
        res.status(500).send("Internal Server Error"); 
    }  
}

const searchRental = async(req,res) => {
    const searchTerm = req.params.searchTerm;
    try {
        const rentals = await Rental.find({ name: { $regex: new RegExp(searchTerm, 'i') } });
        if(rentals !== "")
        {
           return res.send(rentals)
        }else
        {
           return res.status(404).send("No rentals found")
        }
    } catch (error) {
        res.status(500).send({
            message:error.message
        }); 
    }
}

const searchByUniversity = async (req,res) => {
    const place = req.params.university;
    try {
        
        const rentals = await Rental.find({ location: { $eq: place } });
        if(rentals !== "")
        {
           return res.send(rentals)
        }else
        {
           return res.status(404).send("No rentals found")
        }
    } catch (error) {
        res.status(500).send({
            message:error.message
        }); 
    }
}

const searchByType = async(req,res,next) => {
    const type = req.params.type;
    try {
        const rentals = await Rental.find({ category: { $regex: new RegExp(type, 'i') } });

       if(rentals !== "")
        {
           return res.send(rentals)
        }else
        {
           return res.status(404).send("No rentals found")
        }
    } catch (error) {
        res.status(500).send({
            message:error.message
        }); 
    }
}

module.exports = {getRental,searchByType,searchRental,upload,updateRental,addRental,getRentals,uploadImage,DeleteImage,addRentalWithImages,searchByUniversity}