<template>
  <mu-paper class="v_block wrap" :z-depth="1" v-if="dataMsg">
    <div class="name">工单信息</div>
    <div class="content-text">
      <div class="msg-item">
        <span class="left-msg">类别</span>
        <span class="right-msg">{{dataMsg.roomName+'-'+dataMsg.bigName+'-'+dataMsg.smallName}}</span>
      </div>
      <div class="msg-item">
        <span class="left-msg">报修时间</span>
        <span class="right-msg">{{dataMsg.startTime}}</span>
      </div>
      <div class="msg-item">
        <span class="left-msg">工单状态</span>
        <span class="right-msg orange">{{setStatusName(dataMsg.status)}}</span>
      </div>
      <div class="msg-item">
        <span class="left-msg">联系人</span>
        <span class="right-msg">{{dataMsg.name}}</span>
      </div>
      <div class="msg-item">
        <span class="left-msg">电话</span>
        <span class="right-msg">{{dataMsg.mobile}}</span>
      </div>
      <div class="msg-item">
        <span class="left-msg">位置</span>
        <span class="right-msg">{{dataMsg.houseName+'-'+dataMsg.roomName}}</span>
      </div>
    </div>
    <div class="desc-box">
      <div class="title">描述</div>
      <div class="desc-text">{{dataMsg.descs}}</div>
    </div>
    <div class="pic_box" v-if="dataMsg.startFile">
      <div v-for="(val,i) in dataMsg.startFile" :key="'item'+i" class="prive_image">
        <img @click="lookHand(i,dataMsg.startFile)" class="img" :src="val.visitPath" />
      </div>
    </div>
  </mu-paper>
</template>
<script>
export default {
  props: {
    dataMsg: {
      type: Object,
      default: null
    }
  },
  data () {
    return {
      viewBox: null
    };
  },
  methods: {
    // 图片预览
    lookHand (index, arr) {
      if (!arr) return;
      let list = [];
      arr.forEach(item => {
        if (item.visitPath) {
          list.push(item.visitPath);
        }
      });
      if (list.length === 0) return;
      this.viewBox = this.$Prive({
        imgList: list,
        current: index
      });
    },
    // 设置状态名称
    setStatusName (value) {
      let str = '进行中';
      switch (value) {
        case 0:
          str = '派单中';
          break;
        case 1:
          str = '维修中';
          break;
        case 2:
          str = '待评价';
          break;
        case 3:
          str = '已完成';
          break;
        default:
          break;
      }
      return str;
    }
  },
  beforeDestroy () {
    if (this.viewBox) this.viewBox.close();
  }
};
</script>
<style lang="less" scoped>
.wrap {
  padding-left: 20px;
  padding-bottom: 20px;
}
.name {
  font-size: 18px;
  padding: 10px 0;
  margin-bottom: 10px;
  font-weight: bold;
  border-bottom: solid 1px #e1e1e1;
}
.content-text {
  padding-right: 20px;
}
.desc-box {
  padding-right: 20px;
  margin-top: 10px;
  .desc-text {
    color: #707070;
    margin-top: 5px;
  }
}
.msg-item {
  display: flex;
  align-items: center;
  margin-top: 5px;
}
.left-msg {
  flex: 3;
  font-size: 14px;
  font-weight: 800;
}
.right-msg {
  margin-left: 5px;
  color: #707070;
  flex: 7;
  text-align: right;
}
.pic_box {
  display: flex;
  flex-wrap: wrap;
}
.prive_image {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 75px;
  height: 75px;
  border-radius: 5px;
  background-size: cover;
  background-position: center;
  position: relative;
  margin: 10px 6px 0 0;
  .img {
    width: 100%;
    height: 100%;
    border-radius: 5px;
    vertical-align: middle;
  }
}
.title {
  font-weight: 800;
}
.orange {
  color: #ff7600;
}
</style>
