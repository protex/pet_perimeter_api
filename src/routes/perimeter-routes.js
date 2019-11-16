import { createController } from 'awilix-koa'

// This is our API controller.
// All it does is map HTTP calls to service calls.
// This way our services could be used in any type of app, not
// just over HTTP.
const api = perimeterApi => ({
  getPerimeterData: async ctx =>
    ctx.ok(await perimeterApi.get(ctx.params.user, ctx.params.deviceid)),
  pushPerimeterData: async ctx =>
    ctx.created(await perimeterApi.push(ctx.params.deviceid, ctx.request.body)),
  updatePerimeterData: async ctx =>
    ctx.noContent(
      await perimeterApi.update(
        ctx.params.deviceid,
        ctx.params.perimeterNumber,
        ctx.request.body
      )
    )
})

// Maps routes to method calls on the `api` controller.
// See the `awilix-router-core` docs for info:
// https://github.com/jeffijoe/awilix-router-core
export default createController(api)
  .prefix('/perimeter')
  .get('/:user/:deviceid', 'getPerimeterData')
  .post('/:deviceid', 'pushPerimeterData')
  .post('/update/:deviceid/:perimeterNumber', 'updatePerimeterData')
