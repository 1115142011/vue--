<template>
  <section class="v_page v_mainContainer" v-loading="loading" data-mu-loading-text="加载中...">
    <!-- 顶部标题 -->
    <mu-paper class="v_block title-box" :z-depth="1" v-if="detailsData">
      <img class="img-icon" :src="iconImage" alt="图标" />
      <span class="house-name">{{detailsData.houseName}}</span>
    </mu-paper>
    <!-- 状态步进卡 -->
    <steper-card v-if="detailsData&&detailsData.tracks" :lisArr="detailsData.tracks"></steper-card>
    <!-- 维修信息 -->
    <repairs-card v-if="detailsData&&detailsData.status>0" :repairsData="detailsData"></repairs-card>
    <!-- 费用链接 -->
    <mu-paper
      class="v_block click-box"
      @click="toCost(detailsData,costData)"
      :z-depth="1"
      v-if="costData&&detailsData.dutyType===2"
    >
      <mu-ripple color="#707070" :opacity="0.5">
        <div class="title-box cost-link">
          <mu-icon class="icon-font" value="assignment" color="#FF7600" :size="18"></mu-icon>
          <span
            v-if="costData.isChanage===0"
            class="house-name"
          >维修费用：￥{{formatMoney(costData.initCost)}}</span>
          <span v-if="costData.isChanage===1" class="house-name">
            维修费用：￥{{formatMoney(costData.chanageCost)}}
            <span class="thin-font">(调整后)</span>
          </span>
          <mu-icon value="keyboard_arrow_right" color="#ADADAD" class="right-icon"></mu-icon>
        </div>
      </mu-ripple>
    </mu-paper>
    <!-- 租客投诉·1 -->
    <complaint-card
      v-if="detailsData&&(detailsData.complaintDeses||detailsData.complaintFile)"
      :dataMsg="detailsData"
    ></complaint-card>
    <!-- 工单信息 -->
    <order-msg-card v-if="detailsData" :dataMsg="detailsData"></order-msg-card>
    <!-- 底部按钮 -->
    <div class="btn-bar">
      <mu-button fab small color="#FDD835" textColor="#594B0D" @click="backList" class="circle-btn">
        <img :src="bottom_icon" class="icon" alt srcset />
      </mu-button>
      <mu-button
        v-if="detailsData&&detailsData.status===2&&detailsData.operatorRole===1"
        color="warning"
        class="large-btn"
        textColor="#594B0D"
        @click="toComment"
      >评价</mu-button>
    </div>
  </section>
</template>
<script>
import steperCard from './children/steperCard';
import complaintCard from './children/complaintCard';
import repairsCard from './children/repairsCard';
import orderMsgCard from './children/orderMsgCard';
import { queryOrderDetails, queryOrderCost } from '@/api/repairsApi';
export default {
  components: { steperCard, complaintCard, repairsCard, orderMsgCard },
  data () {
    return {
      iconImage: require('@/assets/images/repairOrderIcon.svg'),
      bottom_icon: require('@/assets/images/listButton.svg'),
      loading: false,
      startId: '',
      costData: undefined, // 费用数据
      detailsData: null
    };
  },
  created () {
    let token = window.location.href.split('token=')[1] || '';
    if (token) {
      localStorage.setItem('repaisToken', token);
    }
    this.startId = this.$route.query.startId;
    this.getDetailsData(this.startId);
  },
  methods: {
    // 返回工单列表
    backList () {
      this.$router.push('/');
    },
    // 跳转费用详情
    toCost (data, cost) {
      if (cost.initCost <= 0) return;
      this.$router.push({
        path: '/costList',
        query: {
          orderId: data.orderId,
          startId: data.startId
        }
      });
    },
    // 获取费用列表
    getCostLis (orderId) {
      queryOrderCost(orderId).then(res => {
        this.costData = res.data;
      });
    },
    // 跳转评价
    toComment () {
      this.$store.commit('repairs/keepCostParam', this.detailsData);
      this.$router.replace({
        path: '/order/evaluate',
        query: {
          orderId: this.detailsData.orderId,
          startId: this.detailsData.startId
        }
      });
    },
    // 查询详情数据
    getDetailsData (id) {
      this.loading = true;
      queryOrderDetails(id)
        .then(res => {
          this.loading = false;
          this.detailsData = res.data;
          if (this.detailsData.dutyType === 2) {
            this.getCostLis(this.detailsData.orderId);
          }
        })
        .catch(e => {
          this.loading = false;
        });
    },
    // 金额计算,保留两位小数
    formatMoney (value) {
      if (isNaN(value)) return '-.-';
      value = Number(value);
      let rmb = (value / 1000).toString();
      let rmbArr = rmb.split('.');
      let firstNumber = 0;
      let secondNumber = 0;
      if (rmbArr[1]) {
        firstNumber = rmbArr[1][0];
        secondNumber = rmbArr[1][1] || 0;
      }
      return rmbArr[0] + '.' + firstNumber + secondNumber;
    }
  }
};
</script>
<style lang="less" scoped>
.title-box {
  display: flex;
  position: relative;
  justify-content: space-between;
  align-items: center;
  padding: 10px 15px;
  .img-icon {
    width: 25px;
    height: 25px;
    margin-right: 5px;
  }
  .house-name {
    margin: 0 5px;
    flex: 1;
    font-size: 16px;
    font-weight: bold;
    display: flex;
    align-items: center;
    .thin-font {
      font-size: 12px;
      font-weight: 500;
    }
  }
}
.click-box {
  position: relative;
  padding-left: 15px;
  padding-bottom: 0;
}
.cost-link {
  padding-left: 0;
  .icon-font {
    margin-right: 10px;
  }
}
.btn-bar {
  margin: 16px 0;
  padding: 0 12px;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  .circle-btn {
    margin-right: 10px;
    .icon {
      width: 42px;
      height: 42px;
    }
  }
  .large-btn {
    flex: 1;
    border-radius: 8px;
  }
}
</style>
