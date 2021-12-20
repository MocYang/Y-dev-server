/**
 * @Author: yangqixin
 * @TIME: 2021/12/14 15:43
 * @FILE: appSlice.js
 * @Email: 958292256@qq.com
 * @Description:
 */

import { createSlice } from '@reduxjs/toolkit'

export const appSlice = createSlice({
  name: 'app',
  initialState: {
    mapConfig: null
  },
  reducers: {
    setMapConfig: (state, action) => {
      state.mapConfig = action.payload
    }
  }
})

export const {
  setMapConfig
} = appSlice.actions

export const selectMapConfig = store => store.app.mapConfig

export default appSlice.reducer
