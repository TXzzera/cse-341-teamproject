const mongodb = require('../data/database');
const ObjectId = require('mongodb').ObjectId;

const getAll = async (req, res) => {
  //#swagger.tags = ['Reviews']
  try {
    const reviews = await mongodb
      .getDatabase()
      .db()
      .collection('reviews')
      .find()
      .toArray();

    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



const getSingle = async (req, res) => {
  //#swagger.tags = ['Reviews']
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Must use a valid review id to find an review.' });
    }

    const reviewId = new ObjectId(req.params.id);

    const review = await mongodb
      .getDatabase()
      .db()
      .collection('reviews')
      .findOne({ _id: reviewId });

    if (!review) {
      return res.status(404).json({ message: "review not found" });
    }

    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(review);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const reviewCreate = async (req,res) =>{
    //#swagger.tags = ['Reviews']
    const newreview = {
        username: req.body.username,
        rating: req.body.rating,
        price: Number(req.body.price),
        feedback: req.body.feedback,
    };

    try {
        const result = await mongodb.insertOne('reviews', newreview);
        res.status(201).json({
            message: 'review created successfully',
            insertedId: result.insertedId,
            data: newreview
        });
    } catch (err) {
        res.status(500).json({message: 'Creating a review failed! Internal Error.'
        });
    }
}

const reviewUpdate = async (req, res) => {
    //#swagger.tags = ['Reviews']
    const reviewId = new ObjectId(req.params.id);
    const updatedreview = {
        username: req.body.username,
        rating: Number(req.body.rating),
        price: Number(req.body.price),
        feedback: req.body.feedback,
    };

    try {
        const query = {_id: reviewId};
        const updateData = {$set: updatedreview};
        const result = await mongodb.updateOne('reviews', query, updateData);

        if (result.modifiedCount > 0) {
        res.status(200).json({
            message: 'review updated successfully',
            data: updatedreview
        });
    } else {
        res.status(400).json({message: 'review not found!'});
    } } catch (err) {
        res.status(500).json({message: 'Updating review failed! Internal Error.'});
}};

const reviewDelete = async (req, res) => {
    //#swagger.tags = ['Reviews']
    const reviewId = new ObjectId(req.params.id);

    try {
        const query = {_id: reviewId};
        const result = await mongodb.deleteOne('reviews', query);
        if (result.deletedCount > 0) {
            res.status(200).json({message: 'review deleted successfully'});
        } else {
            res.status(400).json({message: 'review not found!'});
        } } catch (err) {
        res.status(500).json({message: 'Deleting review failed!'});
}};


module.exports = {
    getAll,
    getSingle,
    reviewCreate,
    reviewUpdate,
    reviewDelete
};