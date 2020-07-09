<template>
  <section class="v_page wx">
    <div class="top_pic">
      <img :src="logo" alt="logo" class="back_logo" />
      <img :src="logoBg" alt class="bg_pic" />
    </div>
    <mu-paper class="bottom_form" :z-depth="2">
      <mu-form ref="account" :model="formMsg">
        <mu-form-item label="手机号:" color="#FF7600" label-float prop="mobile" :rules="phoneNumber">
          <mu-text-field
            v-model="formMsg.mobile"
            pattern="[0-9]*"
            type="number"
            full-width
            prop="mobile"
            @input="clearHit"
            @blur="closeKeyboard"
          >
            <div slot="append">
              <mu-button flat small color="#FF7600" @click="getPasword" v-if="!requestFlag">获取验证码</mu-button>
              <mu-button flat small color="#FF7600" v-if="requestFlag">重新获取({{time}}s)</mu-button>
            </div>
          </mu-text-field>
        </mu-form-item>
        <mu-form-item label="验证码:" label-float prop="pas" :error-text="passWordError">
          <mu-text-field
            v-model="formMsg.pas"
            pattern="[0-9]*"
            type="number"
            full-width
            prop="mobile"
            @input="cutStr($event)"
            @blur="closeKeyboard"
          ></mu-text-field>
        </mu-form-item>
      </mu-form>
      <mu-button
        color="warning"
        class="subBtn"
        textColor="#424242"
        @click="submit"
        full-width
        v-loading="loading"
        data-mu-loading-overlay-color="#ffffff9c"
        data-mu-loading-color="#FF7600"
      >健康打卡</mu-button>
      <div class="footer_hit">—所有信息仅用于了解疫情，不会泄露做他用—</div>
    </mu-paper>
  </section>
</template>
<script>
import {
  getAuthcode,
  logointo,
  getUserHoseList,
  getCustomerCard
} from '@/api/wxSurveyApi';
export default {
  data () {
    return {
      loading: false,
      logo: require('@/assets/wx/logoBack.svg'),
      logoBg: require('@/assets/wx/logoBG.png'),
      time: 60,
      timer: undefined, // 计时器
      passWordError: '',
      requestFlag: false,
      formMsg: {
        mobile: '',
        pas: ''
      },
      phoneNumber: [
        { validate: val => !!val, message: '请填写电话号码' },
        {
          validate: val => /^1[3456789]\d{9}$/.test(val),
          message: '请填写正确的电话号码'
        }
      ],
      pawsNumber: [{ validate: val => !!val, message: '请填写验证码' }]
    };
  },
  created () {
    let url = window.location.href;
    if (url.split('openId=')[1]) {
      localStorage.setItem('openid', url.split('openId=')[1]);
    } else if (url.split('token=')[1]) {
      let paramArr = url.split('token=');
      let token = paramArr[1].split('&account=')[0];
      let mobile = paramArr[1].split('&account=')[1];
      localStorage.setItem('repaisToken', token);
      localStorage.setItem('ueserPhone', mobile);
      this.setUrl();
    }
  },
  methods: {
    setUrl () {
      let vm = this;
      getUserHoseList()
        .then(({ data }) => {
          if (data && data.houseList.length > 0) {
            getCustomerCard().then(({ data }) => {
              vm.loading = false;
              if (data && data.record) {
                if (data.record.customerType === 1) {
                  vm.$router.push('/wxsurvey/fitnessList');
                } else {
                  vm.$store.commit('wxSurvey/writeInFormData', {
                    customerType: 1
                  });
                  vm.$router.push('/wxsurvey/sign');
                }
              } else {
                vm.$store.commit('wxSurvey/writeInFormData', {
                  customerType: 1
                });
                vm.$router.push('/wxsurvey/sign');
              }
            });
          } else {
            vm.loading = false;
            vm.$router.push('/wxsurvey/NoLease');
          }
        })
        .catch(msg => {
          vm.loading = false;
          vm.$toast.error('服务器出错，请稍后再试');
        });
    },
    // 获取验证码
    getPasword () {
      this.$refs.account.validate().then(result => {
        if (result) {
          this.requestFlag = true;
          this.countTime();
          let param = {
            account: this.formMsg.mobile
          };
          getAuthcode(param)
            .then(res => {})
            .catch(msg => {
              if (msg.data.errorCode === '100101') {
                this.$toast.warning({
                  message:
                    '【未查询该手机号对应的租赁合约，请确认所填手机号是否与签约手机号一致，有问题请联系您的销售】',
                  time: 3000
                });
              }
              this.time = 2;
              this.loading = false;
            });
          // 请求
        }
      });
    },
    // 计时
    countTime () {
      this.timer = setInterval(() => {
        this.time -= 1;
        if (this.time <= 0) {
          clearInterval(this.timer);
          this.time = 60;
          this.requestFlag = false;
        }
      }, 1000);
    },
    // 清除验证信息
    clearHit () {
      this.$refs.account.clear();
      this.passWordError = '';
    },
    // 登录
    submit () {
      this.$refs.account.validate().then(result => {
        if (result && this.formMsg.pas) {
          // 请求
          this.loading = true;
          let param = {
            secret: this.formMsg.pas,
            openId: localStorage.getItem('openid'),
            account: this.formMsg.mobile
          };
          logointo(param)
            .then(res => {
              localStorage.setItem('repaisToken', res.data.token);
              localStorage.setItem('ueserPhone', param.account);
              this.setUrl();
            })
            .catch(msg => {
              if (msg.data.errorCode === '100101') {
                this.$toast.warning({
                  message:
                    '【未查询该手机号对应的租赁合约，请确认所填手机号是否与签约手机号一致，有问题请联系您的销售】',
                  time: 3000
                });
              }
              this.loading = false;
            });
        } else {
          this.passWordError = '请填写验证码';
        }
      });
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
    cutStr (e) {
      this.formMsg.pas = e.substring(0, 6);
      this.clearHit();
    }
  }
};
</script>
<style lang="less" scoped>
.v_page {
  background: #feda10;
  overflow-x: hidden;
  overflow-y: auto;
  .top_pic {
    width: 100%;
    height: 360px;
    position: relative;
    overflow: hidden;
    .bg_pic {
      width: 100%;
      height: 360px;
    }
    .back_logo {
      position: absolute;
      top: 90px;
      left: 15px;
      width: 500px;
      height: 200px;
    }
  }
  .bottom_form {
    // position: absolute;
    // bottom: 0;
    position: relative;
    width: 100%;
    bottom: 0;
    margin-top: -20px;
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
    padding: 20px 32px 0;
    z-index: 1;
    height: 300px;
    .subBtn {
      margin-top: 20px;
    }
    .footer_hit {
      margin-top: 10px;
      font-size: 12px;
      transform: scale(0.8);
      color: #bebebe;
    }
  }
}
</style>
