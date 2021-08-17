import { apiHelper } from './api-helper'

// TIP: if you have more than a handful of tests here
// in can be beneficial to split them into multiple files for
// test speed.
describe('perimeter API', () => {
  const point = { lng: 1, lat: 1 }
  it('can create perimeter', async () => {
    const api = await apiHelper()
    const perimeterData = await api.pushPerimeterData(1, [point, point, point])

    expect(perimeterData).toBeDefined()
    expect(perimeterData[0]).toEqual(expect.objectContaining(point))
    expect(perimeterData[1]).toEqual(expect.objectContaining(point))
    expect(perimeterData[2]).toEqual(expect.objectContaining(point))
  })

  it('can get perimeters', async () => {
    const api = await apiHelper()

    const gotten = await api.getPerimeterData(1, 1)
    expect(gotten).toEqual([[point, point, point]])
  })

  it('can get gateway perimeters', async () => {
    const api = await apiHelper()

    const gotten = await api.getGatewayPerimeterData(1, 1)
    expect(gotten).toEqual({
      message: '3F800000,3F800000;3F800000,3F800000;3F800000,3F800000;'
    })
  })

  it('can update perimeters', async () => {
    const api = await apiHelper()

    await api.updatePerimeterData(1, 0, [point, point, point, point])
    const perimeterData = await api.getPerimeterData(1, 1)

    expect(perimeterData).toBeDefined()
    expect(perimeterData[0][0]).toEqual(expect.objectContaining(point))
    expect(perimeterData[0][1]).toEqual(expect.objectContaining(point))
    expect(perimeterData[0][2]).toEqual(expect.objectContaining(point))
    expect(perimeterData[0][3]).toEqual(expect.objectContaining(point))
  })
})
