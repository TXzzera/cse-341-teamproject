const { getAll, getSingle } = require('../controllers/reviews');
const mongodb = require('../data/database');
const { ObjectId } = require('mongodb');

jest.mock('../data/database', () => ({
  getDatabase: jest.fn(),
  insertOne: jest.fn(),
  updateOne: jest.fn(),
  deleteOne: jest.fn(),
}));

const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.setHeader = jest.fn().mockReturnValue(res);
  return res;
};

describe('Reviews GET endpoints', () => {
  afterEach(() => jest.clearAllMocks());

  it('getAll - should return all reviews successfully', async () => {
    const req = {};
    const res = mockResponse();
    const fakeReviews = [
      { username: 'Bruno', rating: 5, price: 100, feedback: 'Great!' },
      { username: 'Ana', rating: 4, price: 80, feedback: 'Good!' }
    ];

    mongodb.getDatabase.mockReturnValue({
      db: () => ({
        collection: () => ({
          find: () => ({ toArray: () => Promise.resolve(fakeReviews) })
        })
      })
    });

    await getAll(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(fakeReviews);
  });

  it('getAll - should handle database error', async () => {
    const req = {};
    const res = mockResponse();

    mongodb.getDatabase.mockImplementation(() => { throw new Error('DB error'); });

    await getAll(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: 'DB error' });
  });

  it('getSingle - should return a review successfully', async () => {
    const req = { params: { id: '64a5f7e3e2f8c9b0d1234567' } };
    const res = mockResponse();
    const fakeReview = { username: 'Bruno', rating: 5, price: 100, feedback: 'Great!' };

    mongodb.getDatabase.mockReturnValue({
      db: () => ({
        collection: () => ({
          findOne: () => Promise.resolve(fakeReview)
        })
      })
    });

    await getSingle(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(fakeReview);
  });

  it('getSingle - should return 400 for invalid ObjectId', async () => {
    const req = { params: { id: 'invalid-id' } };
    const res = mockResponse();

    await getSingle(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'Must use a valid review id to find an review.' });
  });

  it('getSingle - should return 404 if review not found', async () => {
    const req = { params: { id: '64a5f7e3e2f8c9b0d1234567' } };
    const res = mockResponse();

    mongodb.getDatabase.mockReturnValue({
      db: () => ({
        collection: () => ({
          findOne: () => Promise.resolve(null)
        })
      })
    });

    await getSingle(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'review not found' });
  });
});
