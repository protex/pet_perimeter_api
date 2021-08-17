export default function createLocationStore(logger) {
  // All the data for gps coordinates
  let __locationData = {}

  // Maps devices to users
  let __deviceTable = {}

  return {
    /*
     * Function: addDevice
     * Description: Adds a device to the device table
     */
    async addDevice(deviceid, user) {
      __deviceTable = Object.assign({}, __deviceTable, { [deviceid]: user })
    },

    /*
     * Function: get
     * Description: Gets location data corresponding
     *  to a particular deviceid
     */
    async get(user, deviceid) {
      logger.debug(`Getting data for ${deviceid}`)
      if (!(deviceid in __deviceTable) && !(deviceid in __locationData)) {
        return null
      } else {
        return __locationData[deviceid]
      }
    },

    /*
     * Function: push
     * Description: Add data to a particular device
     *  and create new device if it doesn't exist
     */
    async push(deviceid, locationdata) {
      if (!(deviceid in __locationData))
        __locationData[deviceid] = [...locationdata]
      else
        __locationData[deviceid] = [
          ...locationdata,
          ...__locationData[deviceid]
        ]
      logger.debug(`Added new data`, locationdata)
      return locationdata
    }
  }
}
