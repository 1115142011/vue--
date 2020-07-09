<template>
  <section class="v_page">
    <!-- 导航 -->
    <mu-appbar class="v_topNav" color="#fdd835" textColor="#000">
        <div class="title_text" slot="default"> 未注册</div>
    </mu-appbar>
    <!-- 内容区 -->
    <div class="v_mainContainer skipRem">
       <mu-paper class="v_block" :z-depth="1">
        <div class="center">
          <img  class="middle_pic" :src="imgUrl" alt="">
        </div>
        <div class="center weight">该微信无匹配租约</div>
        <div class="center smaill">继续报修请致电400 806 3399</div>
      </mu-paper>
    </div>
  </section>
</template>
<script>
export default {
  data () {
    return {
      imgUrl: require('@/assets/images/nolist.jpg')
    };
  }
};
</script>
<style lang="less" scoped>
.v_mainContainer {
  &.skipRem {
    padding-bottom: 56px;
  }
}
.v_block{
    padding-bottom: 35px;
     background: #f6f6f4;
}
.title_text{
    display: flex;
    justify-content: center;
}
.center{
  display: flex;
  justify-content: center;
}
.weight{
    font-size: 16px;
    font-weight: 600;
}
.smaill{
    font-size: 12px;
}
.middle_pic{
  margin-top: 15px;
  width: 80%;
  height: 170px;
}
</style>
