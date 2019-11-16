import { NotFound, BadRequest } from 'fejl'

// Prefab assert function.
const assertId = BadRequest.makeAssert('No device id supplied')

/**
 * Todo Service.
 * Gets a todo store injected.
 */
export default class Api {
  constructor(locationStore) {
    this.locationStore = locationStore
  }

  async get(user, deviceid) {
    assertId(deviceid)
    // If `locationStore.get()` returns a falsy value, we throw a
    // NotFound error with the specified message.
    return this.locationStore
      .get(user, deviceid)
      .then(NotFound.makeAssert(`Data for "${deviceid}" not found`))
  }

  async push(deviceid, locationdata) {
    assertId(deviceid)
    BadRequest.assert(locationdata, 'No payload given')
    return this.locationStore.push(deviceid, locationdata)
  }
}
