<template>
  <section class="v_page">
    <!-- 导航 -->
    <mu-appbar class="v_topNav" color="#fdd835" textColor="#000">
        <div class="title_text" slot="default"> 健康打卡</div>
    </mu-appbar>
    <!-- 内容区 -->
    <div class="v_mainContainer skipRem">
       <mu-paper class="v_block" :z-depth="1">
        <div class="center">
          <img  class="middle_pic" :src="imgUrl" alt="">
        </div>
        <div class="center weight">未查询到您的租约？</div>
        <div class="center smaill">请确认签约手机号是否准确，如有疑问请联系您的销售</div>
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
    transform: scale(0.8);
    color: #7B7B7B;
}
.middle_pic{
  margin-top: 15px;
  width: 80%;
  height: 170px;
}
</style>
