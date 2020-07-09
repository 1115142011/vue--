<template>
  <section class="v_page">
    <!-- 导航 -->
    <mu-appbar class="v_topNav" color="#fdd835" textColor="#000">
      <mu-button icon slot="left" @click="back">
        <mu-icon value="arrow_back"></mu-icon>
      </mu-button>
      <div class="center" slot="default">报修（{{succeed?2:1}}/2）</div>
    </mu-appbar>
    <!-- 内容区 -->
    <div class="v_mainContainer skipRem">
      <mu-paper class="v_block" :z-depth="1" v-if="!succeed">
        <mu-form ref="form_one" :model="formOne" class="form_one">
          <mu-stepper :active-step="vactiveStep" orientation="vertical">
            <!-- tep1 -->
            <mu-step>
              <mu-step-label>哪里出了问题</mu-step-label>
              <mu-step-content>
                <!-- 房间 -->
                <mu-form-item label="房间" label-float prop="houseSelect" :rules="usernameRules">
                  <mu-select v-model="formOne.houseSelect" color="#FF7600" full-width>
                    <mu-option
                      v-for="(item,index) in houseInfo"
                      :key="'item'+index"
                      :label="item.house_name"
                      :value="item"
                      ripple
                    ></mu-option>
                  </mu-select>
                </mu-form-item>
                <!-- 位置 -->
                <mu-form-item label="位置" label-float prop="areaSelect" :rules="usernameRules">
                  <mu-select color="#FF7600" v-model="formOne.areaSelect" full-width>
                    <mu-option
                      v-for="(item,index) in areaList"
                      :key="'item'+index"
                      :label="item.name"
                      :value="item"
                      ripple
                    ></mu-option>
                  </mu-select>
                </mu-form-item>
                <!-- 问题分类 -->
                <mu-form-item label="问题分类" prop="categorySelect" :rules="usernameRules">
                  <!-- 一级问题类 -->
                  <mu-select color="#FF7600" v-model="formOne.categorySelect" full-width>
                    <mu-option
                      v-for="(item,index) in categoryInfo"
                      :key="'item'+index"
                      :label="item.bigName"
                      :value="item"
                      ripple
                    ></mu-option>
                  </mu-select>
                </mu-form-item>
                <!-- 二级问题类 -->
                <mu-form-item label="问题分类-小项" prop="smallSelect" :rules="usernameRules">
                  <mu-select color="#FF7600" v-model="formOne.smallSelect" full-width>
                    <mu-option
                      v-for="(item,index) in smallList"
                      :key="'item'+index"
                      :label="item.label"
                      :value="item"
                      ripple
                    ></mu-option>
                  </mu-select>
                </mu-form-item>
                <!-- 维修时间 -->
                <mu-form-item
                  label="期望维修时间"
                  label-float
                  prop="reservationTime"
                  :rules="usernameRules"
                >
                  <mu-date-input
                    color="#FF7600"
                    v-model="formOne.reservationTime"
                    no-display
                    full-width
                    format="YYYY-MM-DD"
                    value-format="YYYY-MM-DD"
                    action-icon="date_range"
                    :should-disable-date="endDisableDate"
                  ></mu-date-input>
                </mu-form-item>

                <mu-button color="warning" textColor="#424242" @click="next">下一步</mu-button>
              </mu-step-content>
            </mu-step>
            <!-- step2 -->
            <mu-step>
              <mu-step-label>请详细描述问题情况</mu-step-label>
              <mu-step-content>
                <mu-form-item prop="desc" :rules="usernameRules">
                  <mu-text-field
                    color="#FF7600"
                    v-model="formOne.desc"
                    multi-line
                    :rows-max="5"
                    :rows="1"
                    placeholder="问题描述"
                    action-icon="create"
                  ></mu-text-field>
                </mu-form-item>
                <mu-button color="warning" @click="next" textColor="#424242">下一步</mu-button>
                <mu-button flat color="primary" class="right_btn" @click="prev">上一步</mu-button>
              </mu-step-content>
            </mu-step>
            <mu-step>
              <mu-step-label>请拍摄几张照片</mu-step-label>
              <mu-step-content>
                <div class="pic_box">
                  <div class="pic_box">
                    <div v-for="(val,i) in imgList" :key="'item'+i" class="prive_image">
                      <img
                        @click="lookHand(i,imgList)"
                        class="img"
                        :src="val.visitPath+val.filePath"
                      />
                      <mu-button
                        color="primary"
                        class="delet_icon"
                        icon
                        small
                        @click="deleteImage(val,i)"
                      >
                        <mu-icon value="cancel" color="red"></mu-icon>
                      </mu-button>
                    </div>
                    <upLoad-img :fileList="imgList" @keepNewPic="keepNewPic" :multiple="true"></upLoad-img>
                  </div>
                </div>
                <mu-button color="warning" textColor="#424242" @click="finsh">完成</mu-button>
                <mu-button flat color="primary" class="right_btn" @click="prev">上一步</mu-button>
              </mu-step-content>
            </mu-step>
          </mu-stepper>
          <div class="center" v-show="vactiveStep>2">
            填写完成
            <span class="link" @click="reset">查看</span>
          </div>
        </mu-form>
      </mu-paper>
      <mu-paper class="v_block" :z-depth="1" v-if="succeed">
        <div class="title">{{houseName}}</div>
        <div class="center">
          <img class="middle_pic" :src="imgUrl" alt />
        </div>
        <div class="center weight">报修已记录我们会尽快处理</div>
        <div class="center smaill">请保持电通畅，祝您生活愉快</div>
      </mu-paper>
    </div>
    <mu-paper class="footerBtn" :z-depth="5" v-if="!succeed">
      <mu-button
        textColor="#424242"
        color="warning"
        data-mu-loading-text="...."
        v-loading="submitLoading"
        :disabled="vactiveStep<=2||submitLoading"
        @click="submit"
      >提交</mu-button>
    </mu-paper>
    <!-- 报修须知 -->
    <mu-dialog
      width="85%"
      max-width="85%"
      scrollable
      :overlay-close="false"
      :esc-press-close="false"
      :open.sync="showNotice"
    >
      <div slot="title" class="dialog-title">报修须知</div>
      <div class="dialog-content">
        <div>尊敬的客户，您好！</div>
        <div>感谢您对像素公寓的支持，为保证我们快速给您处理问题，请您在提交维修时注意以下几点：</div>
        <div>1、请尽量将您遇到的问题准确描述，如果能提供图片将有助于我们快速定位问题，并快速协助您解决问题。</div>
        <div>2、维修问题提交后，请您保持电话畅通，我们会尽快安排工作人员上门给您处理问题。</div>
        <div>
          3、维修服务过程中，欢迎您对我们的服务作出评价。您也可以拨打像素公寓服务热线
          <a href="tel:4008063399">400 806 3399</a>与我们保持沟通。
        </div>
        <div>4、针对人为原因造成的维修问题，我们会根据维修实际收取维修费用，请您理解。</div>
      </div>
      <mu-button
        slot="actions"
        color="rgb(253, 216, 53)"
        textColor="#333333"
        @click="closeNotice"
      >我已了解</mu-button>
    </mu-dialog>
  </section>
</template>
<script>
import { getUserRooms, submitMsg } from '@/api/repairsApi';
import upLoadImg from '@/components/upLoadImg';
export default {
  components: { upLoadImg },
  data () {
    return {
      succeed: false, // 提交成功
      showNotice: true, // 报修须知
      Notice_timer: 60,
      submitLoading: false,
      houseName: '',
      viewBox: null,
      imgUrl: require('@/assets/images/login.gif'),
      vactiveStep: 0, // 步进器当前位置
      usernameRules: [{ validate: val => !!val, message: '该选项必须填写' }],
      categoryInfo: [],
      smallList: [],
      houseInfo: [],
      areaList: [],
      formOne: {
        houseSelect: undefined,
        areaSelect: undefined,
        categorySelect: undefined,
        smallSelect: undefined,
        reservationTime: undefined,
        desc: '', // 问题描述
        file: []
      },
      imgList: []
    };
  },
  created () {
    getUserRooms().then(res => {
      if (!res.data || !res.data.categoryInfo) {
        // this.$router.push('/unRegistered');
      }
      this.categoryInfo = res.data.categoryInfo;
      this.houseInfo = res.data.houseInfo;
      this.smallList = this.categoryInfo[0].small;
      this.areaList = this.houseInfo[0].rooms;
    });
  },
  methods: {
    // 返回
    back () {
      this.$router.go(-1);
    },
    // 点击下一步
    next () {
      this.$refs.form_one.validate().then(result => {
        if (result) {
          this.vactiveStep += 1;
        } else {
          this.$toast.error('信息填写不完整！请检查必填项');
        }
      });
    },
    prev () {
      this.vactiveStep -= 1;
    },
    reset () {
      this.vactiveStep = 0;
    },
    // 结束日期禁用
    endDisableDate (date) {
      let mindate = Date.parse(new Date());
      return Date.parse(date) < mindate;
    },
    // 上传图片成功
    keepNewPic (param) {
      this.imgList.push(param);
    },
    // 删除图片
    deleteImage (val, index) {
      this.imgList.splice(index, 1);
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
    // 检查信息
    finsh () {
      if (this.imgList.length > 0) {
        this.vactiveStep += 1;
      } else {
        this.$toast.error('请提问题交照片');
      }
    },
    // 提交数据
    submit () {
      this.submitLoading = true;
      let data = {
        houseId: this.formOne.houseSelect.house_id,
        roomId: this.formOne.areaSelect.roomId,
        roomName: this.formOne.areaSelect.name,
        bigId: this.formOne.categorySelect.bigId,
        bigName: this.formOne.categorySelect.bigName,
        smallId: this.formOne.smallSelect.value,
        smallName: this.formOne.smallSelect.label,
        desc: this.formOne.desc,
        reservationTime: this.formOne.reservationTime,
        file: this.imgList
      };
      submitMsg(data)
        .then(({ data }) => {
          this.succeed = true;
          this.submitLoading = false;
          this.houseName = data.houseName + '-' + data.roomName;
        })
        .catch(e => {
          this.submitLoading = false;
        });
    },
    // 关闭 报修须知弹框
    closeNotice () {
      this.showNotice = false;
      this.Notice_timer = 0;
    }
  },
  beforeDestroy () {
    if (this.viewBox) this.viewBox.close();
  },
  watch: {
    'formOne.houseSelect': function (newV, oldV) {
      this.areaList = newV.rooms;
      this.formOne.areaSelect = undefined;
    },
    'formOne.categorySelect': function (newV, oldV) {
      this.smallList = newV.small;
      this.formOne.smallSelect = undefined;
    }
  }
};
</script>
<style lang="less" scoped>
.v_mainContainer {
  &.skipRem {
    padding-bottom: 56px;
  }
}
.v_block {
  padding-bottom: 25px;
}
.link {
  padding: 5px;
  color: #397eff;
}
.title {
  word-break: break-all;
  padding: 5px 10px;
  background: #4f4f4f;
  color: #ffffff;
  font-size: 18px;
}
.center {
  display: flex;
  justify-content: center;
  align-items: center;
}
.weight {
  font-size: 16px;
  font-weight: 600;
}
.smaill {
  font-size: 12px;
}
.middle_pic {
  width: 35%;
  height: 200px;
}
// 描述信息输入框
.textarea {
  width: 100%;
  min-height: 100px;
  outline: 0;
  border: 1px solid #397eff;
  -webkit-user-modify: read-write-plaintext-only;
  font-size: 14px;
  line-height: 26px;
  text-indent: 0.7rem;
  resize: none;
}
.right_btn {
  margin-left: 15px;
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
.footerBtn {
  width: 100%;
  padding: 5px 10px;
  position: absolute;
  bottom: 0;
  left: 0;
  text-align: right;
}

/deep/.mu-step-label.completed .mu-step-label-icon {
  color: #ff9110;
}
/deep/.mu-step-label.active .mu-step-label-circle {
  background: #ff9110;
}
/deep/.mu-form-item__focus {
  color: #ff7600;
}
</style>
