import { apiHelper } from './api-helper'

// TIP: if you have more than a handful of tests here
// in can be beneficial to split them into multiple files for
// test speed.
describe('todos API', () => {
  const location = { time: 213, location: [1, 2] }
  it('can create todo', async () => {
    const api = await apiHelper()
    const locationData = await api.pushLocationData(1, [location])

    expect(locationData).toBeDefined()
    expect(locationData[0]).toEqual(expect.objectContaining(location))
  })

  it('can get todo', async () => {
    const api = await apiHelper()

    const gotten = await api.getLocationData(1, 1)
    expect(gotten).toEqual([location])
  })
})
