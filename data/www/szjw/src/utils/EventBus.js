/**
 * @Author: MocYang
 * @Email: 958292256@qq.com
 * @Date: 2021/7/20 9:18
 * @File: EventBus.js
 * @Description
 */

class EventsBus {
  constructor() {
    this.events = new Map()
  }

  _add(key, fn, isOnce, ...args) {
    const m = this.events.get(key)

    const fnMap = m ? m : this.events.set(key, new Map()).get(key)

    fnMap.set(key, (...args1) => {
      fn(...[...args, ...args1].flat())
      isOnce && this.off(key, fn)
    })
  }

  /**
   * 注册一个事件
   * @param key 事件对应的key，应该唯一
   * @param fn 事件触发时的回调
   * @param args 需要传给回调的参数
   */
  on(key, fn, ...args) {
    if (!fn) {
      console.error('No callback for key: ', key)
      return
    }
    this._add(key, fn, false, args)
  }

  off(key, fn) {
    const fnMap = this.events.get(key)
    console.log(key)
    if (fnMap) {
      fnMap.delete(fn)
    }
  }

  /**
   * 触发对应的事件回调
   * @param key
   * @param args
   */
  dispatch(key, ...args) {
    const fnMap = this.events.get(key)
    if (!fnMap) {
      console.error('No callback for key: ', key)
      return
    }
    for (let [, cb] of fnMap.entries()) {
      cb(...args)
    }
  }

  once(key, fn, ...args) {
    this._add(key, fn, true, ...args)
  }
}

export default new EventsBus()