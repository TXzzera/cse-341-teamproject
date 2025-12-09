const { getAll, getSingle } = require('../controllers/stores');
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

describe('Stores GET endpoints', () => {
  afterEach(() => jest.clearAllMocks());

  it('getAll - should return all stores successfully', async () => {
    const req = {};
    const res = mockResponse();
    const fakeStores = [
      { name: 'Nike', location: 'Pleasant Avenue, 333', urlwebsite: 'https://nike.com' },
      { name: 'Adidas', location: 'Red Rock Street, 568', urlwebsite: 'https://adidas.com' }
    ];

    mongodb.getDatabase.mockReturnValue({
      db: () => ({
        collection: () => ({
          find: () => ({ toArray: () => Promise.resolve(fakeStores) })
        })
      })
    });

    await getAll(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(fakeStores);
  });

  it('getAll - should handle database error', async () => {
    const req = {};
    const res = mockResponse();

    mongodb.getDatabase.mockImplementation(() => { throw new Error('DB error'); });

    await getAll(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: 'DB error' });
  });

  it('getSingle - should return a store successfully', async () => {
    const req = { params: { id: '64a5f7e3e2f8c9b0d1234567' } };
    const res = mockResponse();
    const fakeStore = { name: 'Nike', location: 'Pleasant Avenue, 333', urlwebsite: 'https://nike.com' };

    mongodb.getDatabase.mockReturnValue({
      db: () => ({
        collection: () => ({
          findOne: () => Promise.resolve(fakeStore)
        })
      })
    });

    await getSingle(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(fakeStore);
  });

  it('getSingle - should return 400 for invalid ObjectId', async () => {
    const req = { params: { id: 'invalid-id' } };
    const res = mockResponse();

    await getSingle(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'Must use a valid store id to find an store.' });
  });

  it('getSingle - should return 404 if store not found', async () => {
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
    expect(res.json).toHaveBeenCalledWith({ message: 'store not found' });
  });
});
