<template>
  <section>
    <mu-paper class="v_block form_two wx" :z-depth="1">
    <div class="top_hit">
      带有
      <mu-icon value="group" size="18" color="#448AFF" class="icon"></mu-icon>的信息会与室友共享
    </div>
    <mu-form ref="myForm" :model="formMsg" class="form_Msg">
      <!-- 是否复工 -->
      <mu-form-item prop="returnWorkFlag" :rules="msgVerify">
        <div slot="label" class="form_label">
          是否已经复工？
          <mu-icon value="group" size="18" class="icon" color="#448AFF"></mu-icon>
        </div>
        <div class="select-control-group">
          <mu-flex class="select-control-row" :key="'radio ' + i" v-for="(item,i) in radioList">
            <mu-radio
              :value="item.value"
              v-model="formMsg.returnWorkFlag"
              color="#FF7600"
              :label="item.label"
            ></mu-radio>
          </mu-flex>
        </div>
      </mu-form-item>
      <mu-form-item>
         <div slot="label" class="form_label">
         疫情期间未解决问题申报 (选填)
        </div>
        <mu-text-field
          multi-line
          :rows="2"
          :rows-max="20"
          placeholder="未处理问题申报"
          @blur="closeKeyboard"
          @input="closeVerify"
          v-model="formMsg.unsolvedProblem"
        ></mu-text-field>
      </mu-form-item>
        <mu-form-item>
         <div slot="label" class="form_label">
         疫情期间服务建议与投诉 (选填)
        </div>
        <mu-text-field
          multi-line
          :rows="2"
          :rows-max="20"
          placeholder="感谢您的支持！"
          @blur="closeKeyboard"
          @input="closeVerify"
          v-model="formMsg.otherInfo"
        ></mu-text-field>
      </mu-form-item>
    </mu-form>
      <mu-paper class="form_footer_btn" :z-depth="4">
        <mu-button
          class="btn"
          color="warning"
          textColor="#424242"
          full-width
          @click="next"
          v-loading="loading"
          :disabled="loading"
          data-mu-loading-overlay-color="#ffffff9c"
          data-mu-loading-color="#FF7600"
        >提交</mu-button>
      </mu-paper>
  </mu-paper>
   <div class="hint_msg">
      <mu-icon value="check_circle" size="18" class="icon" color="#67CD4D"></mu-icon>本人承诺提交的信息真实有效
    </div>
  </section>
</template>
<script>
import { saveUserData, deleteRecord } from '@/api/wxSurveyApi';

export default {
  data () {
    return {
      onClick: false,
      loading: false,
      openAddres: false,
      formMsg: {
        returnWorkFlag: '',
        unsolvedProblem: '', // 是否有未处理问题
        otherInfo: ''
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
          label: '是',
          value: 1
        },
        {
          label: '否',
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
      if (this.onClick) return;
      this.onClick = true;
      this.$refs.myForm.validate().then(result => {
        if (result) {
          let obj = {
            ...this.$store.state.wxSurvey.healthObject,
            ...this.formMsg
          };
          this.loading = true;
          let deleteId = this.$store.state.wxSurvey.deleteId;
          if (deleteId) {
            this.delete(deleteId, obj);
          } else {
            this.keepMyObj(obj);
          }
        }
      });
    },
    delete (id, param) {
      deleteRecord(id).then(res => {
        this.$store.commit('wxSurvey/setDeleteId', undefined);
        this.keepMyObj(param);
      }).catch(() => {
      });
    },
    noFocus (e) {
      e.target.blur();
      this.openAddres = true;
    },
    // 保存数据请求
    keepMyObj (param) {
      saveUserData(param).then(res => {
        this.loading = false;
        this.onClick = false;
        this.$store.commit('wxSurvey/resetData');
        this.$router.push('/wxsurvey/fitnessList');
        this.$toast.success({
          message: '打卡成功',
          time: 3000
        });
      }).catch(e => {
        this.loading = false;
      });
    },
    // 清空表单验证
    closeVerify () {
      this.$refs.myForm.clear();
    },
    // 保存地址
    keepAddres (value) {
      this.formMsg.areaName = value;
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
.hint_msg {
  color: #67cd4d;
  margin: 20px 0;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
