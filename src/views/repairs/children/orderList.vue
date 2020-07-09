<template>
  <section class="flat-box">
    <mu-paper class="v_block lis-box" :z-depth="1" v-for="(item,index) in list" :key="index">
      <div class="click-box" @click="toDetails(item.startId)">
        <mu-ripple color="#707070" :opacity="0.5">
          <div class="title-box">
            <img class="img-icon" :src="iconImage" alt="图标" />
            <span class="house-name">{{item.houseName}}</span>
            <mu-icon value="keyboard_arrow_right" color="#ADADAD" class="right-icon"></mu-icon>
          </div>
        </mu-ripple>
      </div>

      <div class="order-content">
        <div class="order-name top-space">
          <span class="name-text">{{item.roomName +'-'+item.bigName+'-'+item.smallName}}</span>
          <span class="order-state orange">{{setStatusName(item.status)}}</span>
        </div>
        <div class="time-box top-space">报修时间：{{item.startTime}}</div>
        <div class="desc-cotent top-space">{{item.descs}}</div>
        <!-- 投诉 -->
        <div class="complain-box orange" v-if="item.complaintTime">
          <div class="time-box top-space">投诉时间：{{item.complaintTime}}</div>
          <div class="complain-cause">原因：{{item.complaintDeses}}</div>
        </div>
        <!-- 费用 -->
        <div class="cost-box top-space" v-if="item.sumFee>0&&item.dutyType===2">
          <span>共{{item.sumCount}}项维修费用，合计：￥</span>
          <span class="price-big">{{formatMoney(item.sumFee).split('.')[0]+'.'}}</span>
          <span class="price-small">{{formatMoney(item.sumFee).split('.')[1]}}</span>
        </div>
      </div>
      <!-- 操作按钮 -->
      <div class="control-btn top-space" v-if="item.operatorRole===1">
        <mu-button
          round
          flat
          small
          class="btn"
          color="#FF7600"
          @click="toComplaint(item)"
          v-if="item.status===3&&item.complaintStatus===0"
        >投诉</mu-button>
        <mu-button
          round
          flat
          small
          class="btn"
          color="#FF7600"
          v-if="item.status===2"
          @click="toComment(item)"
        >评价</mu-button>
        <mu-button
          round
          flat
          small
          class="btn"
          color="#FF7600"
          v-if="item.payStatus===2&&item.sumFee>0"
          @click="showPayModel(item)"
        >支付</mu-button>
      </div>
    </mu-paper>
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
import { getWxPay } from '@/api/repairsApi';
export default {
  props: {
    list: {
      type: Array,
      default: function () {
        return [];
      }
    }
  },
  data () {
    return {
      openPayModel: false,
      iconImage: require('@/assets/images/repairOrderIcon.svg'),
      padyOrder: undefined,
      payList: [
        {
          icon: require('@/assets/images/wechatIcon.svg'),
          iconText: '微信支付',
          select: false
        }
      ]
    };
  },
  methods: {
    // 详情
    toDetails (startId) {
      this.$router.push({
        path: '/orderDetails',
        query: {
          startId: startId
        }
      });
    },
    // 投诉
    toComplaint (data) {
      this.$store.commit('repairs/keepCostParam', data);
      this.$router.push({
        path: '/order/complaint',
        query: {
          orderId: data.orderId,
          startId: data.startId
        }
      });
    },
    // 评价
    toComment (data) {
      this.$store.commit('repairs/keepCostParam', data);
      this.$router.replace({
        path: '/order/evaluate',
        query: {
          orderId: data.orderId,
          startId: data.startId
        }
      });
    },
    // 设置状态名称
    setStatusName (value) {
      let str = '进行中';
      switch (value) {
        case 0:
          str = '派单中';
          break;
        case 1:
          str = '维修中';
          break;
        case 2:
          str = '待评价';
          break;
        case 3:
          str = '已完成';
          break;
        default:
          break;
      }
      return str;
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
    // 显示支付弹框
    showPayModel (data) {
      this.openPayModel = true;
      this.padyOrder = data;
    },
    // 选定支付方式 并支付
    toPay (item, index) {
      item.select = true;
      let param = {
        startId: this.padyOrder.startId,
        orderId: this.padyOrder.orderId
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
              _this.$emit('updeteData', _this.padyOrder.orderId);
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
    }
  }
};
</script>
<style lang="less" scoped>
.lis-box {
  color: #666666;
}
.click-box {
  position: relative;
  padding-left: 15px;
}
.lis-box:last-child {
  margin-bottom: 90px;
}
.title-box {
  display: flex;
  position: relative;
  justify-content: space-between;
  align-items: center;
  border-bottom: solid 1px #e3e3e3;
  padding-bottom: 10px;
  padding-top: 10px;
  padding-right: 10px;
  .img-icon {
    width: 25px;
    height: 25px;
    margin-right: 5px;
  }
  .house-name {
    flex: 1;
    margin: 0 5px;
    font-size: 14px;
    font-weight: bold;
  }
}
.order-content {
  padding-left: 20px;
  padding-top: 5px;
  padding-right: 20px;
  .order-name {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .name-text {
      font-size: 14px;
      font-weight: bold;
    }
  }
  .desc-cotent {
    color: #adadad;
    font-size: 10px;
  }
}
.control-btn {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: 0 10px 10px 0;
  .btn {
    border-radius: 20px;
    border: solid 1px #dfdfdf;
    margin: 0 3px;
  }
}
.complain-cause {
  font-size: 10px;
}
.cost-box {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  color: #000000;
  padding-right: 10px;
  .price-big {
    font-size: 18px;
  }
  .price-small {
    font-size: 10px;
    transform: translateY(3px);
  }
}
.orange {
  color: #ff7600;
}
.top-space {
  margin-top: 5px;
}
/deep/.mu-flat-button {
  min-width: 60px;
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
</style>
