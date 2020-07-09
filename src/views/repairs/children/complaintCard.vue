<template>
  <mu-paper class="v_block wrap" :z-depth="1" v-if="dataMsg">
    <div class="name">投诉</div>
    <div class="content-text orange">{{dataMsg.complaintDeses}}</div>
    <div class="pic_box" v-if="dataMsg.complaintFile">
      <div v-for="(val,i) in dataMsg.complaintFile" :key="'item'+i" class="prive_image">
        <img @click="lookHand(i,dataMsg.complaintFile)" class="img" :src="val.visitPath" />
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
  border-bottom: solid 1px #E1E1E1;
}
.content-text{
  padding-right: 10px;
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
.orange {
  color: #ff7600;
}
</style>
