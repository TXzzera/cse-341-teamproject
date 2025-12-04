const mongodb = require('../data/database');
const ObjectId = require('mongodb').ObjectId;

const getAll = async (req, res) => {
  //#swagger.tags = ['Shirts']
  try {
    const shirts = await mongodb
      .getDatabase()
      .db()
      .collection('shirts')
      .find()
      .toArray();

    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(shirts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



const getSingle = async (req, res) => {
  //#swagger.tags = ['Shirts']
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Must use a valid Shirt id to find an Shirt.' });
    }

    const shirtId = new ObjectId(req.params.id);

    const Shirt = await mongodb
      .getDatabase()
      .db()
      .collection('shirts')
      .findOne({ _id: ShirtId });

    if (!Shirt) {
      return res.status(404).json({ message: "Shirt not found" });
    }

    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(Shirt);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const shirtCreate = async (req,res) =>{
    //#swagger.tags = ['Shirts']
    const newShirt = {
        brand: req.body.brand,
        club: req.body.club,
        year: Number(req.body.year),
        model: req.body.model,
        size: req.body.size,
        color: req.body.color,
        image: req.body.image
    };

    try {
        const result = await mongodb.insertOne('shirts', newShirt);
        res.status(201).json({
            message: 'Shirt created successfully',
            insertedId: result.insertedId,
            data: newShirt
        });
    } catch (err) {
        res.status(500).json({message: 'Creating a Shirt failed! Internal Error.'
        });
    }
}

const shirtUpdate = async (req, res) => {
    //#swagger.tags = ['Shirts']
    const ShirtId = new ObjectId(req.params.id);
    const updatedShirt = {
        brand: req.body.brand,
        club: req.body.club,
        year: Number(req.body.year),
        model: req.body.model,
        size: req.body.size,
        color: req.body.color,
        image: req.body.image
    };

    try {
        const query = {_id: ShirtId};
        const updateData = {$set: updatedShirt};
        const result = await mongodb.updateOne('shirts', query, updateData);

        if (result.modifiedCount > 0) {
        res.status(200).json({
            message: 'Shirt updated successfully',
            data: updatedShirt
        });
    } else {
        res.status(400).json({message: 'Shirt not found!'});
    } } catch (err) {
        res.status(500).json({message: 'Updating Shirt failed! Internal Error.'});
}};

const shirtDelete = async (req, res) => {
    //#swagger.tags = ['Shirts']
    const ShirtId = new ObjectId(req.params.id);

    try {
        const query = {_id: ShirtId};
        const result = await mongodb.deleteOne('shirts', query);
        if (result.deletedCount > 0) {
            res.status(200).json({message: 'Shirt deleted successfully'});
        } else {
            res.status(400).json({message: 'Shirt not found!'});
        } } catch (err) {
        res.status(500).json({message: 'Deleting Shirt failed!'});
}};


module.exports = {
    getAll,
    getSingle,
    shirtCreate,
    shirtUpdate,
    shirtDelete
};