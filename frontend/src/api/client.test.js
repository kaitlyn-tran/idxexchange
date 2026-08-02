import {fetchProperties} from './client';

describe('API Client - fetchProperties', () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  test('fetches properties with empty parameters by default', async () => {
    const mockData = {total: 1, limit: 20, offset: 0, results: [{ L_ListingID: '123'}]};
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockData,
    });

    const result = await fetchProperties();

    expect(global.fetch).toHaveBeenCalledWith('/api/properties');
    expect(result).toEqual(mockData);
  });

  test('correctly builds query string without empty strings', async () => {
    const mockData = {total: 0, limit: 20, offset: 0, results: []};
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockData,
    });

    await fetchProperties({city: 'Portland', zipcode: '', beds: '3'});

    expect(global.fetch).toHaveBeenCalledWith('/api/properties?city=Portland&beds=3');
  });

  test('throws error on non-OK response', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: false,
      status: 400,
      json: async () => ({message: 'Invalid minPrice parameter' }),
    });

    await expect(fetchProperties({ minPrice: 'abc' })).rejects.toThrow('Invalid minPrice parameter');
  });
});