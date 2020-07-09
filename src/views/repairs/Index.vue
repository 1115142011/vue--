<template>
  <section
    class="v_page v_mainContainer"
    v-loading="loading"
    data-mu-loading-text="加载中..."
    data-mu-loading-overlay-color="transparent"
  >
    <!-- 内容区 -->
    <status-swiper @changParam="changParam"></status-swiper>
    <mu-paper class="v_block" :z-depth="1" v-if="lisData.length==0&&loading===false">
      <div class="no-list-card">
        <img :src="iconImage" class="icon-image" alt />
        <div class="title">没有维修记录</div>
        <div class="hint-msg">房屋有问题？请右下角进行报修~</div>
      </div>
    </mu-paper>
    <order-list :list="lisData" @updeteData="updeteData"></order-list>
    <img :src="bottomBtnImage" class="btn-icon circle-btn" @click="toAddOrder()" alt srcset />
  </section>
</template>
<script>
import statusSwiper from './children/statusSwiper';
import orderList from './children/orderList';
import { queryTenantOrder } from '@/api/repairsApi';
export default {
  components: { statusSwiper, orderList },
  data () {
    return {
      iconImage: require('@/assets/images/noReport.svg'),
      btnIcon: require('@/assets/images/newReport.svg'),
      lisData: [],
      bottomBtnImage: require('@/assets/images/applyRepair.svg'),
      timer: null, // 记录是否需要轮询
      loading: false,
      swiperIndex: 0
    };
  },
  created () {
    let token =
      window.location.href.split('token=')[1] ||
      localStorage.getItem('repaisToken');
    if (token) {
      localStorage.setItem('repaisToken', token);
      this.loading = true;
      this.getListData(0);
    } else {
      this.$router.push('/unRegistered');
    }
    console.log('当前地址', window.location.href);
  },
  methods: {
    // 跳转报修
    toAddOrder () {
      this.$router.push('/register');
    },
    // swper 选项改变
    changParam (value) {
      this.swiperIndex = value.id;
      this.loading = true;
      this.getListData(value.id);
    },
    // 获取数据
    getListData (status) {
      let param = {
        status
      };
      queryTenantOrder(param)
        .then(res => {
          this.loading = false;
          this.lisData = res.data;
        })
        .catch(e => {
          this.loading = false;
        });
    },
    // 更新数据
    updeteData (orderId) {
      this.getListData(this.swiperIndex); // 立即刷新
      this.timer = setInterval(() => {
        this.lisData.forEach(item => {
          if (item.orderId === orderId && item.payStatus !== 2) {
            clearInterval(this.timer);
          }
        });
        this.getListData(this.swiperIndex);
      }, 10000);
    }
  },
  beforeDesotry () {
    if (this.timer) {
      clearInterval(this.timer);
    }
  }
};
</script>
<style lang="less" scoped>
.no-list-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-bottom: 30px;
  .icon-image {
    width: 25%;
    margin-top: 50px;
  }
  .title {
    font-weight: bold;
    font-size: 16px;
  }
  .hint-msg {
    margin-top: 5px;
    color: #7b7b7b;
    font-size: 12px;
  }
}
.circle-btn {
  position: fixed;
  bottom: 10px;
  right: 10px;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  box-shadow: 0px 4px 5px rgba(0, 0, 0, 0.5);
}
</style>
