const express = require('express');
const { addRental, getRentals, uploadImage, addRentalWithImages,upload, DeleteImage, getRental, searchRental, searchByType, searchByUniversity, updateRental } = require('../controllers/rentalController');
const { verifyToken } = require('../Utils/verifyToken.js');

const router = express.Router();

router.post('/addRental',upload,addRental)
router.put('/updateRental/:id',upload,updateRental)
router.post('/upload',uploadImage)
router.get('/manageRentals',getRentals)
router.post('/addrentalWithImages',addRentalWithImages);

router.delete('/deleteRental/:id',DeleteImage )

router.get('/:rentalId',getRental);
router.get('/search/:searchTerm',searchRental);
router.get('/type/:type',searchByType)
router.get('/location/:university',searchByUniversity)

module.exports = router;