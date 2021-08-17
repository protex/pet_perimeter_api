import { createServer } from '../lib/server'
import { memoize } from 'lodash'
import axios from 'axios'

/**
 * API helper to make it easier to test endpoints.
 */
export async function apiHelper() {
  const server = await startServer()
  const baseURL = `http://127.0.0.1:${server.address().port}`
  const client = axios.create({
    baseURL
  })

  return {
    catch: catchAndLog, // Useful for logging failing requests
    client,
    // Add your app-specific methods here.
    getLocationData: (user, deviceid) =>
      client.get(`/location/${user}/${deviceid}`).then(assertStatus(200)),
    pushLocationData: (deviceid, locationdata) =>
      client
        .post(`/location/${deviceid}`, locationdata)
        .then(assertStatus(201)),
    getPerimeterData: (user, deviceid) =>
      client.get(`/perimeter/${user}/${deviceid}`).then(assertStatus(200)),
    pushPerimeterData: (deviceid, perimeters) =>
      client.post(`/perimeter/${deviceid}`, perimeters).then(assertStatus(201)),
    updatePerimeterData: (deviceid, perimeterNumber, perimeter) =>
      client
        .post(`/perimeter/update/${deviceid}/${perimeterNumber}`, perimeter)
        .then(assertStatus(204)),
    getGatewayPerimeterData: (user, deviceid) =>
      client
        .get(`/perimeter/gateway/${user}/${deviceid}`)
        .then(assertStatus(200)),
    pushGateway: (user, data) =>
      client.post(`/location/gateway/${user}`, data).then(assertStatus(200))
  }
}

/**
 * Creates a status asserter that asserts the given status on the response,
 * then returns the response data.
 *
 * @param {number} status
 */
export function assertStatus(status) {
  return async function statusAsserter(resp) {
    if (resp.status !== status) {
      throw new Error(
        `Expected ${status} but got ${resp.status}: ${resp.request.method} ${resp.request.path}`
      )
    }
    return resp.data
  }
}

function catchAndLog(err) {
  if (err.response) {
    console.error(
      `Error ${err.response.status} in request ${err.response.request.method} ${err.response.request.path}`,
      err.response.data
    )
  }
  throw err
}

const startServer = memoize(async () => {
  return (await createServer()).listen()
})

afterAll(async () => {
  // Server is memoized so it won't start a new one.
  // We need to close it.
  const server = await startServer()
  return new Promise(resolve => server.close(resolve))
})
