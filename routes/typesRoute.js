const express = require('express');
const { addType, getTypes } = require('../controllers/typeController.js');

const router = express.Router();

router.post("/add",addType)
router.get("",getTypes)


module.exports = router;