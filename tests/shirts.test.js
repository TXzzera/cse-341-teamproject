const { getAll, getSingle } = require('../controllers/shirts');
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

describe('Shirts GET endpoints', () => {
  afterEach(() => jest.clearAllMocks());

  it('getAll - should return all shirts successfully', async () => {
    const req = {};
    const res = mockResponse();
    const fakeShirts = [
      { brand: 'Nike', club: 'PSG', year: 2023, model: 'Home', color: 'Blue', image: 'url1' },
      { brand: 'Adidas', club: 'Real', year: 2022, model: 'Away', color: 'White', image: 'url2' }
    ];

    mongodb.getDatabase.mockReturnValue({
      db: () => ({
        collection: () => ({
          find: () => ({ toArray: () => Promise.resolve(fakeShirts) })
        })
      })
    });

    await getAll(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(fakeShirts);
  });

  it('getAll - should handle database error', async () => {
    const req = {};
    const res = mockResponse();

    mongodb.getDatabase.mockImplementation(() => { throw new Error('DB error'); });

    await getAll(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: 'DB error' });
  });

  it('getSingle - should return a shirt successfully', async () => {
    const req = { params: { id: '64a5f7e3e2f8c9b0dabcdef1' } };
    const res = mockResponse();
    const fakeShirt = { brand: 'Nike', club: 'PSG', year: 2023, model: 'Home', color: 'Blue', image: 'url1' };

    mongodb.getDatabase.mockReturnValue({
      db: () => ({
        collection: () => ({
          findOne: () => Promise.resolve(fakeShirt)
        })
      })
    });

    await getSingle(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(fakeShirt);
  });

  it('getSingle - should return 400 for invalid ObjectId', async () => {
    const req = { params: { id: 'invalid-id' } };
    const res = mockResponse();

    await getSingle(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'Must use a valid shirt id to find an shirt.' });
  });

  it('getSingle - should return 404 if shirt not found', async () => {
    const req = { params: { id: '64a5f7e3e2f8c9b0dabcdef1' } };
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
    expect(res.json).toHaveBeenCalledWith({ message: 'shirt not found' });
  });
});
