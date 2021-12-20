import axios from "axios";
import EventsBus from "./EventBus";

var createObj = null;
var Polygon = null;
var paopao = []; //气泡gid
//创建地图类

let mapView = null

export const createMap = {

  formatValue(value) {
    return value ? parseInt(value) : 0;
  },
  getMapView() {
    return mapView
  },

  // 重置地图视角
  resetMapViewPort(map, frame = 5) {
    const homePosition = {
      "x": 0,
      "y": 0,
      "z": 0,
      "pitch": 0,
      "yaw": -90,
      "roll": 0,
    }
    map.FlyToPosition(homePosition, false, frame)
  },

  initialSuccess() {
    return mapView && mapView.__success__
  },

  destroyMapView() {
    mapView = null
  },

  //地面显示隐藏
  showDM(groundVisible, view3d) {
    groundVisible = !groundVisible;
    view3d.SetGroundVisible(groundVisible);
  },

  init(options, callback) {
    if (createMap.getMapView()) {
      console.log('Call createMap.createMap again. But mapView already init.')
      return
    }

    //创建实例
    /* global MapVision */
    var view3d = new MapVision.View3d({
      id: options.id,
      url: options.url,
      projectId: options.projectId,
      token: options.token
    });
    view3d.Open(res => {
      // SetResolution(options, view3d)
      createObj = null;
      // 这里在成功回调里绑定到本地的mapview。以供页面使用
      mapView = view3d
      mapView.__success__ = true

      setTimeout(() => {
        SetResolution(options, view3d)
      }, 0)

      setTimeout(() => {
        view3d.SetNorthControl(false);
        callback && callback()
      }, 0)

      // 配置一下全屏地图下，按F5也可以刷新页面
      window.addEventListener('keydown', function (e) {
        if (e.code === 'F5') {
          window.location.reload()
        }
      })

      window.addEventListener('resize', (e) => {
        SetResolution(options, view3d)
      })
    })
    return view3d;
  },

  closeAll(view3d) {
    view3d.OverLayerRemoveAll();
  },

  //设置屏幕
  SetResolution(id, view3d) {
    if (view3d) {
      var divObj = document.getElementById(id);
      if (!divObj) {
        alert("error");
        return;
      }
      var width = divObj.clientWidth;
      var height = divObj.clientHeight;
      view3d.SetResolution(width, height);
    }
  },

  // 获取当前视角位置
  getCurrent(view3d, callback) {
    view3d.GetCurrentPosition(pos => {
      var strPos = JSON.stringify(pos);
      callback(strPos)
    })
  },

  flyToLiuzhiqu(map, position, callback) {
    // 点位到留置区，从首页点击进入留置区，和留置区1,2层点击退出留置区右回到这个点位
    map.FlyToPosition(position)

    setTimeout(() => {
      // Model.getModel(map)
    }, 1000)
  },

  // 点击获取坐标值
  getMousePosition(view3d, callback) {
    view3d.SetMousePositionCallback(res => {
      let data = {
        switchName: 'MousePosition',
        Personnel: res
      }
      window.parent.postMessage(data, '*');
      if (callback) {
        callback(res)
      }
    });
  },

  //返回初始位置
  initialPosition(view3d) {
    if (view3d) {
      view3d.ResetHome();
    }
  },

  eanbleKeyboard(view3d) {
    if (view3d) {
      view3d.enableKeyboard = false;
      view3d.enableMouse = true;
    }
  },

  //飞到位置点
  FlyToPosition(view3d, pos) {
    view3d.FlyToPosition(pos);
  },

  flawto(view3d, location) {
    const pos = {
      x: location.x,
      y: location.y,
      z: location.z,
      pitch: 0, // 俯仰角 0——90度
      yaw: location.yaw, // 偏航角 0-360度
      roll: 0 // 翻滚角
    };

    view3d.FlyToPosition(pos);
  },

  // 根据id查找对象
  findObjectById(view3d, gid, callback) {
    // 注意,此功能为异步操作
    // FindObjectByName  同  FindObjectById  一样功能
    view3d.FindObjectById(gid, res => {
      if (callback) {
        callback(res);
      }
    });
  },

  // 删除所有外壳炫光----呼和浩特定制
  closeWkWang(view3d) {
    for (let i = 0; i <= 22; i++) {
      Model.showModel(view3d, "FW_V001_JZ00" + (i < 10 ? "0" + i : i) + "_WK", false);
    }
  },

  // closeWkWangTwo(view3d) {
  //     console.log("111")
  //     Model.showModel(view3d, "FW_V001_JZ0001_WK", false);
  // }

  /**
   * 播放动画序列
   * @param view3d
   * @param id
   */
  playSequence(view3d, id) {

    if (view3d.PlaySequence) {
      view3d.PlaySequence(id)
    }
  },

  /**
   * 暂停动画序列
   * @param view3d
   * @param id
   */
  pauseSequence(view3d, id) {
    if (view3d.PauseSequence) {
      view3d.PauseSequence(id)
    }
  },

  /**
   * 停止动画序列
   * @param view3d
   * @param id
   */
  StopSequence(view3d, id) {
    if (view3d.StopSequence) {
      view3d.StopSequence(id)
    }
  },

  /**
   * 判断是否播放中
   * @param view3d
   * @param id
   */
  isPlayingSequence(view3d, id, cb) {
    if (view3d.IsPlayingSequence) {
      view3d.IsPlayingSequence(id, (res) => {

        cb && cb(res)
      })
    }
  },

  /**
   * 判断是否暂停中
   * @param view3d
   * @param id
   */
  isPausedSequence(view3d, id) {
    if (view3d.IsPausedSequence) {
      view3d.IsPausedSequence(id, res => {

      })
    }
  }
}
//模型标注类
export const Model = {
  //创建模型
  creatmodel(view3d, videoType, callback) {
    var obj = {
      type: 'model',
      filename: videoType.fileName, // box, capsule, cone, cube, cylinder, pipe, pyramid, sphere, capsule
      radius: 1,
      scale: 1,
      attr: videoType.attr
    }
    view3d.OverLayerStartEdit(obj, res => {
      var strObj = JSON.stringify(res);
      createObj = res;
      // var myDate = new Date()
      view3d.OverLayerStopEdit();
      // return strObj
      callback(strObj)
    });
  },
  //关闭编辑
  endEditing(view3d) {
    view3d.OverLayerStopEdit();
  },
  // 删除圆
  closeCircle(view3d) {
    var types = [10302];
    view3d.OverLayerRemoveAll(types);
  },
  // 绘制折线
  drawLine(view3d, callback) {
    const obj = {
      type: 'linestring',
      color: '#ff0f00',
      points: []
    };
    view3d.OverLayerStartEdit(obj, res => {
      if (callback) {
        callback(res);
      }
    });
  },
  // 删除折线
  closeLine(view3d) {
    var types = [10200];
    view3d.OverLayerRemoveAll(types);
  },
  //修改坐标
  modify(view3d, locations) {
    if (!createObj) {
      // alert("请先创建对象！");
      return;
    }
    var location = {
      x: locations.x,
      y: locations.y,
      z: locations.z,
      pitch: 0,
      yaw: locations.yaw,
      roll: 0
    }
    createObj.location = location
    view3d.OverLayerUpdateObject(createObj);
  },
  //删除所有模型
  allmove(view3d) {
    view3d.OverLayerRemoveAll();
    // view3d.Clear()
    // createObj = null;
    // view3d.OverLayerStopEdit();
  },
  //加载模型
  modelLoading(view3d, strObj, callback) {
    if (!view3d) {
      return
    }
    var obj = {
      gid: strObj.gid,
      type: strObj.type || 'model',
      filename: strObj.filename, // box, capsule, cone, cube, cylinder, pipe, pyramid, sphere, capsule
      radius: 1,
      scale: strObj.scale || 1,
      attr: strObj.attr,
      location: {
        x: strObj.location.x,
        y: strObj.location.y,
        z: strObj.location.z,
        pitch: strObj.pitch || 0,
        yaw: strObj.location.yaw,
        roll: strObj.roll || 0
      }
    }
    // 注意,此功能为异步操作
    view3d.OverLayerCreateObject(obj, res => {
      // view3d.SetMouseCallback(null);
      // console.log('model load success: ', JSON.stringify(res))
      callback && callback(res)
    });
  },

  createPersonModelConfig(strObj) {
    return {
      gid: strObj.gid,
      type: strObj.type || 'model',
      filename: strObj.filename || 'person',
      radius: 1,
      scale: strObj.scale || 1,
      attr: strObj.attr,
      play: true,
      location: {
        x: strObj.location.x,
        y: strObj.location.y,
        z: strObj.location.z,
        pitch: strObj.pitch || 0,
        yaw: strObj.location.yaw,
        roll: strObj.roll || 0
      }
    }
  },

  // 同步，添加人物模型
  addPersonModelSync(map, data, callback) {
    const addModel = (data, index) => {
      console.log('正在添加第：', index, '个模型。')
      if (index >= data.length) {
        console.log('人物模型加载完毕')
        callback && callback()
        return
      }
      const item = data[index]
      map.OverLayerCreateObject(Model.createPersonModelConfig(item), (res) => {
        console.log('人物模型已添加：', res)
        setTimeout(() => {
          addModel(data, ++index)
        }, 10)
      })
    }
    addModel(data, 0)
  },

  //加载标注
  labelLoading(view3d, strObj, callback) {
    let obj = {
      type: 'label',
      text: strObj.text,
      font: '黑体',
      fontcolor: strObj.fontcolor,
      fontsize: strObj.fontsize,
      halign: 'left', // left center right
      valign: 'top', // bottom center top
      location: strObj.location,
      attr: strObj.attr ? strObj.attr : {}
    };
    if (strObj.gid) {
      obj["gid"] = strObj.gid;
    }
    view3d.OverLayerCreateObject(obj, res => {
      //  view3d.SetMouseCallback(null);
      if (callback) {
        callback(res);
      }
    });
  },
  //删除当前模型对象
  delectObj(view3d) {
    view3d.OverLayerRemoveObject(createObj);
    createObj = null;
    view3d.OverLayerStopEdit();
  },
  //创建文本模型
  LabelModel(view3d, strObj, callback) {
    const obj = {
      type: 'label',
      text: strObj.text,
      font: '黑体',
      fontcolor: strObj.color,
      fontsize: strObj.size,
      halign: 'left', // left center right
      valign: 'top' // bottom center top
    };
    view3d.OverLayerStartEdit(obj, res => {
      var strObj = JSON.stringify(res);
      view3d.OverLayerStopEdit();
      if (callback) {
        callback(strObj);
      }
    });
  },
  // 编辑文本模型
  updeteLabelModel(view3d, obj) {
    view3d.OverLayerUpdateObject(obj);
  },
  //绘制面
  playPolygon(view3d, callback) {
    const obj = {
      type: 'polygon',
      color: '#00ff00',
      points: []
    };
    view3d.OverLayerStartEdit(obj, res => {
      var strObj = JSON.stringify(res);
      Polygon = res;
      view3d.OverLayerStopEdit();
      if (callback) {
        callback(strObj);
      }
    });
  },
  //创建面
  createPolygon(view3d, point, callback, Color, style) {
    if (!view3d) {
      return
    }
    // 注意,此功能为异步操作
    const obj = {
      type: 'polygon',
      style: style ? style : "",
      color: Color ? Color : '#00ff00',
      points: point
    };
    view3d.OverLayerCreateObject(obj, res => {
      // view3d.SetMouseCallback(null);
      createObj = res;
      var strObj = JSON.stringify(createObj);
      callback && callback(strObj)
    });
  },
  // 创建折线
  createZheLine(view3d, points, callback) {
    const obj = {
      type: 'linestring',
      style: 'red',
      linewidth: 20.0,
      points: points
    };
    view3d.OverLayerCreateObject(obj, res => {
      if (callback) {
        callback(res);
      }
    });
  },
  // 创建线柱子
  createLine(view3d, gid, points, text, fontsize, fontcolor, radius, height) {
    // const obj = {
    //     type: 'linestring',
    //     style: 'SplineOrangeHighlight',
    //     linewidth: 20.0,
    //     points: [points,
    //         {
    //             ...points,
    //             y: points.y + 1,
    //             z: points.z + 2500
    //         }
    //     ]
    // };
    const obj = {
      gid: "BjX_" + gid,
      type: 'cylinder',
      radius: radius ? radius : 100.0, // 半径
      height: height ? height : 3000.0, // 高
      style: 'SplineOrangeHighlight', // style 样式优先于color
      location: {
        x: points.x,
        y: points.y,
        z: points.z,
        pitch: 0, // 俯仰角 0——90度
        yaw: 0, // 偏航角 0-360度
        roll: 0 // 翻滚角
      }
    };
    view3d.OverLayerCreateObject(obj, res => {
      Model.labelLoading(view3d, {
        gid: "BjZ_" + gid,
        text: text,
        fontcolor: fontcolor ? fontcolor : "#ff0000",
        fontsize: fontsize ? fontsize : "200",
        location: {
          x: points.x,
          y: points.y + 100,
          z: Number(points.z) + height ? height + 1000 : 4000,
          pitch: -90
        }
      })
    });
  },
  // 创建报警线
  createLineBj(view3d, gid, points, text, fontsize, fontcolor) {
    // let point = Model.calculateCenterPoint(points);
    Model.createLine(view3d, gid, points, text, fontsize, fontcolor)
  },
  // 圆柱和文字
  closeLineAndText(view3d) {
    var types = [10101, 10327];
    view3d.OverLayerRemoveAll(types);
  },
  // 计算中心点公式
  calculateCenterPoint(points) {
    var area = 0.0 // 多边形面积
    var gravityLat = 0.0 // 重心点 latitude
    var gravityLng = 0.0 // 重心点 longitude
    for (let i = 0; i < points.length; i++) {
      let coordinate = points[i];
      // 1
      let lat = coordinate.x
      let lng = coordinate.y
      let nextLat = points[(i + 1) % points.length].x
      let nextLng = points[(i + 1) % points.length].y
      // 2
      let tempArea = (nextLat * lng - nextLng * lat) / 2.0
      // 3
      area += tempArea
      // 4
      gravityLat += tempArea * (lat + nextLat) / 3
      gravityLng += tempArea * (lng + nextLng) / 3
    }
    // 5
    gravityLat = gravityLat / area
    gravityLng = gravityLng / area
    return {
      x: gravityLat,
      y: gravityLng,
      z: points[0].z
    }
  },
  // 报警材质区域面
  createPolygonBj(view3d, point, style) {
    let pointArr = [...point, point[0]];
    (function loop() {
      let G1 = {
        "x": pointArr[0].x,
        "y": pointArr[0].y,
        "z": pointArr[0].z + 5000
      };
      let G2 = {
        "x": pointArr[1].x,
        "y": pointArr[1].y,
        "z": pointArr[1].z + 5000
      };
      let pointArrBj = [pointArr[0], G1, G2, pointArr[1]];
      Model.createPolygon(view3d, pointArrBj, res => {
        pointArr.splice(0, 1);
        if (pointArr.length > 1) {
          loop();
        }
      }, "", style)
    }())
  },
  // 绘制多边形
  playPolygon2(view3d, item, callback) {
    const obj = {
      type: 'polygon',
      color: item.color,
      points: []
    };

    view3d.OverLayerStartEdit(obj, res => {
      var strObj = JSON.stringify(res);
      Polygon = res;
      // console.log(Polygon, strObj);
      view3d.OverLayerStopEdit();
      if (callback) {
        callback(strObj);
      }
    });
  },
  //删除面
  delectPolygon(view3d) {
    if (!Polygon) {
      // alert("请先创建对象！");
      return;
    }

    view3d.OverLayerRemoveObject(Polygon);
    Polygon = null;
    view3d.OverLayerStopEdit();
  },
  // 删除单个覆盖物
  delectMulch(view3d, selObj) {
    if (!selObj) {
      // alert("请先创建/选择对象！");
      return;
    }
    // alert("删除对象：" + selObj.gid);
    view3d.OverLayerRemoveObjectById(selObj.gid);
    // view3d.OverLayerRemoveObject(selObj);
    selObj = null;
  },

  removeGid(view3d, gid) {
    view3d.OverLayerRemoveObjectById(gid);
  },
  // 显示隐藏模型
  showModel(view3d, id, flag) {
    if (!view3d) {
      return
    }
    view3d.UpdateObjectVisible(id, flag);
  },
  //点击获取当前模型信息
  getModel(view3d) {
    // view3d.SetMouseCallback(null)
    if (!view3d) {
      return
    }
    // 过滤 对象  prefix 对象名称前缀   ，path 路径前缀
    var paramers = {
      prefix: 'V001,CAMERA,PIC,n,m,w,PERSON,TEMP',
      // prefix: '*',
      path: '',
      speedroute: 10
    }
    view3d.SetParameters(paramers);
    view3d.SetMouseCallback(res => {
      console.log(res)
      const gid = (res && res.gid) || ''
      if (gid && gid.startsWith('CAMERA')) {
        view3d.Stop();
        EventsBus.dispatch('onCameraClick', res)
      }

      // 人员图标
      if (gid && gid.startsWith('PIC_')) {
        view3d.Stop();
        EventsBus.dispatch('onFloorIconClick', res)
      }

      // 广告版图标
      if (gid && gid.startsWith('PERSON_')) {
        view3d.Stop();
        EventsBus.dispatch('onFloorIconClick', res)
      }

      // 点击了建筑
      if (gid.startsWith('V001') && !gid.startsWith('V001_JZ0001_WK_F')) {
        EventsBus.dispatch('onBuildingClick', res)
      }

      // 点击了房间
      if (gid.startsWith('V001_JZ0001_WK_F') || gid.startsWith('V001_JZ0002_WK_F')) {
        EventsBus.dispatch('onRoomClick', res)
      }

      // 点击了医护人员,有两个,GID分别为: N_Anim_51, NAN_Anim_60
      if (gid.startsWith('nan') || gid.startsWith('nv')) {
        EventsBus.dispatch('onMedicalPersonClick', res)
      }

      setTimeout(() => {
        Model.getModel(view3d)
      }, 20)
    })
  },

  // 添加某个前缀的点击事件
  setMouseCallback(map, prefix) {
    var paramers = {
      prefix,
      path: '',
      speedroute: 10
    }
    map.SetParameters(paramers)
    map.SetMouseCallback(res => {
      console.log(res)
    })
  },

  // 修改模型高亮颜色
  updateModelStyle(view3d, gid, style) {
    view3d.UpdateObjectStyle(gid, style);
  },
  // 修改面
  updatePolygon(view3d, obj, style, color) {
    obj.style = style && style !== "" ? style : null;
    obj.color = color ? color : '#00ff00';
    view3d.OverLayerUpdateObject(obj);
  },
  // 创建图标
  createIcon(view3d, style, callback) {
    if (!view3d) {
      return
    }
    // 注意,此功能为异步操作
    const obj = {
      ...style,
      type: 'image', // 10102  或  image
      style: style.typeStyle,
      scale: 2,
      location: {
        x: style.location.x,
        y: style.location.y,
        z: style.location.z,
        pitch: style.location.pitch, // 俯仰角 0——90度
        yaw: style.location.yaw, // 偏航角 0-360度
        roll: style.location.roll // 翻滚角
      },
      attr: style.attr
    };
    view3d.OverLayerCreateObject(obj, res => {
      // console.log(res);
      createObj = res;
      // var strObj = JSON.stringify(createObj);
      // console.log(strObj);
      callback && callback(res)
    });
  },
  createIconTwo(view3d, style, callback) {
    // 注意,此功能为异步操作
    const obj = {
      type: 'image', // 10102  或  image
      style: style.typeStyle,
      scale: 1,
      gid: style.gid,
      location: {
        x: style.location.x,
        y: style.location.y,
        z: style.location.z,
        pitch: style.location.pitch, // 俯仰角 0——90度
        yaw: style.location.yaw, // 偏航角 0-360度
        roll: style.location.roll // 翻滚角
      }
    };
    view3d.OverLayerCreateObject(obj, res => {
      // console.log(res);
      if (callback) {
        callback(res)
      }
    });
  },
  // 图标清除
  closeIcon(view3d) {
    if (view3d) {
      var types = [10102];
      view3d.OverLayerRemoveAll(types);
    }
  },
  // 泡泡清除
  closeAllPaopao(view3d) {
    if (paopao.length > 0) {
      paopao.forEach(item => {
        Model.removeGid(view3d, item)
      });
      paopao = [];
    }
  },

  createBillBoardConfig(data) {
    const position = data.positions.points
    return {
      gid: 'PERSON_' + data.id,
      attr: {
        id: data.id
      },
      type: 'webbrowser',
      style: 'white',
      url: data.url,
      screen: true, //
      scale: 1, // 缩放比例
      width: data.width || 280, // 宽度（厘米）
      height: data.height || 180, // 高度（厘米）
      // pwidth: data.pwidth || 100, // 立柱的宽度（厘米）
      // pheight: data.pheight || 200, // 立柱的高度（厘米）
      location: {
        x: createMap.formatValue(Model.calculateCenterPoint(position).x),
        y: createMap.formatValue(Model.calculateCenterPoint(position).y) + 120,
        z: createMap.formatValue(Model.calculateCenterPoint(position).z) - 100,
        pitch: 0,
        yaw: 0,
        roll: 0
      }
    }
  },

  // 创建广告牌气泡窗口
  createBillboardBubble(view3d, style) {
    const obj = {
      type: 'webbrowser',
      style: 'white',
      url: style.url,
      billborad: false, // 是否公告板,跟随屏幕旋转
      scale: 1.0, // 缩放比例
      width: style.width, // 宽度（厘米）
      height: style.height, // 高度（厘米）
      pwidth: style.pwidth, // 立柱的宽度（厘米）
      pheight: style.pheight, // 立柱的高度（厘米）
      location: {
        x: style.location.x,
        y: style.location.y,
        z: style.location.z + 100,
        pitch: style.location.pitch, // 俯仰角 0——90度
        yaw: style.location.yaw, // 偏航角 0-360度
        roll: style.location.roll // 翻滚角
      }
    }

    view3d.OverLayerCreateObject(obj, res => {
      paopao.push(res.gid)
    });
  },
  // 创建圆
  creatCircle(view3d, style, callback) {
    // 注意,此功能为异步操作
    const obj = {
      type: 'circle',
      radius: style.radius ? style.radius : 100, // 半径
      // style : 'red',
      color: style.color ? style.color : '#FF0000',
      location: style.location
    };
    view3d.OverLayerCreateObject(obj, res => {
      if (callback) {
        callback(res);
      }
    });
  },

  // 递归的更新模型
  // 批量更新有问题。或者直接导致与地图的链接失败。或者更新丢失。这里先用同步单点更新
  updateObjectsVisibleSync(map, objects, size = 20, callback) {
    const objectsSize = objects.length

    for (let i = 0; i < objectsSize; i++) {
      const item = objects[i]
      setTimeout(() => {
        map.UpdateObjectVisible(item.gid, item.visible)
      }, 20)
    }
  },

  // 生成房间图标模型的配置项
  createFloorRoomIconConfig(room) {
    const position = room.positions.points
    return {
      attr: room,
      type: 'model',
      filename: 'TB_Plane3',
      gid: `PIC_${room.room_code}`,
      scale: 2,
      onMouse: true,
      // visible: room.visible || true,
      location: {
        x: createMap.formatValue(Model.calculateCenterPoint(position).x),
        y: createMap.formatValue(Model.calculateCenterPoint(position).y) + 100,
        z: createMap.formatValue(Model.calculateCenterPoint(position).z) - 80,
        pitch: 0,
        yaw: 0,
        roll: 0
      }
    }
  },

  // 生成圆柱
  createCYLinderConfig(data) {
    const position = data.positions.points
    return {
      attr: data,
      // type: 'cylinder',
      type: 'model',
      filename: 'cylinder',
      // filename: 'box',
      radius: 10000,
      height: 80,
      // opacity: 0,
      gid: `PIC_${data.room_code}`,
      location: {
        x: createMap.formatValue(Model.calculateCenterPoint(position).x),
        y: createMap.formatValue(Model.calculateCenterPoint(position).y) + 40,
        z: createMap.formatValue(Model.calculateCenterPoint(position).z),
        pitch: 0,
        yaw: 0,
        roll: 0
      }
    }
  },

  createIconSource(source, withPostfix = true, prefix = 'ICON_') {
    return source.map(data => ({
      ...data,
      gid: prefix + data.model_url,
      style: data.model_name + (withPostfix ? '_icon' : '')
    }))
  },

  // 相机图片图标
  createCameraImageConfig(data) {
    let position = data.list_style ? data.list_style : data.center
    return {
      attr: {
        id: data.id
      },
      screen: false,
      gid: data.gid,
      type: 'image', // 10102  或  image
      style: 'xiangji',
      scale: 1,
      // name: data.name || '',
      location: {
        x: position.x,
        y: position.y,
        z: position.z,
        pitch: position.pitch,
        yaw: position.yaw,
        roll: position.roll
      }
    }
  },

  // 生成相机模型的配置项
  createCameraModelConfig(camera) {
    const position = camera.list_style ? camera.list_style : camera.center
    return {
      gid: `CAMERA_${camera.model_url}`,
      type: 'model',
      // filename: camera.model_name,
      filename: 'qiangji',
      radius: 1,
      // scale: 1,
      scale: camera.scale || 1.5,
      attr: camera.attr || camera,
      onMouse: true,
      // visible: camera.visible || true,
      location: {
        x: position.x,
        y: position.y,
        z: position.z,
        pitch: position.pitch,
        yaw: position.yaw,
        roll: position.roll
      }
    }
  },

  /**
   * 批量添加模型
   * @param mapV   {Object}
   * @param source {Array}
   * @param size  {Number} 每次最多添加10个。不能再多。多了数据传输会失败。
   * @param cb    {Function}
   */
  batchedAddModel(mapV, source, size = 10, cb) {
    if (!Array.isArray(source)) {
      return
    }
    const sourceSize = source.length
    const addModel = (startOffset, endOffset = 0) => {
      const sourceSlice = source.slice(startOffset, endOffset)
      if (startOffset > sourceSize - 1) {
        setTimeout(() => {
          cb && cb()
        }, 0)
        return
      }

      // 注意,此功能为异步操作
      mapV.OverLayerCreateObjects(sourceSlice, res => {
        if (startOffset < sourceSize) {
          setTimeout(() => {
            addModel(endOffset, endOffset + size)
          }, size || 0)
        }
      })
    }

    addModel(0, size)
  },

  // 单个，递归的添加模型
  addModelSync(map, source, cb) {
    const size = source.length
    const addModel = (index) => {
      if (index >= size) {
        cb && cb()
        return
      }
      const model = source[index]
      map.OverLayerCreateObject(model, res => {
        console.log('add model success: ', index, '/', size)
        setTimeout(() => {
          addModel(++index)
        }, 20)
      })
    }

    addModel(0)
  },

  showModels(map, modelList) {
    if (map) {
      modelList.forEach(model => {
        map.UpdateObjectVisible(model.gid, true)
      })
    }
  },

  hideModels(map, modelList) {
    if (map) {
      modelList.forEach(model => {
        map.UpdateObjectVisible(model.gid, false)
      })
    }
  },

  batchUpdateModel(map, modelList) {
    if (map) {
      modelList.forEach(model => {
        map.OverLayerUpdateObject(model)
      })
    }
  },

  batchUpdateModelVisible(map, modelList) {
    if (map) {
      modelList.forEach(model => {
        map.UpdateObjectVisible(model.gid, model.visible)
      })
    }
  },

  batchRemoveModel(map, modelList) {
    if (map) {
      modelList.forEach(model => {
        map.OverLayerRemoveObjectById(model.gid)
      })
    }
  }
}
// 建筑楼层类
export const Build = {
  getBuild(view3d, callback) {
    view3d.GetBuildingNames(res => {
      var strObj = JSON.stringify(res);
      callback(strObj)
    });
  },
  getFloor(view3d, buildingName, callback) {
    view3d.GetFloorNames(buildingName, res => {
      var strObj = JSON.stringify(res);
      callback(strObj)
    });
  },

  // 楼层显示隐藏
  showFloor(view3d, buildingName, floorName, floor) {
    if (!view3d) {
      return
    }
    let floorNum = Number(floorName.slice(-1));
    view3d.SetBuildingVisible(buildingName, floorName === "all" ? true : false);
    floor.forEach((item, index) => {
      let FNum = Number(item.slice(-1));
      // if (FNum > floorNum) {
      console.log(buildingName, item)
      if (FNum !== floorNum) {
        view3d.SetFloorVisible(buildingName, item, false);
      } else {
        view3d.SetFloorVisible(buildingName, item, true);
      }
    })
  },

  // 显示当前建筑内的所有楼层
  showAllFloor(map, buildingName) {

  },

  // 整个建筑显示隐藏
  allShow(view3d, buildVisible) {
    if (!view3d) {
      return
    }
    Build.getBuild(view3d, res => {
      JSON.parse(res).forEach(item => {
        view3d.SetBuildingVisible(item.id, buildVisible);
      })
      view3d._command = 100107
      createMap.closeWkWang(view3d)
    })
  },
  showAllBuilding() {
    const mapView = createMap.getMapView()
    if (mapView) {
      mapView.GetBuildingNames(buildings => {
        buildings.forEach(build => {
          mapView.SetBuildingVisible(build.id, true)
        })
      })
    }
  }
}
// 功能块
export const Event = {
  // 获取路网
  LwList: [],
  getLuWang(view3d, data, routeData, project, url, floorHeight) {
    let Luwang = data;
    if (Luwang.length < 2) {
      return;
    }
    let json = {
      "end": {
        "floor": Luwang[1].floor,
        "id": 0,
        "x": Luwang[1].x / 100,
        "y": Luwang[1].y / 100,
        "z": Luwang[1].z / 100
      },
      "project": project,
      "start": {
        "floor": Luwang[0].floor,
        "id": 0,
        "x": Luwang[0].x / 100,
        "y": Luwang[0].y / 100,
        "z": Luwang[0].z / 100
      }
    }
    axios.post(url, json).then(res => {
      if (res.data.msg === "OK") {
        let list = res.data.data;
        list.forEach(msg => {
          let z = Number(msg.floor.slice(-1)) * floorHeight;
          let obj = {
            ...msg,
            x: Number(msg.x) + 120,
            y: Number(msg.y) - 150,
            z: z
          };
          Event.LwList.push(obj);
        });
        Luwang.splice(0, 1);
        if (Luwang.length > 1) {
          Event.getLuWang(view3d, Luwang, routeData, project, url, floorHeight);
        } else {
          let routedata = {
            ...routeData,
            geom: Event.LwList.slice(1, Event.LwList.length - 1)
          };
          console.log(routedata, "routeData")
          view3d.CreateRoute(routedata);
        }
      }
    })
  },
  // 创建路线
  createRoute(view3d, routeData, flag, project, url, floorHeight) {
    Event.LwList = [];
    if (flag) {
      Event.getLuWang(view3d, routeData.geom, routeData, project, url, floorHeight)
    } else {
      view3d.CreateRoute(routeData);
    }
  },
  // 开始迅游
  playPatrolPath(view3d, callback) {
    view3d.PlayRoute(res => {
      // 返回播放结束节点的位置和索引
      if (callback) {
        callback(res);
      }
    });
  },
  // 继续播放
  continuePatrolPath(view3d) {
    view3d.ResumeRoute();
  },
  // 暂停播放
  pausePatrolPath(view3d) {
    view3d.PauseRoute();
  },
  // 停止播放
  stopPatrolPath(view3d) {
    view3d.StopRoute();
  },
  // 路径迅游清除
  clearPatrolPath(view3d) {
    view3d.Clear();
  },
  // 动画暂停
  stopMan(view3d) {
    // view3d.Stop();
  },
  // 点线追查
  pointTracing(view3d, pointPosition, callback) {
    const json = {
      radius: 100, // 半径
      color: '#FF0000',
      location: pointPosition
    };
    Model.creatCircle(view3d, json, msg => {
      createMap.getMousePosition(view3d);
      if (callback) {
        callback(msg);
      }
    })
  },
  pointLineTracing(view3d, pointPosition) {

    // if (pointPosition.length > 1) {
    //     const points = pointPosition
    //     Model.createZheLine(view3d, points, msg => {
    //         createMap.getMousePosition(view3d)
    //     });
    // }
  }
}

//设置屏幕
function SetResolution(options, view3d) {
  if (view3d) {
    var divObj = document.getElementById(options.id);
    if (!divObj) {
      alert("error");
      return;
    }
    var width = divObj.clientWidth;
    var height = divObj.clientHeight;
    console.log('屏幕宽度：', width)
    console.log('屏幕高度：', height)
    view3d.SetResolution(width, height);

    setTimeout(() => {
      Model.getModel(view3d);
    }, 10)
  }
}
