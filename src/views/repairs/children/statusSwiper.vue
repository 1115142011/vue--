<template>
  <swiper :options="swiperOption" ref="mySwiper">
    <swiper-slide class="slidBox" v-for="(item,index) in statueList" :key="'swper'+index">
      <mu-paper
        :z-depth="1"
        class="ststus_item"
        :class="{selected:selectedId===item.id}"
        @click="selectTag(item.id)"
      >
        <span class="content">{{item.name}}</span>
      </mu-paper>
    </swiper-slide>
  </swiper>
</template>
<script>
export default {
  data () {
    return {
      selectedId: 0,
      statueList: [
        {
          name: '全部',
          id: 0
        },
        {
          name: '维修中',
          id: 1
        },
        {
          name: '待评价',
          id: 2
        },
        {
          name: '已完成',
          id: 3
        }
      ],
      swiperOption: {
        slidesPerView: 'auto', // 视口中展示几个slide
        roundLengths: true, // slide宽高4舍5入
        spaceBetween: 10, // slide的间距
        slidesOffsetBefore: 10, // 首个左侧偏移量
        slidesOffsetAfter: 10 // 尾部偏移
      }
    };
  },
  methods: {
    selectTag (id) {
      this.selectedId = id;
    }
  },
  watch: {
    selectedId: function (newV, oldV) {
      let obj;
      this.statueList.forEach(item => {
        if (item.id === newV) {
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
   background: #FFE7E6;
    color: #FF8949;
  }
}
</style>
