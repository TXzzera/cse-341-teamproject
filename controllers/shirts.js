const mongodb = require('../data/database');
const ObjectId = require('mongodb').ObjectId;

const getAll = async (req, res) => {
  //#swagger.tags = ['shirts']
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
  //#swagger.tags = ['shirts']
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Must use a valid shirt id to find an shirt.' });
    }

    const shirtId = new ObjectId(req.params.id);

    const shirt = await mongodb
      .getDatabase()
      .db()
      .collection('shirts')
      .findOne({ _id: shirtId });

    if (!shirt) {
      return res.status(404).json({ message: "shirt not found" });
    }

    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(shirt);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const shirtCreate = async (req,res) =>{
    //#swagger.tags = ['shirts']
    const newshirt = {
        brand: req.body.brand,
        club: req.body.club,
        year: Number(req.body.year),
        model: req.body.model,
        color: req.body.color,
        image: req.body.image
    };

    try {
        const result = await mongodb.insertOne('shirts', newshirt);
        res.status(201).json({
            message: 'shirt created successfully',
            insertedId: result.insertedId,
            data: newshirt
        });
    } catch (err) {
        res.status(500).json({message: 'Creating a shirt failed! Internal Error.'
        });
    }
}

const shirtUpdate = async (req, res) => {
    //#swagger.tags = ['shirts']
    const shirtId = new ObjectId(req.params.id);
    const updatedshirt = {
        brand: req.body.brand,
        club: req.body.club,
        year: Number(req.body.year),
        model: req.body.model,
        color: req.body.color,
        image: req.body.image
    };

    try {
        const query = {_id: shirtId};
        const updateData = {$set: updatedshirt};
        const result = await mongodb.updateOne('shirts', query, updateData);

        if (result.modifiedCount > 0) {
        res.status(200).json({
            message: 'shirt updated successfully',
            data: updatedshirt
        });
    } else {
        res.status(400).json({message: 'shirt not found!'});
    } } catch (err) {
        res.status(500).json({message: 'Updating shirt failed! Internal Error.'});
}};

const shirtDelete = async (req, res) => {
    //#swagger.tags = ['shirts']
    const shirtId = new ObjectId(req.params.id);

    try {
        const query = {_id: shirtId};
        const result = await mongodb.deleteOne('shirts', query);
        if (result.deletedCount > 0) {
            res.status(200).json({message: 'shirt deleted successfully'});
        } else {
            res.status(400).json({message: 'shirt not found!'});
        } } catch (err) {
        res.status(500).json({message: 'Deleting shirt failed!'});
}};


module.exports = {
    getAll,
    getSingle,
    shirtCreate,
    shirtUpdate,
    shirtDelete
};