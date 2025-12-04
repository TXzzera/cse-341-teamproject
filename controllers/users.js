const mongodb = require('../data/database');
const ObjectId = require('mongodb').ObjectId;

const getAll = async (req, res) => {
  //#swagger.tags = ['Users']
  try {
    const users = await mongodb
      .getDatabase()
      .db()
      .collection('users')
      .find()
      .toArray();

    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



const getSingle = async (req, res) => {
  //#swagger.tags = ['Users']
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Must use a valid user id to find an user.' });
    }

    const userId = new ObjectId(req.params.id);

    const user = await mongodb
      .getDatabase()
      .db()
      .collection('users')
      .findOne({ _id: userId });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(user);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const userCreate = async (req,res) =>{
    //#swagger.tags = ['Users']
    const newUser = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        favoriteColor: req.body.favoriteColor,
        birthday: req.body.birthday
    };

    try {
        const result = await mongodb.insertOne('users', newUser);
        res.status(201).json({
            message: 'User created successfully',
            insertedId: result.insertedId,
            data: newUser
        });
    } catch (err) {
        res.status(500).json({message: 'Creating a user failed! Internal Error.'
        });
    }
}

const userUpdate = async (req, res) => {
    //#swagger.tags = ['Users']
    const userId = new ObjectId(req.params.id);
    const updatedUser = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        favoriteColor: req.body.favoriteColor,
        birthday: req.body.birthday
    };

    try {
        const query = {_id: userId};
        const updateData = {$set: updatedUser};
        const result = await mongodb.updateOne('users', query, updateData);

        if (result.modifiedCount > 0) {
        res.status(200).json({
            message: 'User updated successfully',
            data: updatedUser
        });
    } else {
        res.status(400).json({message: 'User not found!'});
    } } catch (err) {
        res.status(500).json({message: 'Updating user failed! Internal Error.'});
}};

const userDelete = async (req, res) => {
    //#swagger.tags = ['Users']
    const userId = new ObjectId(req.params.id);

    try {
        const query = {_id: userId};
        const result = await mongodb.deleteOne('users', query);
        if (result.deletedCount > 0) {
            res.status(200).json({message: 'User deleted successfully'});
        } else {
            res.status(400).json({message: 'User not found!'});
        } } catch (err) {
        res.status(500).json({message: 'Deleting user failed!'});
}};


module.exports = {
    getAll,
    getSingle,
    userCreate,
    userUpdate,
    userDelete
};