const mongodb = require('../data/database');
const ObjectId = require('mongodb').ObjectId;

const getAll = async (req, res) => {
  //#swagger.tags = ['Stores']
  try {
    const stores = await mongodb
      .getDatabase()
      .db()
      .collection('stores')
      .find()
      .toArray();

    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(stores);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



const getSingle = async (req, res) => {
  //#swagger.tags = ['Stores']
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Must use a valid store id to find an store.' });
    }

    const storeId = new ObjectId(req.params.id);

    const store = await mongodb
      .getDatabase()
      .db()
      .collection('stores')
      .findOne({ _id: storeId });

    if (!store) {
      return res.status(404).json({ message: "store not found" });
    }

    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(store);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const storeCreate = async (req,res) =>{
    //#swagger.tags = ['Stores']
    const newstore = {
        name: req.body.name,
        location: req.body.location,
        urlwebsite: req.body.urlwebsite,
    };

    try {
        const result = await mongodb.insertOne('stores', newstore);
        res.status(201).json({
            message: 'store created successfully',
            insertedId: result.insertedId,
            data: newstore
        });
    } catch (err) {
        res.status(500).json({message: 'Creating a store failed! Internal Error.'
        });
    }
}

const storeUpdate = async (req, res) => {
    //#swagger.tags = ['Stores']
    const storeId = new ObjectId(req.params.id);
    const updatedstore = {
        name: req.body.name,
        location: req.body.location,
        urlwebsite: req.body.urlwebsite,
    };

    try {
        const query = {_id: storeId};
        const updateData = {$set: updatedstore};
        const result = await mongodb.updateOne('stores', query, updateData);

        if (result.modifiedCount > 0) {
        res.status(200).json({
            message: 'store updated successfully',
            data: updatedstore
        });
    } else {
        res.status(400).json({message: 'store not found!'});
    } } catch (err) {
        res.status(500).json({message: 'Updating store failed! Internal Error.'});
}};

const storeDelete = async (req, res) => {
    //#swagger.tags = ['Stores']
    const storeId = new ObjectId(req.params.id);

    try {
        const query = {_id: storeId};
        const result = await mongodb.deleteOne('stores', query);
        if (result.deletedCount > 0) {
            res.status(200).json({message: 'store deleted successfully'});
        } else {
            res.status(400).json({message: 'store not found!'});
        } } catch (err) {
        res.status(500).json({message: 'Deleting store failed!'});
}};


module.exports = {
    getAll,
    getSingle,
    storeCreate,
    storeUpdate,
    storeDelete
};