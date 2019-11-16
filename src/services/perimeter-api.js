import { NotFound, BadRequest } from 'fejl'

// Prefab assert function.
const assertId = BadRequest.makeAssert('No device id supplied')

/**
 * Todo Service.
 * Gets a todo store injected.
 */
export default class Api {
  constructor(perimeterStore) {
    this.perimeterStore = perimeterStore
  }

  async get(user, deviceid) {
    assertId(deviceid)
    // If `perimeterStore .get()` returns a falsy value, we throw a
    // NotFound error with the specified message.
    return this.perimeterStore
      .get(user, deviceid)
      .then(NotFound.makeAssert(`Data for "${deviceid}" not found`))
  }

  async push(deviceid, perimeter) {
    assertId(deviceid)
    BadRequest.assert(perimeter, 'No payload given')
    return this.perimeterStore.push(deviceid, perimeter)
  }

  async update(deviceid, perimeterNumber, perimeter) {
    assertId(deviceid)
    BadRequest.assert(perimeterNumber, 'No perimeter number given')
    BadRequest.assert(perimeter, 'No payload given')
    this.perimeterStore.update(deviceid, perimeterNumber, perimeter)
  }
}
