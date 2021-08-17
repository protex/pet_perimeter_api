export default function createPerimeterStore(logger) {
  // Perimeters defined for particular devices
  let __perimeters = {}

  return {
    /*
     * Function: get
     * Description: Gets location data corresponding
     *  to a particular deviceid
     */
    async get(user, deviceid) {
      logger.debug(`Getting data for ${deviceid}`)
      if (!(deviceid in __perimeters)) {
        return null
      } else {
        return __perimeters[deviceid]
      }
    },

    /*
     * Function: push
     * Description: Add data to a particular device
     *  and create new device if it doesn't exist
     */
    async push(deviceid, perimeter) {
      logger.debug(JSON.stringify(perimeter, null, 2))
      if (!(deviceid in __perimeters)) __perimeters[deviceid] = [[...perimeter]]
      else {
        __perimeters[deviceid] = [...__perimeters[deviceid], [...perimeter]]
        logger.debug(`Added new data`, perimeter)
      }
      return perimeter
    },

    async update(deviceid, perimeterNumber, perimeter) {
      if (!(deviceid in __perimeters)) return null
      else if (perimeterNumber > __perimeters[deviceid].length - 1) return null
      else {
        __perimeters[deviceid][perimeterNumber] = [...perimeter]
        logger.debug(
          `Added updated perimeter ${perimeterNumber} for device ${deviceid} with:`,
          perimeter
        )
      }
      return perimeter
    }
  }
}
