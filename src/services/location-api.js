import { NotFound, BadRequest } from 'fejl'

// Prefab assert function.
const assertId = BadRequest.makeAssert('No device id supplied')

const HexToFloat32 = str => {
  let int = parseInt(str, 16)
  if (int > 0 || int < 0) {
    let sign = int >>> 31 ? -1 : 1
    let exp = ((int >>> 23) & 0xff) - 127
    let mantissa = ((int & 0x7fffff) + 0x800000).toString(2)
    let float32 = 0
    for (let i = 0; i < mantissa.length; i += 1) {
      float32 += parseInt(mantissa[i]) ? Math.pow(2, exp) : 0
      exp--
    }
    return float32 * sign
  } else return 0
}
// https://gist.github.com/Jozo132/2c0fae763f5dc6635a6714bb741d152f

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

  async pushGateway(deviceid, locationdata) {
    assertId(deviceid)
    BadRequest.assert(locationdata, 'No payload given')
    BadRequest.assert(
      'message' in locationdata,
      'Payload received but no "message" parameter found' +
        JSON.stringify(locationdata)
    )

    let coordinates = locationdata.message.split(';')
    let update = []
    for (let i = 0; i < coordinates.length; ++i) {
      if (coordinates[i] !== '' && /,/.test(coordinates[i])) {
        let coordinate = coordinates[i].split(',')
        if (
          coordinate.length === 2 &&
          coordinate[0].length === 8 &&
          coordinate[1].length === 8
        ) {
          update.push({
            lat: HexToFloat32(coordinate[0]),
            lng: HexToFloat32(coordinate[1])
          })
        }
      }
    }
    BadRequest.assert(
      update.length !== 0,
      'Payload with proper parameter found but no coordinates were parsed'
    )
    this.locationStore.push(deviceid, update)
    return 'ok'
  }
}
