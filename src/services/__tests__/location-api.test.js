import { throws } from 'smid'
import Api from '../location-api.js'

// This test only verify invariants, not interaction with dependencies.
// That is tested with integration tests.
describe('locationApi', () => {
  describe('get', () => {
    it('throws when not found', async () => {
      const { service, devicedata } = setup()
      expect(
        (await throws(service.get("iddoesn'tmatter", 'notauser'))).message
      ).toMatch(/not found/)

      expect(await service.get(1, 1)).toEqual(devicedata[1])
    })
  })

  describe('push', () => {
    it('throws when no id', async () => {
      const { service } = setup()
      expect((await throws(service.push())).message).toMatch(
        /No device id supplied/
      )
    })

    it('throws when no payload', async () => {
      const { service } = setup()
      expect((await throws(service.push(1, null))).message).toMatch(
        /No payload given/
      )
    })
  })
})

function setup() {
  const devicedata = {
    1: [
      { timestamp: 123, location: [1, 2] },
      { timestamp: 124, location: [2, 9] },
      { timestamp: 125, location: [3, 7] }
    ],
    2: [
      { timestamp: 567, location: [1, 2] },
      { timestamp: 568, location: [2, 9] },
      { timestamp: 569, location: [3, 7] }
    ]
  }
  // Mock store
  const store = {
    get: jest.fn(async (user, deviceid) => devicedata[deviceid]),
    push: jest.fn(async (deviceid, locationdata) => [...locationdata])
  }
  return { service: new Api(store), store, devicedata }
}
