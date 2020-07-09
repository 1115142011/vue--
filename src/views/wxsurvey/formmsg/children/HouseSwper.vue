<template>
  <swiper :options="swiperOption" ref="mySwiper">
    <swiper-slide class="slidBox" v-for="(item,index) in houseList" :key="'swper'+index">
      <mu-paper
        :z-depth="1"
        class="ststus_item"
        :class="{selected:selectedId===item.houseId}"
        @click="selectTag(item.houseId)"
      >
        <span class="content">{{item.houseName}}</span>
      </mu-paper>
    </swiper-slide>
  </swiper>
</template>
<script>
import { getUserHoseList } from '@/api/wxSurveyApi';

export default {
  data () {
    return {
      selectedId: undefined,
      houseList: [],
      swiperOption: {
        slidesPerView: 'auto', // 视口中展示几个slide
        roundLengths: true, // slide宽高4舍5入
        spaceBetween: 10, // slide的间距
        slidesOffsetBefore: 10, // 首个左侧偏移量
        slidesOffsetAfter: 10 // 尾部偏移
      }
    };
  },
  created () {
    getUserHoseList().then(res => {
      this.houseList = res.data.houseList;
      this.selectedId = this.houseList[0].houseId;
    });
  },
  methods: {
    selectTag (id) {
      this.selectedId = id;
    }
  },
  watch: {
    selectedId: function (newV, oldV) {
      let obj;
      this.houseList.forEach(item => {
        if (item.houseId === newV) {
          obj = item;
        }
      });
      this.$emit('changParam', obj);
    }
  }
};
</script>
<style lang="less" scoped>
.ststus_item {
  background:#d2d2d2;;
  color:#5f5f5f;
  padding: 5px 10px;
  border-radius: 15px;
}
/deep/.slidBox {
  width: auto !important;
  padding: 5px 0;
  .selected {
   background: #ffe7e6;
    color: #FF8949;
  }
}
</style>
