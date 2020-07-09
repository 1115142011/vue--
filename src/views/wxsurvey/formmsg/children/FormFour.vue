<template>
  <section>
    <mu-paper class="v_block form_two wx" :z-depth="1">
      <div class="top_hit">
        带有
        <mu-icon value="group" size="18" color="#448AFF" class="icon"></mu-icon>的信息会与室友共享
      </div>
      <mu-form ref="myForm" :model="formMsg" class="form_Msg">
        <!-- 健康状况 -->
        <mu-form-item prop="contactWuhanFlag" :rules="msgVerify">
          <div slot="label" class="form_label">
         14天内，是否在湖北停留或路过，或接触过来自 湖北的人？
            <mu-icon value="group" size="18" class="icon" color="#448AFF"></mu-icon>
          </div>
          <div class="select-control-group">
            <mu-flex class="select-control-row" :key="'radio ' + i" v-for="(item,i) in radioList">
              <mu-radio
                :value="item.value"
                v-model="formMsg.contactWuhanFlag"
                color="#FF7600"
                :label="item.label"
              ></mu-radio>
            </mu-flex>
          </div>
        </mu-form-item>
        <!-- 居住点 -->
        <mu-form-item prop="contactPatientFlag" :rules="msgVerify">
          <div slot="label" class="form_label">
            14天内是否有过病例接触史
            <mu-icon value="group" size="18" class="icon" color="#448AFF"></mu-icon>
          </div>
          <div class="select-control-group">
            <mu-flex class="select-control-row" :key="'radio ' + i" v-for="(item,i) in areaList">
              <mu-radio
                :value="item.value"
                v-model="formMsg.contactPatientFlag"
                color="#FF7600"
                :label="item.label"
              ></mu-radio>
            </mu-flex>
          </div>
        </mu-form-item>
        <!-- <mu-form-item prop="otherInfo"  label="其它说明">
           <div slot="label" class="form_label">
            还有没有其它信息呢
          </div>
          <mu-text-field
            multi-line
            :rows="2"
            :rows-max="20"
            placeholder="如您有疫情相关的信息需要反馈请留言,留言信息不共享"
            @blur="closeKeyboard"
            @input="closeVerify"
            v-model="formMsg.otherInfo"
          ></mu-text-field>
        </mu-form-item> -->
      </mu-form>
      <mu-paper class="form_footer_btn" :z-depth="4">
      <mu-button class="btn" color="warning" textColor="#424242" full-width @click="next">下一步</mu-button>
      </mu-paper>
    </mu-paper>

  </section>
</template>
<script>
export default {
  data () {
    return {
      loading: false,
      openAddres: false,
      formMsg: {
        contactWuhanFlag: '',
        contactPatientFlag: ''
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
          label: '是, 有过',
          value: 1
        },
        {
          label: '否, 没有',
          value: 0
        }
      ],
      areaList: [
        {
          label: '是, 有接触过',
          value: 1
        },
        {
          label: '否, 没接触过',
          value: 0
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
    // 清空表单验证
    closeVerify () {
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

.form_two {
  padding: 24px 24px 20px;
  overflow-x: hidden;
  .icon {
    margin: 0 5px;
    vertical-align: middle;
  }
  .form_label {
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
</style>
