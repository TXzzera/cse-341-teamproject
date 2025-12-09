const { getAll, getSingle } = require('../controllers/users');
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

describe('Users GET endpoints', () => {
  afterEach(() => jest.clearAllMocks());

  it('getAll - should return all users successfully', async () => {
    const req = {};
    const res = mockResponse();
    const fakeUsers = [
      { username: 'Bruno', email: 'bruno@example.com' },
      { username: 'Ana', email: 'ana@example.com' }
    ];

    mongodb.getDatabase.mockReturnValue({
      db: () => ({
        collection: () => ({
          find: () => ({ toArray: () => Promise.resolve(fakeUsers) })
        })
      })
    });

    await getAll(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(fakeUsers);
  });

  it('getAll - should handle database error', async () => {
    const req = {};
    const res = mockResponse();

    mongodb.getDatabase.mockImplementation(() => { throw new Error('DB error'); });

    await getAll(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: 'DB error' });
  });

  it('getSingle - should return a user successfully', async () => {
    const req = { params: { id: '64a5f7e3e2f8c9b0d1234567' } };
    const res = mockResponse();
    const fakeUser = { username: 'Bruno', email: 'bruno@example.com' };

    mongodb.getDatabase.mockReturnValue({
      db: () => ({
        collection: () => ({
          findOne: () => Promise.resolve(fakeUser)
        })
      })
    });

    await getSingle(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(fakeUser);
  });

  it('getSingle - should return 400 for invalid ObjectId', async () => {
    const req = { params: { id: 'invalid-id' } };
    const res = mockResponse();

    await getSingle(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Must use a valid user id to find an user.'
    });
  });

  it('getSingle - should return 404 if user not found', async () => {
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
    expect(res.json).toHaveBeenCalledWith({ message: 'User not found' });
  });
});
