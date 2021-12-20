/**
 * @Author: yangqixin
 * @TIME: 2021/12/14 15:03
 * @FILE: server.js
 * @Email: 958292256@qq.com
 * @Description:
 */
import EventBus from '../utils/EventBus'
import HttpFactory from '../api/request'

export function fetchConfig(cb) {
  const { http } = HttpFactory()
  http({
    url: './config.json'
  }).then(res => {
    cb && cb(res)
  })
}

export function subscribeMessage() {
  window.addEventListener('message', res => {
    console.log('receive message: ', res)
    const { data } = res
    const { type } = data
    switch (type) {
      case 'reset':
        EventBus.dispatch('resetHome')
        break
    }
  })
}

