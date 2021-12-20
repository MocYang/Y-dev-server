import { createServer } from 'miragejs'
import { urlNoMock, addressConfig } from './config' // 不想被 migrate 拦截的请求

export function makeServer({ environment }) {
  createServer({
    environment,

    routes() {
      // this.namespace = '/fake'
      this.timing = 1000

      /**
       * mockAPI可以像这样，在下面添加路由配置, 这样，实际的请求路径为：/fake/api/xxx/xxx。
       * 也就是，所有带 `/fake`前缀的请求，都将走 migratejs 的 mock 服务。其它没有这个前缀的。走正常请求
       * this.get('/api/xxx/xxx',(schema, request) => {
       *   return {
       *     "code": 1,
       *     "msg": "success",
       *     "data": []
       *   }
       * })
       */

      this.get(addressConfig.getXXX, (schema, request) => {
        return {
          code: 0,
          msg: 'success',
          data: 0
        }
      })

      /**
       * 参考： https://miragejs.com/api/classes/server/#passthrough
       */
      this.passthrough(urlNoMock + '/**', (req) => {
        // 以下方法调用为必须。目的是把透过 miragejs 的请求，响应之后，传回 axios 本身
        req.onload = (e) => {
          req.onloadend && req.onloadend()
        }
      })
    }
  })
}
