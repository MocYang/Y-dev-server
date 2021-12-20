/**
 * @Author: yangqixin
 * @TIME: 2021/12/14 15:00
 * @FILE: index.js
 * @Email: 958292256@qq.com
 * @Description:
 */

import { useEffect } from 'react'
import { createMap, Build } from '../../utils/map3d.util'
import { useSelector } from 'react-redux'
import { selectMapConfig } from '../../app/appSlice'

function MapContainer() {
  const mapConfig = useSelector(selectMapConfig)
  useEffect(() => {
    console.log(mapConfig)
    if (mapConfig) {
      createMap.init({
        id: 'mapVision3d',
        url: mapConfig.mapUrl,
        projectId: mapConfig.projectId,
        token: mapConfig.token
      }, () => {
        const mapView = createMap.getMapView()

        mapView.ResetHome()

        Build.showAllBuilding()
      })
    }

  }, [mapConfig])

  return (
    <div id="mapVision3d" />
  )
}

export default MapContainer
