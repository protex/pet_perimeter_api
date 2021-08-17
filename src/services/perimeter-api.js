import { NotFound, BadRequest } from 'fejl'

// Prefab assert function.
const assertId = BadRequest.makeAssert('No device id supplied')

function decimalToHexString(number) {
  if (number < 0) {
    number = 0xff + number + 1
  }
  let str = number.toString(16).toUpperCase()
  return '00'.slice(str.length) + str
}
// https://stackoverflow.com/questions/57803/how-to-convert-decimal-to-hexadecimal-in-javascript

function floatTo32HexString(number) {
  let truncate = new Float32Array(1)
  truncate[0] = number
  let bytes = new Int8Array(truncate.buffer)
  return bytes.reduce(function(str, num) {
    return decimalToHexString(num) + str
  }, '')
}
// https://stackoverflow.com/questions/29629597/how-to-convert-float-into-byte-array

/**
 * Todo Service.
 * Gets a todo store injected.
 */
export default class Api {
  constructor(perimeterStore) {
    this.perimeterStore = perimeterStore
  }

  async getGateway(user, deviceid) {
    assertId(deviceid)
    // If `perimeterStore .get()` returns a falsy value, we throw a
    // NotFound error with the specified message.
    let locationData = await this.perimeterStore
      .get(user, deviceid)
      .then(NotFound.makeAssert(`Data for "${deviceid}" not found`))
    let response = ''
    if (locationData[0]) {
      for (let i in locationData[0]) {
        let location = locationData[0][i]
        response += `${floatTo32HexString(location.lat)},${floatTo32HexString(
          location.lng.toFixed(7)
        )};`
      }
    }
    return response
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

  async socket(ctx) {
    const ws = await ctx.ws()
    ws.on('message', message => {
      ws.send('got: ' + message)
    })
  }
}
