<template>
  <section class="margin_box">
     <!-- 首次打卡 -->
    <mu-paper class="v_block forom_one" :z-depth="1" v-if="houseData&&type===1&&userData">
        <div class="group_item">
          <div class="left_msg">
            <mu-icon value="sentiment_satisfied" color="#FF7600"></mu-icon>
            <span class="name">租客</span>
          </div>
          <div class="right_msg">{{userData.name}}</div>
        </div>
        <div class="group_item">
          <div class="left_msg">
            <mu-icon value="location_city" color="#10AEFF"></mu-icon>
            <span class="name">房间</span>
          </div>
          <div class="right_msg">{{houseData[0].houseName}}</div>
        </div>
        <div class="group_item">
          <div class="left_msg">
            <mu-icon value="credit_card" color="#FFC000"></mu-icon>
            <span class="name">身份证</span>
          </div>
          <div class="right_msg">{{userData.idcard}}</div>
        </div>
        <div class="group_item">
          <div class="left_msg">
            <mu-icon value="stay_primary_portrait" color="#4BD026"></mu-icon>
            <span class="name">电话</span>
          </div>
          <div class="right_msg">{{userData.mobile}}</div>
        </div>
    </mu-paper>
     <!-- 同住人打卡 -->
    <partner-cad ref="myParter" :houseData='houseData' :userData='userData' v-if="type===2"></partner-cad>
     <mu-paper class="form_footer_btn" :z-depth="4">
        <mu-button class="btn" color="warning" textColor="#424242" full-width @click="start">开始~</mu-button>
      </mu-paper>
  </section>
</template>
<script>
import { getUserHoseList, getUserMsg } from '@/api/wxSurveyApi';
import PartnerCad from './PartnerCad';
export default {
  components: { PartnerCad },
  data () {
    return {
      type: undefined,
      houseData: undefined,
      userData: undefined
    };
  },
  created () {
    this.type = this.$store.state.wxSurvey.healthObject.customerType;
    // 获取租客房源信息
    getUserHoseList().then(res => {
      this.houseData = res.data.houseList;
    });
    // 获取用户信息
    let mobile = localStorage.getItem('ueserPhone');
    getUserMsg(mobile).then(res => {
      this.userData = res.data;
      this.$store.commit('wxSurvey/keepUserData', res.data);
    });
  },
  methods: {
    start () {
      let type = this.$store.state.wxSurvey.healthObject.customerType;
      if (type === 2) {
        let msg = this.$refs.myParter.formMsg;
        this.$refs.myParter.$refs.partenr.validate().then(result => {
          if (result) {
            this.$store.commit('wxSurvey/writeInFormData', msg);
            this.$emit('next');
          }
        });
      } else {
        this.$emit('next');
      }
    }
  }
};
</script>
<style lang="less" scoped>
.forom_one {
  padding: 31px;
}
.group_item {
  padding: 5px 0;
  display: flex;
  align-items: center;
  .left_msg {
    flex: 4;
    display: flex;
    align-items: center;
    .name {
      margin-left: 20px;
      font-size: 16px;
      font-weight: bold;
      line-height: 19px;
      color: #707070;
    }
  }
  .right_msg {
    flex: 7;
    padding-left: 5px;
  }
}
.btn {
  border-radius: 4px;
}
.margin_box {
  width: 100%;
  margin-bottom: 20px;
}
</style>
