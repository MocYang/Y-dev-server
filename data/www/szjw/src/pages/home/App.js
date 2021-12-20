import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import MapContainer from '../../components/MapContainer'
import { fetchConfig, subscribeMessage } from '../../app/server'
import { setMapConfig } from '../../app/appSlice'
import EventBus from '../../utils/EventBus'
import { createMap } from '../../utils/map3d.util'

function App() {
  const dispatch = useDispatch()
  useEffect(() => {
    fetchConfig(config => {
      dispatch(setMapConfig(config))
    })

    // 订阅主页面的消息
    subscribeMessage()
  }, [])

  useEffect(() => {
    EventBus.on('resetHome', () => {
      const mapView = createMap.getMapView()
      mapView.ResetHome()
    })
  }, [])

  return (
    <div className="App">
      <MapContainer />
    </div>
  )
}

export default App
