<template>
  <section class="v_page v_mainContainer" v-loading="loading" data-mu-loading-text="提交中..." data-mu-loading-overlay-color="transparent">
    <!-- 评价 -->
    <div v-show="!finshStep">
       <!-- 顶部标题 -->
      <mu-paper class="v_block title-box" :z-depth="1" v-if="orderData">
        <img class="img-icon" :src="iconImage" alt="图标" />
        <span class="house-name">{{orderData.houseName}}</span>
      </mu-paper>
      <mu-paper class="v_block wrap" :z-depth="1">
        <div class="title top-space">出了什么问题</div>
        <div class="input-box">
          <mu-text-field
            v-model="descText"
            label-float
            :error-text="errorText"
            @focus="inputFn($event)"
            label="投诉原因"
            color="#FF7600"
            :rows="2"
            :rows-max="5"
            full-width
            multi-line
          ></mu-text-field>
          <br />
        </div>
        <div class="title top-space">上传图片（可选）</div>
        <div class="pic_box">
          <div class="pic_box">
            <div v-for="(val,i) in imgList" :key="'item'+i" class="prive_image">
              <img @click="lookHand(i,imgList)" class="img" :src="val.visitPath+val.filePath" />
              <mu-button color="primary" class="delet_icon" icon small @click="deleteImage(val,i)">
                <mu-icon value="cancel" color="red"></mu-icon>
              </mu-button>
            </div>
            <upLoad-img
              :fileList="imgList"
              @keepNewPic="keepNewPic"
              :multiple="true"
              :borderColor="'#FF7600'"
            ></upLoad-img>
          </div>
        </div>
        <div class="top-space">
          <mu-button color="#FDD835" textColor="#594B0D" full-width @click="submitMsg" :disabled="loading">投诉完成</mu-button>
        </div>
      </mu-paper>
      <div class="btn-bar">
        <mu-button
          fab
          small
          color="#FDD835"
          textColor="#594B0D"
          @click="backList"
          class="circle-btn"
        >
          <img :src="bottom_icon" class="icon" alt srcset />
        </mu-button>
      </div>
    </div>
    <!-- 评价完成 -->
    <div v-show="finshStep">
      <mu-paper class="v_block" :z-depth="1">
        <div class="title-box">
          <img class="img-icon" :src="iconImage" alt="图标" />
          <span class="house-name">{{orderData.houseName}}</span>
        </div>
        <div class="image-box">
          <img :src="sorryGesture" class="finsh-img" alt="">
          <div class="title">抱歉给您带来不好的体验！</div>
          <div class="hint-msg">我们会尽快核实问题与您联系~~</div>
        </div>
        <div class="finsh-btn">
            <mu-button class="btn" color="#FDD835" textColor="#424242" @click="backList">返回列表</mu-button>
             <mu-button class="btn" flat color="#FF7600" @click="toDetails">查看详情</mu-button>
        </div>
      </mu-paper>
    </div>
  </section>
</template>
<script>
import upLoadImg from '@/components/upLoadImg';
import { sunmitComplaint } from '@/api/repairsApi';
export default {
  components: { upLoadImg },
  data () {
    return {
      loading: false,
      finshStep: false,
      descText: '', // 投诉文本
      errorText: '',
      viewBox: null,
      imgList: [], // 上传的图片
      bottom_icon: require('@/assets/images/listButton.svg'),
      iconImage: require('@/assets/images/repairOrderIcon.svg'),
      sorryGesture: require('@/assets/images/sorryGesture.svg')
    };
  },
  created () {
    this.orderId = this.$route.query.orderId;
    this.startId = this.$route.query.startId;
  },
  computed: {
    orderData () {
      return this.$store.state.repairs.detailsData;
    }
  },
  methods: {
    // 返回工单列表
    backList () {
      this.$router.push('/');
    },
    // 查看详情
    toDetails () {
      this.$router.push({
        path: '/orderDetails',
        query: {
          startId: this.startId
        }
      });
    },
    // 图片预览
    lookHand (index, arr) {
      if (!arr) return;
      let list = [];
      arr.forEach(item => {
        list.push(item.visitPath + item.filePath);
      });
      if (list.length === 0) return;
      this.viewBox = this.$Prive({
        imgList: list,
        current: index
      });
    },
    // 保存图片
    keepNewPic (val) {
      this.imgList.push(val);
    },
    // 提交评价
    submitMsg () {
      if (!this.descText) {
        this.errorText = '投诉内容不能为空';
      } else {
        this.loading = true;
        let param = {
          orderId: this.orderId,
          descs: this.descText,
          file: this.imgList
        };
        sunmitComplaint(param).then(res => {
          this.loading = false;
          this.finshStep = true;
        });
      }
    },
    // 获取焦点时的表现
    inputFn (e) {
      this.errorText = '';
      setTimeout(() => {
        e.target.scrollIntoView({
          block: 'center'
        });
      }, 300);
    },
    // 删除图片
    deleteImage (index) {
      this.imgList.splice(index, 1);
    }
  },
  beforeDestroy () {
    if (this.viewBox) this.viewBox.close();
  }
};
</script>
<style lang="less" scoped>
.wrap {
  padding: 20px;
}
.title {
  font-size: 14px;
  font-weight: 800;
}
.score-box {
  display: flex;
  justify-content: space-between;
  align-items: center;
  .star-box {
    margin: 0 5px;
    flex: 1;
    display: flex;
    justify-content: space-around;
    align-items: center;
  }
  .score-desc {
    width: 60px;
    color: #707070;
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
.pic_box {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 15px;
  .prive_image {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 75px;
    height: 75px;
    border-radius: 5px;
    background-size: cover;
    background-position: center;
    position: relative;
    margin: 10px 6px 0 0;
    .delet_icon {
      top: -10px;
      right: -5px;
      width: 20px;
      height: 20px;
      position: absolute;
    }
    .img {
      width: 100%;
      height: 100%;
      border-radius: 5px;
      vertical-align: middle;
    }
  }
}
.top-space {
  margin-top: 10px;
}
.title-box {
  display: flex;
  position: relative;
  justify-content: space-between;
  align-items: center;
  padding: 10px 15px;
  border-bottom: solid 1px #e3e3e3;
  .img-icon {
    width: 25px;
    height: 25px;
    margin-right: 5px;
  }
  .house-name {
    flex: 1;
    font-size: 14px;
    font-weight: bold;
  }
}
.image-box{
  height: 200px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  .finsh-img{
    width: 100px;
    height: 100px;
  }
  .hint-msg{
    color: #707070;
    font-size: 10px;
    margin-top: 5px;
  }
}
.finsh-btn{
  display: flex;
  align-items: center;
  width:85%;
  margin: 0 auto;
  border-top: solid 1px #E3E3E3;
  padding:20px 0;
  .btn{
    margin-left:15px;
  }
}
</style>
