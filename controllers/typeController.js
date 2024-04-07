const Type = require("../models/Type.js")

const addType = async(req,res) => {
    try {
        const newType = new Type({
            name:req.body.name
        })
        await newType.save()
       return  res.status(201).send("Type added")
    } catch (error) {
       return res.status(500).send("Internal server error")
    }
}

const getTypes = async(req,res) => {
    try {
        const types = await Type.find()
        if(types !== "")
        {
           return res.status(200).send(types) 
        }
        return res.status(404).send("Not types Found")
    } catch (error) {
        
    }
}

module.exports = {addType,getTypes}

