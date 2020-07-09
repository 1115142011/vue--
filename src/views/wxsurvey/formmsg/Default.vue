<template>
  <section class="v_page">
    <!-- 导航 -->
    <mu-appbar class="v_topNav" color="warning" textColor="#000">
        <div class="title_text" slot="default"> 健康打卡</div>
    </mu-appbar>
    <!-- 内容区 -->
    <div class="v_mainContainer skipRem">
        <form-one @next='next' v-if="step===1"></form-one>
        <form-two @next='next' v-if="step===2"></form-two>
        <form-three @next='next' v-if="step===3"></form-three>
        <form-four @next='next' v-if="step===4"></form-four>
        <form-five @next='next' v-if="step===5"></form-five>
    </div>
  </section>
</template>
<script>

import formOne from './children/FormOne';
import formTwo from './children/FormTwo';
import formThree from './children/FormThree';
import formFour from './children/FormFour';
import formFive from './children/FormFive';
export default {
  components: { formOne, formTwo, formThree, formFour, formFive },
  data () {
    return {
      step: 1,
      type: undefined // 1 首次打卡， 2 同住人打卡
    };
  },
  methods: {
    next (value) {
      if (value) {
        this.step += value;
      } else {
        this.step += 1;
      }
    }
  }
};
</script>
<style lang="less" scoped>
.v_mainContainer {
  &.skipRem {
    padding-bottom: 56px;
  }
}
.title_text{
    display: flex;
    justify-content: center;
}
</style>
