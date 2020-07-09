<template>
  <section class="v_page">
    <!-- 导航 -->
    <mu-appbar class="v_topNav" color="#fdd835" textColor="#000">
      <div class="title_text" slot="default">租客健康信息</div>
    </mu-appbar>
    <!-- 内容区 -->
    <div class="v_mainContainer skipRem">
      <house-swper @changParam="paramChange"></house-swper>
      <msg-card :listData="list" @updateData="updateData"></msg-card>
    </div>
    <mu-paper class="form_footer_btn" :z-depth="4">
      <mu-button class="btn" color="#90CC00" textColor="#ffffff" full-width @click="goSign" :disabled="list.length===0">同住人健康打卡</mu-button>
    </mu-paper>
  </section>
</template>
<script>
import msgCard from './children/MsgCard';
import HouseSwper from './children/HouseSwper';
import { getRecordByHouse } from '@/api/wxSurveyApi';
export default {
  components: { msgCard, HouseSwper },
  data () {
    return {
      list: []
    };
  },
  methods: {
    setList (arr) {
      if (!arr || arr.length === 0) return [];
      return arr.map(item => {
        item.list.map(val => {
          val.loading = false;
          val.passLoading = false;
          val.Cardloading = false;
          return val;
        });
        return item;
      });
    },
    paramChange (value) {
      let id = value.houseId;
      this.$store.commit('wxSurvey/resetData');
      this.$store.commit('wxSurvey/writeInFormData', { houseId: id });
      getRecordByHouse(id).then(res => {
        this.list = this.setList(res.data.records);
      });
    },
    goSign () {
      this.$store.commit('wxSurvey/writeInFormData', {
        customerType: 2
      });
      this.$router.push('/wxsurvey/sign');
    },
    // 更新数据
    updateData () {
      let id = this.$store.state.wxSurvey.healthObject.houseId;
      getRecordByHouse(id).then(res => {
        this.list = this.setList(res.data.records);
      });
    }
  }
};
</script>
<style lang="less" scoped>
.v_mainContainer {
  &.skipRem {
    padding-bottom: 65px;
  }
}
.v_block {
  padding-bottom: 35px;
  background: #f6f6f4;
}
.title_text {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
