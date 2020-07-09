<template>
  <section class="v_page v_mainContainer" v-loading="loading" data-mu-loading-text="加载中...">
    <mu-paper class="v_block" :z-depth="1" v-if="costData&&detailsData">
      <div class="title-box border-bottom">
        <img class="img-icon" :src="iconImage" alt="图标" />
        <span class="house-name">{{detailsData.houseName+'-'+detailsData.roomName}}</span>
      </div>
      <div class="cost-content">
        <!-- 工单名称 -->
        <div class="coder-name flex border-bottom top-space">
          <div class="left-msg">
            <div
              class="title"
            >{{detailsData.roomName+'-'+detailsData.bigName+'-'+detailsData.smallName}}</div>
            <div class="time">报修时间：{{detailsData.startTime}}</div>
          </div>
          <div class="right-price">
            <span v-if="costData.isChanage===0">￥{{formatMoney(costData.initCost)}}</span>
            <div class="isChanage" v-if="costData.isChanage===1">
              <div class="old-price">￥{{formatMoney(costData.initCost)}}</div>
              <div class="orange">
                ￥{{formatMoney(costData.chanageCost)}}
                <span class="thin-font">(调)</span>
              </div>
            </div>
          </div>
        </div>
        <!-- 费用项 -->
        <div
          class="cost-item flex top-space border-bottom"
          v-for="(item,index) in costData.costInfos"
          :key="index+'c'"
        >
          <div class="left-msg">
            <div class="title">{{item.descs}}</div>
            <div class="time">产生时间：{{item.costTime?Moment(item.costTime).format('YYYY-MM-DD'):'--'}}</div>
          </div>
          <div class="right-price">￥{{formatMoney(item.cost)}}</div>
          <span class="cost-pic center" @click="lookHand(0,item.file)">
            <img :src="attachIcon" alt="图标" class="small-icon" />
          </span>
        </div>
        <div class="bottom-hint center">有疑问？请投诉或咨询客服666-000-1234</div>
      </div>
    </mu-paper>
    <div class="btn-bar">
      <mu-button fab small color="#FDD835" textColor="#594B0D" @click="backList" class="circle-btn">
        <img :src="bottom_icon" class="icon" alt srcset />
      </mu-button>
      <mu-button
        v-if="detailsData&&detailsData.payStatus===2&&detailsData.operatorRole===1"
        color="warning"
        class="large-btn"
        textColor="#594B0D"
        @click="openPayModel=true"
      >支付</mu-button>
    </div>
    <!-- 底部弹框 支付方式选择-->
    <mu-bottom-sheet :open.sync="openPayModel">
      <mu-list class="sheet-container">
        <mu-sub-header>请选择支付方式</mu-sub-header>
        <mu-list-item
          button
          @click="toPay(item,index)"
          v-for="(item,index) in payList"
          :key="index+'p'"
        >
          <mu-list-item-action v-loading="item.select" data-mu-loading-text="请求中..">
            <img :src="item.icon" alt="微信图标" class="icon" />
          </mu-list-item-action>
          <mu-list-item-title>{{item.iconText}}</mu-list-item-title>
        </mu-list-item>
      </mu-list>
    </mu-bottom-sheet>
  </section>
</template>
<script>
import { queryOrderCost, getWxPay, queryOrderDetails } from '@/api/repairsApi';
import Moment from 'moment';
export default {
  data () {
    return {
      iconImage: require('@/assets/images/billIcon.svg'),
      bottom_icon: require('@/assets/images/listButton.svg'),
      attachIcon: require('@/assets/images/attachIcon.svg'),
      viewBox: null,
      orderId: '',
      startId: '',
      timer: null,
      openPayModel: false,
      detailsData: null,
      costData: [],
      payList: [
        {
          icon: require('@/assets/images/wechatIcon.svg'),
          iconText: '微信支付',
          select: false
        }
      ]
    };
  },
  created () {
    let token = window.location.href.split('token=')[1] || '';
    if (token) {
      localStorage.setItem('repaisToken', token);
    }
    this.orderId = this.$route.query.orderId;
    this.startId = this.$route.query.startId;
    this.getCostLis(this.orderId);
    this.getDetailsData(this.startId);
  },
  computed: {
    costTotal () {
      let allNumber = 0;
      this.costData.costInfos.forEach(item => {
        allNumber += item.cost;
      });
      return allNumber;
    }
  },
  methods: {
    Moment,
    // 返回工单列表
    backList () {
      this.$router.push('/');
    },
    // 获取费用列表
    getCostLis (orderId) {
      this.loading = true;
      queryOrderCost(orderId).then(res => {
        this.loading = false;
        this.costData = res.data;
      });
    },
    // 查询工单详情数据
    getDetailsData (id) {
      queryOrderDetails(id)
        .then(res => {
          this.detailsData = res.data;
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
    },
    // 图片预览
    lookHand (index, arr = []) {
      if (!arr) {
        this.$toast.warning('该条费用未添加照片说明');
        return;
      }
      let list = [];
      arr.forEach(item => {
        if (item.visitPath) {
          list.push(item.visitPath);
        }
      });
      if (list.length === 0) {
        this.$toast.warning('该条费用未上传照片');
        return;
      }
      this.viewBox = this.$Prive({
        imgList: list,
        current: index
      });
    },
    // 选定支付方式 并支付
    toPay (item, index) {
      item.select = true;
      let param = {
        startId: this.detailsData.startId,
        orderId: this.detailsData.orderId
      };
      getWxPay(param).then(res => {
        this.openPayModel = false;
        item.select = false;
        this.useWxPay(res.data);
      });
    },
    // 调用微信api 进行支付
    useWxPay (data) {
      let _this = this;
      let param = data;
      function onBridgeReady () {
        WeixinJSBridge.invoke(
          'getBrandWCPayRequest',
          {
            appId: param.appId, // 公众号名称，由商户传入
            timeStamp: param.timeStamp, // 时间戳，自1970年以来的秒数
            nonceStr: param.nonceStr, // 随机串
            package: param.package, // 微信订单号
            signType: param.signType, // 微信签名方式：
            paySign: param.paySign // 微信签名
          },
          function (res) {
            if (res.err_msg === 'get_brand_wcpay_request:ok') {
              _this.updeteData();
            }
          }
        );
      }
      if (typeof WeixinJSBridge === 'undefined') {
        if (document.addEventListener) {
          document.addEventListener(
            'WeixinJSBridgeReady',
            onBridgeReady,
            false
          );
        } else if (document.attachEvent) {
          document.attachEvent('WeixinJSBridgeReady', onBridgeReady);
          document.attachEvent('onWeixinJSBridgeReady', onBridgeReady);
        }
      } else {
        onBridgeReady();
      }
    },
    // 更新数据
    updeteData () {
      this.getDetailsData(this.startId); // 立即刷新
      this.timer = setInterval(() => {
        if (this.detailsData.payStatus !== 2) {
          clearInterval(this.timer);
        }
        this.getDetailsData(this.startId);
      }, 10000);
    }
  },
  beforeDestroy () {
    if (this.viewBox) this.viewBox.close();
    if (this.timer) clearInterval(this.timer);
  }
};
</script>
<style lang="less" scoped>
.title-box {
  margin-top: 10px;
  display: flex;
  position: relative;
  justify-content: space-between;
  align-items: center;
  padding: 10px 15px;
  .img-icon {
    width: 23px;
    height: 23px;
    margin-right: 10px;
  }
  .house-name {
    flex: 1;
    font-size: 16px;
    font-weight: bold;
  }
}
.cost-content {
  padding: 0 20px 10px;
}
.left-msg {
  flex: 1;
  margin-right: 5px;
}
.title {
  font-size: 14px;
  font-weight: 800;
}
.time {
  margin-top: 5px;
  color: #707070;
  font-size: 10px;
}
.right-price {
  font-size: 18px;
  .isChanage{
    display: flex;
    flex-direction: column;
    align-items: center;
    .old-price{
      font-size: 12px;
      text-decoration: line-through;
    }
  }
}
.flex {
  display: flex;
  align-items: center;
}
.border-bottom {
  padding-bottom: 15px;
  border-bottom: solid 1px #e3e3e3;
}
.cost-pic {
  width: 40px;
  height: 40px;
  border-radius: 18px;
  margin-left: 15px;
  .small-icon {
    width: 40px;
    height: 40px;
  }
}
.top-space {
  margin-top: 15px;
}
.bottom-hint {
  color: #707070;
  font-size: 10px;
  margin: 20px 0;
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
.sheet-container {
  min-height: 180px;
  .icon {
    width: 25px;
    height: 25px;
  }
  .icon-text {
    font-size: 16px;
    margin: 0 10px;
  }
}
.thin-font {
  font-size: 12px;
}
.orange {
  color: #ff7600;
}
</style>
