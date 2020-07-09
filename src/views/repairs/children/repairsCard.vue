<template>
  <mu-paper class="v_block wrap" :z-depth="1" v-if="repairsData">
    <div class="name">维修信息</div>
    <div class="content-text">
      <div class="msg-item">
        <span class="left-msg">维修专员</span>
        <span class="right-msg">{{repairsData.manager?repairsData.manager:'--'}}</span>
      </div>
      <div class="msg-item">
        <span class="left-msg">费用承担</span>
        <span class="right-msg">{{repairsData.dutyType===1?'公司承担':repairsData.dutyType===2?'租客承担':' '}}</span>
      </div>
    </div>
    <div class="pic_box" v-if="repairsData.checkFile">
      <div v-for="(val,i) in repairsData.checkFile" :key="'item'+i" class="prive_image">
        <img @click="lookHand(i,repairsData.checkFile)" class="img" :src="val.visitPath" />
      </div>
    </div>
    <div class="user-evaluate" v-if="repairsData.status>2&&repairsData.evaluatePoint.toString()!='null'">
      <div class="evaluate-level">
        <span class="left-msg">评分</span>
        <span class="right-msg">{{repairsData.evaluatePoint+'.0'}}/5.0</span>
      </div>
      <div class="title">我的评价</div>
      <div class="evaluate-text">
        {{repairsData.evaluateDescs?repairsData.evaluateDescs:'非常满意'}}
      </div>
    </div>
    <div class="pic_box" v-if="repairsData.evaluateFile">
      <div v-for="(val,i) in repairsData.evaluateFile" :key="'item'+i" class="prive_image">
        <img @click="lookHand(i,repairsData.evaluateFile)" class="img" :src="val.visitPath" />
      </div>
    </div>
  </mu-paper>
</template>
<script>
export default {
  props: {
    repairsData: {
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
.user-evaluate {
  padding-right: 20px;
  .evaluate-level {
    border-top: solid 1px #e1e1e1;
    margin-top: 15px;
    display: flex;
    align-items: center;
    padding: 10px 10px 10px 0;
  }
  .evaluate-text {
    color: #707070;
    margin-top: 10px;
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
