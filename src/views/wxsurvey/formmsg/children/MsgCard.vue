<template>
  <section
    class="wrap"
    v-loading="loading"
    data-mu-loading-color="#FF7600"
    data-mu-loading-text="上传中..."
  >
    <div v-for="(value,i) in listData" :key="i+'a'">
      <mu-paper class="v_block" :z-depth="1" v-if="value.list.length<=0">
        <!-- 无数据 -->
        <div class="title v_ellipsis">{{value.roomName}}</div>
        <div class="noMsg">暂未打卡</div>
      </mu-paper>
      <!-- 有数据 -->
      <mu-paper class="v_block" :z-depth="1" v-for="(item,index) in value.list" :key="index+'a'">
        <div class="title v_ellipsis">{{value.roomName}}</div>
        <div class="msg_item">
          <span class="left_msg">租客</span>
          <span class="right_msg" v-if="item.customerType===1">{{getstr(item.customerName)}}</span>
          <span class="right_msg" v-if="item.customerType===2">{{getstr(item.customerName)}} 同住人</span>
        </div>
        <div class="msg_item">
          <span class="left_msg">打卡时间</span>
          <span class="right_msg">{{item.createTime}}</span>
        </div>
        <div class="msg_item">
          <span class="left_msg">目前健康状况</span>
          <span class="right_msg">{{setStatus(item)}}</span>
        </div>
        <div class="msg_item" v-if="item.healthStatus==2&&item.feverDesc">
          <span class="left_msg">健康情况说明</span>
          <span class="right_msg v_ellipsis">{{item.feverDesc}}</span>
        </div>
        <div class="msg_item" v-if="item.healthStatus==2&&item.recordFile">
          <span class="left_msg">说明附件</span>
          <span class="lookPic" @click="lookHand(item.recordFile)">查看附件</span>
        </div>
        <div class="msg_item">
          <span class="left_msg">现居住地</span>
          <span class="right_msg">{{getArea(item)}}</span>
        </div>
        <div class="msg_item">
          <span class="left_msg">放假是否离开成都</span>
          <span class="right_msg">{{item.leaveFlag==0?'否':'是'}}</span>
        </div>
        <div class="msg_item" v-if="item.leaveFlag==1">
          <span class="left_msg">是否已返回成都</span>
          <span class="right_msg">{{item.returnFlag==0?'否':'是'}}</span>
        </div>
        <div class="msg_item" v-if="item.leaveFlag==1&&item.returnFlag==1">
          <span class="left_msg">返回地</span>
          <span class="right_msg">{{item.returnSource}}</span>
        </div>
        <div class="msg_item" v-if="item.leaveFlag==1&&item.returnFlag==1">
          <span class="left_msg">返蓉时间</span>
          <span class="right_msg">{{geyDay(item.returnTime)}}</span>
        </div>
        <div class="msg_item">
          <span class="left_msg">是否在湖北停留</span>
          <span class="right_msg">{{item.contactWuhanFlag==0?'否':'是'}}</span>
        </div>
        <div class="msg_item">
          <span class="left_msg">有无病例接触史</span>
          <span class="right_msg">{{item.contactPatientFlag==0?'无':'有'}}</span>
        </div>
        <div class="msg_item">
          <span class="left_msg">是否复工</span>
          <span class="right_msg">{{item.returnWorkFlag==0?'无':'有'}}</span>
        </div>

        <div class="msg_item" v-if="item.passCardFile">
          <span class="left_msg">通行证</span>
          <div class="right_msg">
            <span class="check-file link" @click="lookHand(item.passCardFile)">查看</span>
            <span class="delete link" @click="deleteImg(item.id,2)"  v-if="value.custMobile==mobile">删除</span>
          </div>
        </div>
        <div class="msg_item" v-if="item.healthCardFile">
          <span class="left_msg">健康证</span>
          <div class="right_msg">
            <span class="check-file link" @click="lookHand(item.healthCardFile)">查看</span>
            <span class="delete link" @click="deleteImg(item.id,1)"  v-if="value.custMobile==mobile">删除</span>
          </div>
        </div>
        <div class="item_btn" v-if="value.custMobile==mobile">
          <mu-button
            small
            class="btn"
            color="warning"
            textColor="#424242"
            @click="chooseFile(item,2)"
          >
            <mu-icon value="add_a_photo" left v-if="!item.passCardFile"></mu-icon>
            <span>{{item.passCardFile?'更新通行证':'通行证'}}</span>
          </mu-button>
          <mu-button
            small
            class="btn"
            color="warning"
            textColor="#424242"
            @click="chooseFile(item,1,index)"
          >
            <mu-icon value="add_a_photo" left v-if="!item.healthCardFile"></mu-icon>
            <span>{{item.healthCardFile?'更新健康证':'健康证'}}</span>
          </mu-button>
          <mu-button
            small
            class="btn"
            color="warning"
            textColor="#424242"
            @click="again(item)"
            v-loading="item.loading"
            :disabled="item.loading"
            data-mu-loading-overlay-color="#ffffff9c"
            data-mu-loading-color="#FF7600"
          >更新打卡</mu-button>
        </div>
      </mu-paper>
    </div>
    <!-- 图片上传 -->
    <input
      @change="getFile($event)"
      type="file"
      accept="image/*"
      ref="upload_file"
      style="display: none"
      :multiple="false"
    />
  </section>
</template>
<script>
import Moment from 'moment';
import { uploadFile } from '@/api/globalApi';
import { addImage, deleteAddImage } from '@/api/wxSurveyApi';
import Exif from 'exif-js';
const imageConversion = require('image-conversion');

export default {
  props: ['listData'],
  data () {
    return {
      loading: false, // 上传图片 loading
      filenName: '', // 上传文件名称
      headerImage: null, // 文件对象
      imgParam: {
        id: '',
        type: '',
        file: ''
      },
      viewBox: undefined,
      mobile: undefined
    };
  },
  created () {
    this.mobile = Number(localStorage.getItem('ueserPhone'));
  },
  methods: {
    getstr (str) {
      return str[0] + '**';
    },
    // 判断健康状况
    setStatus (item) {
      switch (item.healthStatus) {
        case 1:
          return '健康';
        case 2:
          return '发烧/咳嗽';
        case 3:
          return item.healthDesc;
        default:
          return '--';
      }
    },
    // 判断居住点
    getArea (item) {
      switch (item.customerLocation) {
        case 1:
          return '当前租赁房屋';
        case 2:
          return item.customerLocationDesc;
        default:
          return '--';
      }
    },
    // 判断相差多少天
    geyDay (time) {
      let end = Moment(time);
      let start = Moment();
      let diffDays = Math.ceil(start.diff(end, 'days', true));
      if (diffDays <= 14) {
        return '未满14天';
      } else {
        return '已满14天';
      }
    },
    // 重新打卡
    again (item) {
      item.loading = true;
      let id = item.id;
      let type = item.customerType;
      let houseId = item.houseId;
      this.$store.commit('wxSurvey/setDeleteId', id);
      this.$store.commit('wxSurvey/writeInFormData', item);
      if (type === 2) {
        this.$store.commit('wxSurvey/writeInFormData', { houseId });
      }
      this.$store.commit('wxSurvey/writeInFormData', {
        customerType: type
      });
      this.$router.push('/wxsurvey/sign');
    },
    // 图片预览
    lookHand (arr) {
      if (!arr) return;
      let picList = arr.split(',');
      if (picList.length === 0) return;
      this.viewBox = this.$Prive({
        imgList: picList,
        current: 0
      });
    },
    // 选取图片
    chooseFile (value, type, index) {
      this.imgParam.id = value.id;
      this.imgParam.type = type;
      this.$refs.upload_file.click();
    },
    // 获取文件对象
    getFile (e) {
      let files = e.target.files;
      if (!files.length) return;
      for (let i = 0; i < files.length; i++) {
        let file = files[i];
        this.filenName = file.name;
        this.compress(file);
      }

      this.loading = !this.loading;
    },
    // 处理图片
    compress (file) {
      let self = this;
      let rotate;
      // 去获取拍照时的信息，解决拍出来的照片旋转问题
      Exif.getData(file, function () {
        rotate = Exif.getTag(this, 'Orientation');
        imageConversion
          .compressAccurately(file, {
            size: 200, // The compressed image size is 100kb
            accuracy: 0.9, // the accuracy of image compression size,range 0.8-0.99,default 0.95;
            // this means if the picture size is set to 1000Kb and the
            // accuracy is 0.9, the image with the compression result
            // of 900Kb-1100Kb is considered acceptable;
            orientation: rotate,
            type: 'image/jpeg',
            width: 1440,
            scale: 0.5
          })
          .then(res => {
            self.headerImage = res;
            self.postImg();
          });
      });
    },
    // 这里写接口
    async postImg () {
      let file = this.headerImage;
      let formData = new window.FormData();
      formData.append('file', file, this.filenName);
      try {
        await uploadFile(formData).then(res => {
          this.imgParam.file = res.data.filePath;
          // 更新证件图片
          addImage(this.imgParam).then(res => {
            this.loading = false;
            this.$emit('updateData');
            this.$toast.success({
              message: '图片更新成功',
              time: 3000
            });
          });
        });
      } catch (e) {
        this.loading = false;
        console.log(e);
      }
    },
    // 删除图片
    deleteImg (id, type) {
      let param = {
        id,
        type
      };
      deleteAddImage(param).then(res => {
        this.$toast.success({
          message: '删除成功',
          time: 3000
        });
        this.$emit('updateData');
      });
    }
  },
  beforeDestroy () {
    if (this.viewBox) this.viewBox.close();
  }
};
</script>
<style lang="less" scoped>
.lookPic {
  color: #10aeff;
}
.v_block {
  padding-left: 20px;
  padding-bottom: 20px;
}
.title {
  font-size: 16px;
  font-weight: 600;
  padding: 15px 0;
  color: #000000;
  border-bottom: 1px solid #e1e1e1;
}
.msg_item {
  padding: 3px 15px;
  display: flex;
  align-items: center;
  .left_msg {
    flex: 1;
    font-size: 16px;
    color: #707070;
    font-weight: 700;
  }
  .right_msg {
    flex: 1;
    text-align: right;
  }
}
.noMsg {
  padding: 10px;
  text-align: center;
  font-size: 16px;
  color: #ff7600;
}
.item_btn {
  margin-top: 15px;
  width: 100%;
  display: flex;
  justify-content: flex-end;
  /deep/.mu-raised-button {
    min-width: 50px;
  }
  .btn {
    margin: 0 5px;
  }
}
.link {
  color: #ff7600;
  margin: 0 15px;
}
</style>
