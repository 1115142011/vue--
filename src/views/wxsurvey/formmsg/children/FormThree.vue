<template>
  <mu-paper class="v_block form_two wx" :z-depth="1">
    <div class="top_hit">
      带有
      <mu-icon value="group" size="18" color="#448AFF" class="icon"></mu-icon>的信息会与室友共享
    </div>
    <mu-form ref="myForm" :model="formMsg" class="form_Msg">
      <!-- 是否返回成都 -->
      <mu-form-item prop="returnFlag" :rules="msgVerify">
        <div slot="label" class="form_label">
          是否已返回成都
          <mu-icon value="group" size="18" class="icon" color="#448AFF"></mu-icon>
        </div>
        <div class="select-control-group">
          <mu-flex class="select-control-row" :key="'radio ' + i" v-for="(item,i) in radioList">
            <mu-radio
              :value="item.value"
              v-model="formMsg.returnFlag"
              color="#FF7600"
              :label="item.label"
            ></mu-radio>
          </mu-flex>
        </div>
      </mu-form-item>
      <!-- 未返回成都 -->
      <div v-if="formMsg.returnFlag===0">
        <mu-form-item prop="returnPlanTime" label-float label="计划返回时间" :rules="msgVerify">
          <mu-date-input
            v-model="formMsg.returnPlanTime"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
            action-icon="date_range"
          ></mu-date-input>
        </mu-form-item>
        <mu-form-item prop="returnSource" label-float label="从哪个城市返回" :rules="msgVerify">
          <mu-text-field multi-line v-model="formMsg.returnSource" @focus="noFocus($event)">
            <mu-button slot="append" flat small color="#FF7600" @click="openAddres=true">
              <mu-icon value="pin_drop"></mu-icon>
            </mu-button>
          </mu-text-field>
          <mu-icon value="group" size="18" class="positionIcon" color="#448AFF"></mu-icon>
        </mu-form-item>
      </div>
      <!--已返回成都 返程信息收集 -->
      <div class="backMsg_box" v-if="formMsg.returnFlag===1">
        <mu-form-item prop="returnSource" label-float label="从哪个城市返回" :rules="msgVerify">
          <mu-text-field multi-line v-model="formMsg.returnSource" @focus="noFocus($event)">
            <mu-button slot="append" flat small color="#FF7600" @click="openAddres=true">
              <mu-icon value="pin_drop"></mu-icon>
            </mu-button>
          </mu-text-field>
          <mu-icon value="group" size="18" class="positionIcon" color="#448AFF"></mu-icon>
        </mu-form-item>
        <mu-form-item prop="returnTime" label-float label="返回成都时间" :rules="msgVerify">
          <mu-date-input v-model="formMsg.returnTime"></mu-date-input>
          <mu-icon value="date_range" size="18" class="positionIcon" color="#FF7600"></mu-icon>
        </mu-form-item>
        <mu-form-item prop="returnWay" label-float label="交通方式" :rules="msgVerify">
          <mu-select v-model="formMsg.returnWay">
            <mu-option
              v-for="(item,index) in options"
              :key="'item'+index"
              :label="item.label"
              :value="item.value"
            ></mu-option>
          </mu-select>
          <mu-icon value="directions_car" size="18" class="positionIcon" color="#FF7600"></mu-icon>
        </mu-form-item>
        <mu-form-item prop="returnWayCode" label-float label="航班车次">
          <mu-text-field
            multi-line
            :rows="1"
            :rows-max="2"
            @blur="closeKeyboard"
            @input="closeVerify"
            v-model="formMsg.returnWayCode"
          ></mu-text-field>
        </mu-form-item>
      </div>
    </mu-form>
    <mu-paper class="form_footer_btn" :z-depth="4">
      <mu-button class="btn" color="warning" textColor="#424242" full-width @click="next">下一步</mu-button>
    </mu-paper>
    <addresss-paker :show.sync="openAddres" @getAddress="keepAddres"></addresss-paker>
  </mu-paper>
</template>
<script>
import AddresssPaker from './AddresssPaker';

export default {
  components: { AddresssPaker },
  data () {
    return {
      openAddres: false,
      formMsg: {
        returnFlag: '',
        leaveTime: '', // 离开城的的时间
        returnTime: undefined,
        returnPlanTime: undefined, // 计划返回时间
        returnWayCode: '',
        otherInfo: '', // 其它信息
        returnSource: '',
        returnWay: '' // 交通工具
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
          label: '放假未离开成都',
          value: 9
        },
        {
          label: '还没回',
          value: 0
        },
        {
          label: '回来了',
          value: 1
        }
      ],
      options: [
        {
          label: '飞机',
          value: 1
        },
        {
          label: '火车',
          value: 2
        },
        {
          label: '自驾',
          value: 3
        },
        {
          label: '地铁',
          value: 4
        },
        {
          label: '客车',
          value: 5
        },
        {
          label: '公交',
          value: 6
        },
        {
          label: '出租车',
          value: 7
        },
        {
          label: '轮船',
          value: 8
        },
        {
          label: '其它',
          value: 9
        }
      ]
    };
  },
  created () {
    this.formMsg = Object.assign(
      this.formMsg,
      this.$store.state.wxSurvey.healthObject
    );
  },
  methods: {
    next () {
      this.$refs.myForm.validate().then(result => {
        if (result) {
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
      this.formMsg.returnSource = value;
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
    }
  },
  watch: {
    'formMsg.returnFlag': function (newV, oldV) {
      if (newV === 0) {
        // 未归
        this.formMsg.leaveFlag = 1;
        this.formMsg.returnTime = undefined;
        this.formMsg.returnWayCode = '';
        this.formMsg.returnSource = '';
        this.formMsg.returnWay = ''; // 交通工具
      } else if (newV === 1) { // 回来了
        this.formMsg.leaveFlag = 1;
        this.formMsg.returnPlanTime = undefined; // 计划返回时间
      } else if (newV === 9) {
        this.formMsg.leaveFlag = 0;
        this.formMsg.returnTime = undefined;
        this.formMsg.returnWayCode = '';
        this.formMsg.returnSource = '';
        this.formMsg.returnWay = ''; // 交通工具
        this.formMsg.returnPlanTime = undefined; // 计划返回时间
        this.formMsg.returnSource = '';
      }
    }
  }
};
</script>
<style lang="less" scoped>
.top_hit {
  margin-top: -15px;
  margin-right: -35px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  color: #707070;
  transform: scale(0.8);
}
.positionIcon {
  position: absolute;
  left: 100%;
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
.backMsg_box {
  padding-right: 20px;
}
.btn {
  border-radius: 4px;
}
</style>
