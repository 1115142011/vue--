<template>
  <mu-paper class="v_block wrap" :z-depth="1">
    <div class="card-title">维修跟踪</div>
    <mu-stepper :active-step="vactiveStep" orientation="vertical" >
      <mu-step v-for="(item,index) in lisArr" :key="index+'st'">
        <mu-step-label>
           <img slot="icon" class="icon-img" :src="vactiveStep>index?finsh_icon:undone_icon">
          <div class="label-box">
            <span>{{item.descs}}</span>
            <span class="time">{{item.createTime}}</span>
          </div>
        </mu-step-label>
      </mu-step>
    </mu-stepper>
  </mu-paper>
</template>
<script>
export default {
  props: {
    lisArr: {
      type: Array,
      default: function () {
        return [];
      }
    }
  },
  data () {
    return {
      undone_icon: require('@/assets/images/proceedingStatus.svg'),
      finsh_icon: require('@/assets/images/finishedStatus.svg')
    };
  },
  computed: {
    vactiveStep () {
      let current = 0;
      for (let i = 0; i < this.lisArr.length; i++) {
        if (this.lisArr[i].status === 0) {
          current = i;
          break;
        } else {
          current = this.lisArr.length;
        }
      }
      return current;
    }
  }
};
</script>
<style lang="less" scoped>
.wrap{
  padding-left:  20px;
}
.card-title{
  font-size: 18px;
  padding: 10px 0;
  margin-bottom: 15px;
  font-weight:bold;
  border-bottom: solid 1px #E1E1E1;
}
.label-box{
  display: flex;
  flex-direction: column;
  color: #707070;
  .time{
    margin-top: 5px;
    font-size: 10px;
  }
}
.icon-img{
  width: 25px;
  height: 25px;
}
</style>
