<template>
  <div class="login-container">
    <div class="formBox">
      <el-select
        class="select-login"
        v-model="isUkey"
        placeholder="选择登录方式"
        @change="changeLogin"
      >
        <el-option
          v-for="item in isUkeyList"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
      <el-form
        v-if="!isUkey"
        ref="loginForm"
        :model="loginForm"
        :rules="loginRules"
        class="login-form"
        autocomplete="on"
        label-position="left"
      >
        <div class="title-container">
          <h3 class="title">
            {{ $t("login.title") }}
          </h3>
          <!--<lang-select class="set-language" />-->
        </div>
        <el-form-item prop="username">
          <span class="svg-container">
            <!--<svg-icon name="user" />-->
            <img
              src="../../assets/login/user.png"
              alt=""
            >
          </span>
          <el-input
            ref="username"
            v-model="loginForm.username"
            :placeholder="$t('login.username')"
            name="username"
            type="text"
            tabindex="1"
            autocomplete="on"
          />
        </el-form-item>

        <el-tooltip
          v-model="capsTooltip"
          content="Caps lock is On"
          placement="right"
          manual
        >
          <el-form-item prop="password">
            <span class="svg-container">
              <!--<svg-icon name="password" />-->
              <img
                src="../../assets/login/passWord.png"
                alt=""
              >
            </span>
            <el-input
              :key="passwordType"
              ref="password"
              v-model="loginForm.password"
              :type="passwordType"
              :placeholder="$t('login.password')"
              name="password"
              tabindex="2"
              autocomplete="on"
              @keyup.native="checkCapslock"
              @blur="capsTooltip = false"
              @keyup.enter.native="handleLogin"
            />
            <span
              class="show-pwd"
              @click="showPwd"
            >
              <svg-icon
                :name="passwordType === 'password' ? 'eye-off' : 'eye-on'"
              />
            </span>
          </el-form-item>
        </el-tooltip>
        <div class="passwordY">
          <el-form-item
            prop="code"
            style="width: 271px; margin-bottom: 23px"
          >
            <span class="svg-container">
              <img
                src="../../assets/login/one.png"
                alt=""
              >
            </span>
            <el-input
              v-model="loginForm.code"
              :placeholder="'验证码'"
            />
          </el-form-item>
          <div
            class="passWordImg"
            @click="getIdentifyCode"
          >
            <!-- <code-identify :identifyCode="identifyCode"></code-identify> -->
            <img
              :src="identifyCode"
              width="100%"
              height="100%"
              alt
            >
          </div>
        </div>

        <el-checkbox
          v-model="checked"
          class="checked-password"
        >
          记住密码
        </el-checkbox>
        <div style="position: relative">
        </div>
      </el-form>

      <el-form
        v-show="isUkey"
        ref="ukeyFormLogin"
        class="login-form ukey-form"
        :model="ukeyForm"
        :rules="ukeyFormRules"
      >
        <div class="title-container">
          <h3 class="title">
            {{ $t("login.title") }}
          </h3>
        </div>
        <el-form-item
          prop="ukeyUser"
          class="ukeyUser"
        >
          <el-select
            v-model="ukeyForm.ukeyUser"
            style="width: 100%"
            placeholder="请选择数字证书"
          >
            <el-option
              v-for="item in ukeyList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item prop="ukeyPassword">
          <span class="svg-container">
            <img
              src="../../assets/login/passWord.png"
              alt=""
            >
          </span>
          <el-input
            v-model="ukeyForm.ukeyPassword"
            type="password"
            placeholder="请输入证书密码"
          />
        </el-form-item>
      </el-form>
      <div class="btns">
        <el-button
          :loading="loading"
          type="primary"
          style="width: 100%; margin-bottom: 30px; margin-top: 16px"
          @click.native.prevent="handleLogin"
        >
          {{ $t("login.logIn") }}
        </el-button>
      </div>
    </div>

    <el-dialog
      :title="$t('login.thirdparty')"
      :visible.sync="showDialog"
    >
      {{ $t("login.thirdpartyTips") }}
      <br>
      <br>
      <br>
      <social-sign />
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import { Route } from "vue-router";
import { Dictionary } from "vue-router/types/router";
import { Form as ElForm, Input } from "element-ui";
import { UserModule } from "@/store/modules/user";
import LangSelect from "@/components/LangSelect/index.vue";
import SocialSign from "./components/SocialSignin.vue";
import CodeIdentify from "@/components/CodeIdentify";
import { validatePassword } from "@/utils/validate";
import { init, WebsocketInterface } from "@/utils/XTXSAB";

@Component({
  name: "Login",
  components: {
    LangSelect,
    SocialSign,
    CodeIdentify
  }
})
export default class extends Vue {
  private validateUsername = (rule: any, value: string, callback: Function) => {
    if (!value) {
      callback(new Error("请输入用户名"));
    } else {
      callback();
    }
  };

  // admin Dapeng2020
  private loginForm = {
    username: "",
    password: "",
    code: ""
  };

  private ukeyForm = {
    ukeyUser: "",
    ukeyPassword: "",
    code: ""
  }

  private loginRules = {
    password: [{ validator: validatePassword, trigger: "blur" }],
    username: [{ validator: this.validateUsername, trigger: "blur" }]
    // code: [{ validator: this.validateCode, trigger: 'blur' }]
  };

  private ukeyFormRules = {
    ukeyUser: [
      { required: true, message: "请选择数字证书", trigger: "blur" }
    ],
    ukeyPassword: [
      { required: true, message: "请输入证书口令", trigger: "blur" }
    ],
  }

  private isUkey = false;
  private isUkeyList = [
    { label: "账号密码登录", value: false },
    { label: "ukey登录", value: true }
  ]

  private certID = null // 证书操作唯一标识，也支持只输入设备序列号。
  private cert = null // Base64 编码的证书。
  private serialNum = null // 序列号
  private InData = null // 服务器返回的InData(签名原文)
  private ukeyList = [] // ukey列表
  private signValue = null // 随机数签名值
  private sfId = null // 证书唯一实体标识
  private picSign = "" //

  private passwordType = "password";
  private loading = false;
  private showDialog = false;
  private capsTooltip = false;
  private redirect?: string;
  private checked = false;
  private identifyCode = "";
  private otherQuery: Dictionary<string> = {};
  private timeStamps = 0;

  @Watch("$route", { immediate: true })
  private onRouteChange(route: Route) {
    // TODO: remove the "as Dictionary<string>" hack after v4 release for vue-router
    // See https://github.com/vuejs/vue-router/pull/2050 for details
    const query = route.query as Dictionary<string>;
    console.log('onRouteChange', route)
    if (query) {
      this.redirect = query.redirect;
      this.otherQuery = this.getOtherQuery(query);
    }
  }

  mounted() {
    this.getIdentifyCode();
    this.enterKeyup();
    if (this.loginForm.username === "") {
      (this.$refs.username as Input).focus();
    } else if (this.loginForm.password === "") {
      (this.$refs.password as Input).focus();
    }
  }

  beforeDestroy() {
    // 销毁enter事件
    this.enterKeyupDestroyed();
  }

  private changeLogin() {
    for (const key in this.loginForm) {
      this.loginForm[key] = "";
    }
    for (const key in this.ukeyForm) {
      this.ukeyForm[key] = "";
    }
    if (this.isUkey) {
      this.initXTXSAB();
    }
  }

  private initXTXSAB() {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    let that = this;
    init(
      function() {
        that.SOF_GetUserList();
      },
      function() { console.log('error') }
    );
  }

  private SOF_GetUserList() {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    let that = this;
    // 获取证书用户列表
    WebsocketInterface.SOF_GetUserList((val) => {
      if (!val.retVal) {
        return that.$message({
          message: "请插入UsbKey",
          type: "warning",
        });
      }
      that.getStep3();
      that.$message({
        message: "读取UsbKey成功",
        type: "success",
      });
      that.ukeyList = val.retVal
        .split("&&&")
        .filter((e) => e)
        .map((e) => {
          let obj = {
            label: e.split("||")[0],
            value: e.split("||")[1].split("/")[1],
          };
          return obj;
        });
      that.certID = val.retVal.split("/")[1].split("&&&")[0];

      // 导出用户证书
      WebsocketInterface.SOF_ExportUserCert(that.certID, (val) => {
        that.cert = val.retVal;
        // 获取证书唯一实体标识
        WebsocketInterface.SOF_GetCertEntity(that.cert, (val) => {
          console.log("SF开头的唯一标识", val);
          that.sfId = val.retVal;
          // 签章图片
          WebsocketInterface.GetPic("2", (val) => {
            that.picSign = val.retVal;
          });
        });
        // 获取证书基本信息
        WebsocketInterface.SOF_GetCertInfo(that.cert, 2, (val) => {
          that.serialNum = val.retVal;

          // 1 证书版本号 返回"V1" 或"V2"或 "V3"
          // 2 证书序列号
          console.log("获取证书基本信息:", val);
        });
      });
    })
  }

  private async getStep3() {
    let res = await UserModule.getStep3();
    // this.$store.dispatch("getStep3").then((res) => {
    //   this.InData = res.data.random; // 服务器随机数
    // });
    this.InData = res.random;
    console.log('InData', this.InData)
  }

  private checkCapslock(e: KeyboardEvent) {
    const { key } = e;
    this.capsTooltip =
      key !== null && key.length === 1 && key >= "A" && key <= "Z";
  }

  private async getIdentifyCode() {
    // this.identifyCode = generateCode(4)
    this.timeStamps = new Date().getTime();
    let postData = {
      flag: this.timeStamps
    };
    const res = await UserModule.GetPicCode(postData);
    this.identifyCode =
      "data:image/png;base64," +
      btoa(
        new Uint8Array(res.data).reduce(
          (data, byte) => data + String.fromCharCode(byte),
          ""
        )
      );
  }

  private validateCode(rule: any, value: string, callback: Function) {
    if (!value) {
      callback(new Error("请输入验证码"));
    } else {
      const inputCode = value.toLowerCase();
      const identifyCode = this.identifyCode.toLowerCase();
      if (inputCode === identifyCode) {
        callback();
        return;
      }
      // eslint-disable-next-line standard/no-callback-literal
      callback("验证码不正确");
      this.getIdentifyCode();
    }
  }

  private showPwd() {
    if (this.passwordType === "password") {
      this.passwordType = "";
    } else {
      this.passwordType = "password";
    }
    this.$nextTick(() => {
      (this.$refs.password as Input).focus();
    });
  }

  private handleLogin() {
    let ref = "loginForm";
    if (this.isUkey) {
      ref = "ukeyFormLogin";
    }
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    let that = this;
    (this.$refs[ref] as ElForm).validate(async(valid: boolean) => {
      if (valid) {
        if (this.isUkey) {
          WebsocketInterface.SOF_Login(
            that.certID,
            Number(that.ukeyForm.ukeyPassword),
            (val) => {
              // 对服务器端数据进行数字签名, 服务器返回的InData(签名原文)
              if (val.retVal) {
                WebsocketInterface.SOF_SignData(
                  that.certID,
                  that.InData,
                  (val) => {
                    that.signValue = val.retVal;
                    // 验证服务器端数据签名,@InData签名原文
                    WebsocketInterface.SOF_VerifySignedData(
                      that.cert,
                      that.InData,
                      val.retVal,
                      async(val) => {
                        if (val.retVal) {
                          console.log("验证服务器端数据签名成功", val);
                          let params = {
                            signValue: that.signValue, // 签名值
                            randomSign: that.InData, // 随机数签名值
                            strUserCert: that.cert, // 客户端证书
                          }
                          await UserModule.getStep910(params);
                          // console.log('getStep910', res)
                            let obj = {
                              // sfId: 123,
                              sfId: that.sfId,
                              picSign: that.picSign,
                            };
                            try {
                              UserModule.setCertId(that.certID);
                              await UserModule.queryUserBySfId(obj);
                              this.loading = false;
                              sessionStorage.setItem(
                                "hasFirstErrorCookie",
                                false
                              );
                              this.$router.push({ path: "/" });
                            } catch (error) {
                              this.loading = false;
                              this.getIdentifyCode();
                              sessionStorage.setItem(
                                "hasFirstErrorCookie",
                                true
                              );
                            }
                          
                        } else {
                          console.error("验证服务器端数据签名失败", val);
                        }
                      }
                    );
                  }
                );
              } else {
                console.log("校验证书口令错误:", val);
              }
              this.loading = false;
            }
          );
        } else {
          try {
            this.loading = true;
            let postData = {
              ...this.loginForm,
              flag: this.timeStamps
            };

            await UserModule.Login(postData);
            this.$router.push({
              path: this.redirect || "/",
              query: this.otherQuery
            });
            this.loading = false;
          } catch (error) {
            this.loading = false;
            this.getIdentifyCode();
          }
        }
      } else {
        return false;
      }
    });
  }

  private getOtherQuery(query: Dictionary<string>) {
    return Object.keys(query).reduce((acc, cur) => {
      if (cur !== "redirect") {
        acc[cur] = query[cur];
      }
      return acc;
    }, {} as Dictionary<string>);
  }

  private enterKeyupDestroyed() {
    document.removeEventListener("keyup", this.enterKey);
  }

  private enterKeyup() {
    document.addEventListener("keyup", this.enterKey);
  }

  private enterKey(event) {
    const componentName = this.$options.name;
    if (componentName === "Login") {
      const code = event.keyCode
        ? event.keyCode
        : event.which
          ? event.which
          : event.charCode;
      if (code === 13) {
        this.handleLogin();
      }
    }
  }
}
</script>

<style lang="scss">
// References: https://www.zhangxinxu.com/wordpress/2018/01/css-caret-color-first-line/
@supports (-webkit-mask: none) and (not (cater-color: $loginCursorColor)) {
  .login-container .el-input {
    input {
      color: $loginCursorColor;
    }
    input::first-line {
      color: $lightGray;
    }
  }
}

.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;
    input {
      height: 47px;
      background: transparent;
      border: 0px;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $lightGray;
      caret-color: $loginCursorColor;
      -webkit-appearance: none;

      &:-webkit-autofill {
        // box-shadow: 0 0 0px 1000px $loginBg inset !important;
        -webkit-text-fill-color: #fff !important;
        /*通过延时渲染背景色变相去除背景颜色*/
        transition: background-color 5000s ease-in-out 0s !important;
      }
    }
  }
  .el-form-item__content {
    .el-form-item__error {
      padding-top: 14px !important;
    }
  }

  .el-form-item {
    border: 1px solid rgba(0, 210, 255, 1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
    height: 56px;
    margin-bottom: 35px;
    .el-input__inner {
      height: 56px;
    }
  }
  .el-checkbox__input {
    width: 17px;
    height: 17px;
    background: #00b8ff;
    border: 1px solid #00b8ff;
    border-radius: 3px;
  }
  .el-checkbox__label {
    width: 68px;
    height: 16px;
    font-size: 16px;
    font-family: PingFang SC Regular, PingFang SC Regular-Regular;
    font-weight: 400;
    text-align: left;
    color: #fff !important;
    letter-spacing: 2px;
  }
}
</style>

<style lang="scss" scoped>
.login-container {
  height: 100%;
  width: 100%;
  overflow: hidden;
  background-color: $loginBg;
  background-image: url("../../assets/login/bgm.jpg");
  display: flex;
  align-items: center;
  justify-content: center;
  .formBox {
    position: relative;
    width: 499px;
    height: 562px;
    background-image: url("../../assets/login/loginBgm.png");
    background-size: 100% 100%;
    .select-login {
      padding-left: 28px;
    }
    .btns {
      position: absolute;
      bottom: 15px;
      width: 100%;
      padding: 0 48px;
      .el-button {
        width: 403px;
        height: 56px;
        background: linear-gradient(#0177e4 0%, #00b8ff 100%);
        border-radius: 6px;
        font-size: 26px;
        font-family: PingFang SC Regular, PingFang SC Regular-Regular;
        font-weight: 400;
        text-align: center;
        color: #ffffff;
        letter-spacing: 15px;
      }
    }
  }
  .login-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 30px 48px 0;
    margin: 0 auto;
    overflow: hidden;
    .el-button {
      width: 403px;
      height: 56px;
      background: linear-gradient(#0177e4 0%, #00b8ff 100%);
      border-radius: 6px;
      font-size: 26px;
      font-family: PingFang SC Regular, PingFang SC Regular-Regular;
      font-weight: 400;
      text-align: center;
      color: #ffffff;
      letter-spacing: 15px;
    }
    .passwordY {
      display: flex;
      justify-content: space-between;
      .passWordImg {
        width: 123px;
        height: 56px;
        background: #00d2ff;
        border: 1px solid #00d2ff;
        border-radius: 2px;
      }
    }
  }

  .ukey-form ::v-deep{
      .ukeyUser {
        .el-input {
          width: 100%;
        }
      }
  }

  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding-top: 21px;
    padding-left: 15px;
    vertical-align: middle;
    width: 21px;
    height: 23px;
    opacity: 0.8;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      color: $lightGray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }

    .set-language {
      color: #fff;
      position: absolute;
      top: 3px;
      font-size: 18px;
      right: 0px;
      cursor: pointer;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $darkGray;
    cursor: pointer;
    user-select: none;
  }

  .thirdparty-button {
    position: absolute;
    right: 0;
    bottom: 6px;
  }
  .checked-password {
    margin-top: 10px;
  }
  @media only screen and (max-width: 470px) {
    .thirdparty-button {
      display: none;
    }
  }
}
</style>
