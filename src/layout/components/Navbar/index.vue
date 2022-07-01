<template>
  <div class="navbar">
    <!--<hamburger
      id="hamburger-container"
      :is-active="sidebar.opened"
      class="hamburger-container"
      @toggleClick="toggleSideBar"
    />
    <breadcrumb
      id="breadcrumb-container"
      class="breadcrumb-container"
    />-->
    <div class="left-title">
      运行监测平台
    </div>
    <div class="right-menu">
      <template v-if="device !== 'mobile'">
        <!--<header-search class="right-menu-item" />
        <error-log class="errLog-container right-menu-item hover-effect" />
        <screenfull class="right-menu-item hover-effect" />
        <el-tooltip
          :content="$t('navbar.size')"
          effect="dark"
          placement="bottom"
        >
          <size-select class="right-menu-item hover-effect" />
        </el-tooltip>
        <lang-select class="right-menu-item hover-effect" />-->
      </template>
      <div class="right_btnBox">
        <span>{{ getUserName }}</span>
        <span style="cursor:pointer;" @click="handleEdit">
          <i class="el-icon-edit" />
        </span>
        <span class="line" />
        <span @click="logout">
          <i class="el-icon-switch-button" />
          <span style="cursor:pointer;margin-left: 5px;">注销</span>
        </span>
        <!--<el-dropdown class="avatar-container right-menu-item hover-effect" trigger="click">
          <div class="avatar-wrapper">
            <img
              :src="avatar+'?imageView2/1/w/80/h/80'"
              class="user-avatar"
            >
            <i class="el-icon-switch-button"></i>
            <span>注销</span>
            <i class="el-icon-caret-bottom" />
          </div>
          <el-dropdown-menu slot="dropdown">
            <router-link to="/profile/">
              <el-dropdown-item>
                {{ $t('navbar.profile') }}
              </el-dropdown-item>
            </router-link>
            <router-link to="/">
              <el-dropdown-item>
                {{ $t('navbar.dashboard') }}
              </el-dropdown-item>
            </router-link>
            <a
              target="_blank"
              href="https://github.com/armour/vue-typescript-admin-template/"
            >
              <el-dropdown-item>
                {{ $t('navbar.github') }}
              </el-dropdown-item>
            </a>
            <a
              target="_blank"
              href="https://armour.github.io/vue-typescript-admin-docs/"
            >
              <el-dropdown-item>Docs</el-dropdown-item>
            </a>
            <el-dropdown-item
              divided
              @click.native="logout"
            >
              <span style="display:block;">
                {{ $t('navbar.logOut') }}
              </span>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>-->
      </div>
    </div>
    <!-- <el-dialog
      title="修改用户信息"
      append-to-body
      :visible.sync="userDialogVisible"
      :close-on-click-modal="false"
      width="30%">
      <el-form ref="form" :rules="rules"  :model="form" label-width="80px">
        <el-form-item label="用户名" prop="userName">
          <el-input v-model="form.userName"></el-input>
        </el-form-item>
        <el-form-item label="手机号码" prop="phone">
          <el-input v-model="form.phone"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="keyName">
          <el-input v-model="form.keyName" type="password"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="keyName2">
          <el-input v-model="form.keyName2" type="password"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="userDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="updateUserInfo">确 定</el-button>
      </span>
    </el-dialog> -->
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { AppModule } from "@/store/modules/app";
import { UserModule } from "@/store/modules/user";
import Breadcrumb from "@/components/Breadcrumb/index.vue";
import ErrorLog from "@/components/ErrorLog/index.vue";
import Hamburger from "@/components/Hamburger/index.vue";
import HeaderSearch from "@/components/HeaderSearch/index.vue";
import LangSelect from "@/components/LangSelect/index.vue";
import Screenfull from "@/components/Screenfull/index.vue";
import SizeSelect from "@/components/SizeSelect/index.vue";
import { validatePhone } from "@/utils/validate";
import { addUser } from "@/api/users";

@Component({
  name: "Navbar",
  components: {
    Breadcrumb,
    ErrorLog,
    Hamburger,
    HeaderSearch,
    LangSelect,
    Screenfull,
    SizeSelect
  }
})
export default class extends Vue {
  private userDialogVisible = false;
  private form = {
    userName: "",
    keyName: "",
    keyName2: "",
    phone: ""
  };
  private validatePass = (rule: any, value: string, callback: any) => {
    //长度不小于8位，因为数字混合，大小写混合
    if (value === "") {
      callback(new Error("请输入密码"));
    } else if (
      !/^(?=.*?[0-9])(?=.*?[A-Z])(?=.*?[a-z])[0-9a-zA-Z]{8,}$/.test(value)
    ) {
      callback(
        new Error(
          "密码长度不能少于8位数,需数字英文字母混合,英文字母需包含大小写"
        )
      );
    } else {
      let { keyName, keyName2 } = this.form;
      if (!keyName || !keyName2) callback();
      keyName === keyName2 ? callback() : callback("两次输入密码不一致");
    }
  };
  private rules = {
    userName: [{ required: true, message: "请输入用户名", trigger: "blur" }],
    phone: [{ required: true, validator: validatePhone, trigger: "blur" }],
    keyName: [
      { required: true, validator: this.validatePass, trigger: "blur" }
    ],
    keyName2: [
      { required: true, validator: this.validatePass, trigger: "blur" }
    ]
  };

  get sidebar() {
    return AppModule.sidebar;
  }

  get device() {
    return AppModule.device.toString();
  }

  get avatar() {
    return UserModule.avatar;
  }

  get getUserName() {
    return UserModule.name;
  }

  private toggleSideBar() {
    AppModule.ToggleSideBar(false);
  }

  private handleEdit() {
    this.form.userName = UserModule.name;
    this.form.phone = UserModule.phone;
    this.form.keyName = UserModule.keyName;
    this.userDialogVisible = true;
  }
  private updateUserInfo() {
    (this.$refs["form"] as any).validate(async valid => {
      if (valid) {
        console.log(this.form, "this.form");
        let postData = {
          userName: this.form.userName,
          mobileNum: this.form.phone,
          keyName: this.form.keyName,
          id: Number(UserModule.kId)
        };
        await addUser(postData);
        this.userDialogVisible = false;
      } else {
        return false;
      }
    });
  }
  private async logout() {
    await UserModule.LogOut();
    this.$router.push(`/login?redirect=${this.$route.fullPath}`);
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  height: 60px;
  overflow: hidden;
  position: fixed;
  background: $subMenuActiveText;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  width: 100%;
  z-index: 100;

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    padding: 0 15px;
    cursor: pointer;
    transition: background 0.3s;
    -webkit-tap-highlight-color: transparent;

    &:hover {
      background: rgba(0, 0, 0, 0.025);
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .errLog-container {
    display: inline-block;
    vertical-align: top;
  }
  .left-title {
    height: 60px;
    line-height: 60px;
    float: left;
    font-size: 24px;
    font-family: YouSheBiaoTiHei;
    color: #ffffff;
    padding-left: 24px;
  }
  .right-menu {
    float: right;
    height: 100%;
    line-height: 60px;
    .right_btnBox {
      display: flex;
      color: #ffffff;
      margin-right: 35px;
      span:nth-child(1) {
        margin-right: 8px;
      }
      span:nth-child(2) {
        margin-right: 15px;
      }
      .line {
        width: 1px;
        height: 16px;
        width: 1px;
        margin: 23px 2px;
        background: #fff;
        margin-right: 11px;
      }
      span:nth-child(4) {
        margin-right: 6px;
      }
      span:nth-child(5) {
        font-size: 12px;
        display: flex;
        align-items: center;
      }
    }
    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background 0.3s;

        &:hover {
          background: rgba(0, 0, 0, 0.025);
        }
      }
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        margin-top: 5px;
        position: relative;
        color: #ffffff;
        span {
          font-size: 12px;
          color: #ffffff;
          line-height: 60px;
        }

        // .user-avatar {
        //   cursor: pointer;
        //   width: 40px;
        //   height: 40px;
        //   border-radius: 10px;
        // }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
