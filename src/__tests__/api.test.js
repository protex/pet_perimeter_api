import { apiHelper } from './api-helper'

// TIP: if you have more than a handful of tests here
// in can be beneficial to split them into multiple files for
// test speed.
describe('location API', () => {
  const location = { lng: 1, lat: 1 }
  it('can create location', async () => {
    const api = await apiHelper()
    const locationData = await api.pushLocationData(1, [location])

    expect(locationData).toBeDefined()
    expect(locationData[0]).toEqual(expect.objectContaining(location))
  })

  it('can get locations', async () => {
    const api = await apiHelper()

    const gotten = await api.getLocationData(1, 1)
    expect(gotten).toEqual([location])
  })

  it('can push gateway', async () => {
    const api = await apiHelper()

    const gotten = await api.pushGateway(1, {
      message:
        '42065D79,C2C79168;42065CEA,C2C791DD;42065CA1,C2C79217;42065C30,C2C7925D;42065BB6,C2C7927F;42065B44,C2C792DD;42065AB0,C2C792DE;42065AB4,C2C7927C;42065A7E,C2C79240;42065AB3,C2C791E3;42065A8B,C2C79191;42065943,C2C79196;42065934,C2C791F1;420658B4,C2C791F1;420658C9,C2C7910E;420658BE,C2C78FAD;42065955,C2C78F98;420659F5,C2C78F99;42065B2C,C2C78F95;42065C60,C2C78FA4;42065D90,C2C78F94;'
    })
    expect(gotten).toBeDefined()
  })
})
