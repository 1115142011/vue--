<template>
  <section class="margin_box wx" v-if="houseData&&userData">
    <mu-paper class="v_block forom_one" :z-depth="1">
      <div class="group_item">
        <div class="left_msg">
          <mu-icon value="sentiment_satisfied" color="#FF7600"></mu-icon>
          <span class="name">租客</span>
        </div>
        <div class="right_msg">{{userData.name}}同住人</div>
      </div>
      <div class="group_item">
        <div class="left_msg">
          <mu-icon value="location_city" color="#10AEFF"></mu-icon>
          <span class="name">房间</span>
        </div>
        <div class="right_msg">{{houseData[0].houseName}}***</div>
      </div>
      <!-- 同住人信息表单 -->
      <mu-form ref="partenr" :model="formMsg" class="form_Msg">
        <div>请完善同住人基本信息</div>
        <!-- 健康状况 -->
        <mu-form-item label="与签约人的关系" prop="partnerType" label-float :rules="msgVerify">
          <mu-text-field @input="closeVerify" v-model="formMsg.partnerType"></mu-text-field>
        </mu-form-item>
        <!-- 居住点 -->
        <mu-form-item label="同住人姓名" prop="partnerName" label-float :rules="msgVerify">
          <mu-text-field  @input="closeVerify" v-model="formMsg.partnerName"></mu-text-field>
        </mu-form-item>
        <mu-form-item label="同住人联系方式" prop="partnerTel" label-float :rules="phoneNumber">
          <mu-text-field  @input="closeVerify" v-model="formMsg.partnerTel"></mu-text-field>
        </mu-form-item>
        <mu-form-item label="同住人身份证号" prop="partnerIdCard" label-float :rules="userCard">
          <mu-text-field   @input="closeVerify" v-model="formMsg.partnerIdCard"></mu-text-field>
        </mu-form-item>
      </mu-form>
    </mu-paper>
  </section>
</template>
<script>
export default {
  props: ['houseData', 'userData'],
  data () {
    return {
      formMsg: {
        partnerName: '',
        partnerTel: '',
        partnerIdCard: '',
        partnerType: '' // 关系
      },
      userCard: [
        {
          validate: val => /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(val),
          message: '身份证号码格式不正确'
        }
      ],
      msgVerify: [{ validate: val => !!val, message: '请认真填写该信息' }],
      phoneNumber: [
        { validate: val => !!val, message: '请认真填写该信息' },
        {
          validate: val => /^1[3456789]\d{9}$/.test(val),
          message: '请填写正确的电话号码'
        }
      ]
    };
  },
  methods: {
    closeVerify () {
      this.$refs.partenr.clear();
    }
  }
};
</script>
<style lang="less" scoped>
.form_Msg{
  margin-top: 15px
}
.forom_one {
  padding: 31px;
  position: relative;
}
.group_item {
  padding: 5px 0;
  display: flex;
  align-items: center;
  .left_msg {
    flex: 4;
    display: flex;
    align-items: center;
    .name {
      margin-left: 20px;
      font-size: 16px;
      font-weight: bold;
      line-height: 19px;
      color: #707070;
    }
  }
  .right_msg {
    flex: 7;
    padding-left: 5px;
  }
}
.btn {
  border-radius: 4px;
}
.margin_box {
  width: 100%;
  margin-bottom: 20px;
}
.radio {
  padding: 10px;
  position: absolute;
  top: 5px;
  left: 5px;
}
</style>
