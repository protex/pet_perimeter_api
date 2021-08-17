import { createController } from 'awilix-koa'

// This is our API controller.
// All it does is map HTTP calls to service calls.
// This way our services could be used in any type of app, not
// just over HTTP.
const api = locationApi => ({
  getLocationdata: async ctx =>
    ctx.ok(await locationApi.get(ctx.params.user, ctx.params.deviceid)),
  pushLocationdata: async ctx =>
    ctx.created(await locationApi.push(ctx.params.deviceid, ctx.request.body)),
  pushGatewayLocationData: async ctx =>
    ctx.ok(await locationApi.pushGateway(ctx.params.deviceid, ctx.request.body)) // Created doesn't work with gateway code, responding with "OK"
})

// Maps routes to method calls on the `api` controller.
// See the `awilix-router-core` docs for info:
// https://github.com/jeffijoe/awilix-router-core
export default createController(api)
  .prefix('/location')
  .get('/:user/:deviceid', 'getLocationdata')
  .post('/:deviceid', 'pushLocationdata')
  .post('/gateway/:deviceid', 'pushGatewayLocationData')
