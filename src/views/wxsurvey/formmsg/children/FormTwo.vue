<template>
  <mu-paper class="v_block form_two wx" :z-depth="1">
    <div class="top_hit">
      带有
      <mu-icon value="group" size="18" color="#448AFF" class="icon"></mu-icon>的信息会与室友共享
    </div>
    <mu-form ref="myForm" :model="formMsg" class="form_Msg">
      <!-- 健康状况 -->
      <mu-form-item prop="healthStatus" :rules="msgVerify">
        <div slot="label" class="form_label">
          健康状况
          <mu-icon value="group" size="18" class="icon" color="#448AFF"></mu-icon>
        </div>
        <div class="select-control-group">
          <mu-flex class="select-control-row" :key="'radio ' + i" v-for="(item,i) in radioList">
            <mu-radio
              :value="item.value"
              v-model="formMsg.healthStatus"
              color="#FF7600"
              :label="item.label"
            ></mu-radio>
          </mu-flex>
        </div>
      </mu-form-item>
       <!-- 健康发烧咳嗽 上传图片-->
      <mu-form-item v-if="formMsg.healthStatus==2">
        <div class="unload_wrap">
          <mu-text-field
            v-model="formMsg.feverDesc"
            :rows="1"
            :rows-max="5"
            multi-line
            full-width
            :placeholder="'进一步说明一下呢(不共享)'"
          ></mu-text-field>
          <div class="pic_box">
            <div v-for="(val,i) in imgUrl" :key="'item'+i" class="prive_image">
              <img @click="lookHand(i,imgUrl)" class="img" :src="val" />
              <mu-button color="primary" class="delet_icon" icon small @click="deleteImage(val,i)">
                <mu-icon value="cancel" color="red"></mu-icon>
              </mu-button>
            </div>
            <upLoad-img :fileList="imgUrl" @keepNewPic="keepNewPic" :limit="3"></upLoad-img>
          </div>
        </div>
      </mu-form-item>
      <!-- 病情说明 -->
      <mu-form-item
        prop="healthDesc"
        label-float
        label="请描述病况（不共享）"
        v-if="formMsg.healthStatus==3"
        :rules="msgVerify"
      >
        <mu-text-field
          multi-line
          :rows="1"
          :rows-max="20"
          @blur="closeKeyboard"
          @input="closeVerify"
          v-model="formMsg.healthDesc"
        ></mu-text-field>
      </mu-form-item>
      <!-- 是否需要帮助 -->
      <mu-form-item prop="needHelpFlag" :rules="msgVerify">
        <div slot="label" class="form_label">
          是否需要帮助
          <mu-icon value="group" size="18" class="icon" color="#448AFF"></mu-icon>
        </div>
        <div class="select-control-group">
          <mu-flex class="select-control-row" :key="'radio ' + i" v-for="(item,i) in help">
            <mu-radio
              :value="item.value"
              v-model="formMsg.needHelpFlag"
              color="#FF7600"
              :label="item.label"
            ></mu-radio>
          </mu-flex>
        </div>
      </mu-form-item>
      <!-- 需要什么帮助说明 -->
       <mu-form-item
        prop="needHelpContent"
        label-float
        label="备注"
        v-if="formMsg.needHelpFlag==1"
        :rules="msgVerify"
      >
        <mu-text-field
          multi-line
          :rows="1"
          :rows-max="20"
          @blur="closeKeyboard"
          @input="closeVerify"
          v-model="formMsg.needHelpContent"
        ></mu-text-field>
      </mu-form-item>
      <!-- 居住点 -->
      <mu-form-item prop="customerLocation" :rules="msgVerify">
        <div slot="label" class="form_label">
          现在居住地
          <mu-icon value="group" size="18" class="icon" color="#448AFF"></mu-icon>
        </div>
        <div class="select-control-group">
          <mu-flex class="select-control-row" :key="'radio ' + i" v-for="(item,i) in areaList">
            <mu-radio
              :value="item.value"
              v-model="formMsg.customerLocation"
              color="#FF7600"
              :label="item.label"
            ></mu-radio>
          </mu-flex>
        </div>
      </mu-form-item>
      <mu-form-item
        prop="customerLocationDesc"
        :rules="msgVerify"
        label-float
        label="请选择"
        v-if="formMsg.customerLocation==2"
      >
        <mu-text-field multi-line v-model="formMsg.customerLocationDesc" @focus="noFocus($event)">
          <mu-button slot="append" flat small color="#FF7600" @click="openAddres=true">
            <mu-icon value="pin_drop"></mu-icon>
          </mu-button>
        </mu-text-field>
      </mu-form-item>
    </mu-form>
    <mu-paper class="form_footer_btn" :z-depth="4">
      <mu-button class="btn" color="warning" textColor="#424242" full-width @click="next">下一步</mu-button>
    </mu-paper>
    <addresss-paker :show.sync="openAddres" @getAddress="keepAddres"></addresss-paker>
  </mu-paper>
</template>
<script>
import AddresssPaker from './AddresssPaker';
import upLoadImg from '@/components/upLoadImg';
export default {
  components: { AddresssPaker, upLoadImg },
  data () {
    return {
      viewBox: undefined,
      imgList: [],
      imgUrl: [],
      openAddres: false,
      formMsg: {
        healthStatus: '',
        healthDesc: '',
        customerLocation: '',
        customerLocationDesc: '',
        feverDesc: '',
        needHelpFlag: undefined, // 是否需要帮助
        needHelpContent: '' // 帮助内容
      },
      msgVerify: [{ validate: (val) => {
        if (val === 0) {
          return true;
        } else {
          return !!val;
        }
      },
      message: '请认真填写该信息' }],
      radioList: [
        {
          label: '健康',
          value: 1
        },
        {
          label: '有发烧、咳嗽等症状',
          value: 2
        },
        {
          label: '其它病况',
          value: 3
        }
      ],
      areaList: [
        {
          label: '现有租赁房屋',
          value: 1
        },
        {
          label: '其它城市',
          value: 2
        }
      ],
      help: [
        {
          label: '不需要',
          value: 0
        },
        {
          label: '需要帮助',
          value: 1
        }
      ]
    };
  },
  created () {
    this.formMsg = Object.assign(
      this.formMsg,
      this.$store.state.wxSurvey.healthObject
    );
    if (this.formMsg.recordFile.split(',')[0]) {
      this.imgUrl = this.formMsg.recordFile.split(',');
    } else {
      this.imgUrl = [];
    }
  },
  methods: {
    next () {
      this.$refs.myForm.validate().then(result => {
        if (result) {
          this.formMsg.recordFile = this.imgList.join();
          this.$store.commit('wxSurvey/writeInFormData', this.formMsg);
          this.$emit('next');
          // 请求
        }
      });
    },
    noFocus (e) {
      e.target.blur();
      this.openAddres = true;
    },
    // 清空表单验证
    closeVerify () {
      this.$refs.myForm.clear();
    },
    // 保存地址
    keepAddres (value) {
      this.formMsg.customerLocationDesc = value;
      this.$refs.myForm.clear();
    },
    closeKeyboard () {
      const u = navigator.userAgent;
      if (!(u.indexOf('Android') > -1 || u.indexOf('Linux') > -1)) {
        // IOS手机 { // ios
        setTimeout(() => {
          window.scrollTo(0, document.body.scrollTop + 1);
          document.getElementsByTagName('body')[0].style.height =
            window.innerHeight + 'px';
          document.body.scrollTop >= 1 &&
            window.scrollTo(0, document.body.scrollTop - 1);
        }, 50);
      }
    },
    // 保存图片
    keepNewPic (param) {
      let path = param.visitPath + param.filePath;
      this.imgUrl.push(path);
      this.imgList.push(param.filePath);
    },
    // 图片预览
    lookHand (index, arr) {
      if (arr.length === 0) return;
      this.viewBox = this.$Prive({
        imgList: arr,
        current: index
      });
    },
    // 删除图片
    deleteImage (val, index) {
      this.imgList.splice(index, 1);
      this.imgUrl.splice(index, 1);
    }
  },
  watch: {
    'formMsg.healthStatus': function (newV, oldV) {
      switch (newV) {
        case 1:
          this.imgList = [];
          this.formMsg.feverDesc = '';
          this.formMsg.healthDesc = '';
          break;
        case 2:
          this.formMsg.healthDesc = '';
          break;
        case 3:
        default:
          this.imgList = [];
          this.formMsg.feverDesc = '';
          break;
      }
      this.closeVerify();
    },
    'formMsg.customerLocation': function (newV, oldV) {
      if (newV !== 2) {
        this.formMsg.customerLocationDesc = '';
      }
    },
    'formMsg.needHelpFlag': function (newV, oldV) {
      if (newV !== '1') {
        this.formMsg.needHelpContent = '';
      }
    }
  },
  beforeDestroy () {
    if (this.viewBox) this.viewBox.close();
  }
};
</script>
<style lang="less" scoped>
.unload_wrap {
  width: 100%;
}
.top_hit {
  margin-top: -15px;
  margin-right: -35px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  color: #707070;
  transform: scale(0.8);
}

.form_two {
  padding: 24px 24px 20px;
  margin-bottom: 10px;
  overflow-x: hidden;
  .icon {
    margin: 0 5px;
  }
  .form_label {
    display: flex;
    align-items: center;
    font-size: 16px;
    font-weight: 800;
    color: #000000;
  }
  .select-control-row {
    padding: 8px 0;
  }
  .select-control-group {
    margin: 16px 0;
    font-size: 14px;
  }
}
.btn {
  border-radius: 4px;
}
.pic_box {
  margin-top: 15px;
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
      right: -10px;
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
</style>
