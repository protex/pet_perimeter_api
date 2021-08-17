import { throws } from 'smid'
import Api from '../location-api.js'

// This test only verify invariants, not interaction with dependencies.
// That is tested with integration tests.
describe('perimeterApi', () => {
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
    1: [[{ lng: 1, lat: 1 }, { lng: 1, lat: 1 }, { lng: 1, lat: 1 }]]
  }
  // Mock store
  const store = {
    get: jest.fn(async (user, deviceid) => devicedata[deviceid]),
    push: jest.fn(async (deviceid, locationdata) => [...locationdata])
  }
  return { service: new Api(store), store, devicedata }
}
