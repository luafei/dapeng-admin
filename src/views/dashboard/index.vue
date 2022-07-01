<template>
  <div class="dashboard-container"></div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { Form } from "element-ui";
import { getQueryRoleInfoList } from "@/api/articles";

@Component({
  name: "Dashboard"
  // components: {
  //   AdminDashboard,
  //   EditorDashboard
  // }
})
export default class extends Vue {
  private currentRole = "admin-dashboard";
  private activeName = "first";
  private inputText = "";
  private delTitle = ""; // 删除弹窗标题
  private delDialogText = ""; // 删除弹窗文字内容
  private showDialog = false; // 控制提示弹窗的
  private addDialog = false;
  private editDialog = false;
  private addDialogRole = false;
  private dialogText = "";
  private title = "提示";
  private checked = false;
  private listData = [
    { name: "张三" },
    { name: "张三1" },
    { name: "张三2" },
    { name: "张三3" },
    { name: "张三" },
    { name: "张三1" },
    { name: "张三2" },
    { name: "张三3" }
  ];

  private listData1 = [];
  private isCheck = true;

  private ruleForm = {
    name: "",
    account: "",
    pass: "",
    checkPass: "",
    phoneNum: ""
  };

  private ruleFormEdit = {
    name: "张三",
    account: "123456",
    pass: "",
    checkPass: ""
  };

  private ruleFormRole = {
    name: ""
  };

  private validatePass = (rule: any, value: string, callback: any) => {
    if (value === "") {
      callback(new Error("请输入密码"));
    } else if (value !== "" && value.length < 6) {
      callback(new Error("密码长度不能少于6位数"));
    } else {
      if (this.ruleForm.checkPass !== "") {
        (this.$refs.ruleForm as Form).validateField("checkPass");
      }
      callback();
    }
  };

  private validatePass2 = (rule: any, value: string, callback: any) => {
    if (value === "") {
      callback(new Error("请再次输入密码"));
    } else if (value !== this.ruleForm.pass) {
      callback(new Error("两次输入密码不一致!"));
    } else {
      callback();
    }
  };

  private rulesEdit = {
    pass: [{ validator: this.validatePass, trigger: "blur" }],
    checkPass: [{ validator: this.validatePass2, trigger: "blur" }]
  };

  private ruleRole = {
    name: [{ required: true, message: "请输入角色", trigger: "blur" }]
  };

  private rules = {
    name: [{ required: true, message: "请输入姓名", trigger: "blur" }],
    account: [{ required: true, message: "请输入账号", trigger: "blur" }],
    pass: [{ validator: this.validatePass, trigger: "blur" }],
    checkPass: [{ validator: this.validatePass2, trigger: "blur" }],
    phoneNum: [{ required: true, message: "请输入手机号", trigger: "blur" }]
  };

  private list = [
    {
      name: "张三",
      user: "王五"
    },
    {
      name: "李四",
      user: "赵柳"
    },
    {
      name: "王五",
      user: "和珅"
    },
    {
      name: "赵六",
      user: "段天涯"
    }
  ];

  private listSec = [
    {
      name: "张三",
      account: "123456",
      passWord: "123456",
      applyTime: "1994-02-23 00:00:00",
      telNumber: "13500004444"
    },
    {
      name: "李四",
      account: "123456",
      passWord: "123456",
      applyTime: "1994-02-23 00:00:00",
      telNumber: "13500004444"
    },
    {
      name: "王五",
      account: "123456",
      passWord: "123456",
      applyTime: "1994-02-23 00:00:00",
      telNumber: "13500004444"
    },
    {
      name: "赵六",
      account: "123456",
      passWord: "123456",
      applyTime: "1994-02-23 00:00:00",
      telNumber: "13500004444"
    }
  ];

  private showTipsDialog = false;
  private keyword = "";
  private page = {
    currentPage: 1,
    pageSize: 2,
    pageSizes: [2],
    total: 4
  };

  private option = {
    page: true,
    addBtn: false,
    selection: true,
    align: "left",
    menuAlign: "center",
    labelWidth: 115,
    stripe: true,
    addTitle: "新增角色",
    ediTitle: "修改角色",
    tip: false,
    delBtn: false,
    editBtn: false,
    column: [
      {
        label: "角色名称",
        prop: "name"
      },
      {
        label: "用户",
        prop: "user",
        slot: true
      }
    ]
  };

  private optionSec = {
    page: true,
    addBtn: false,
    selection: true,
    align: "left",
    menuAlign: "center",
    labelWidth: 115,
    stripe: true,
    addBtnText: "新增用户",
    // editBtnText: '修改',
    editBtn: false,
    delBtn: false,
    edititle: "修改用户",
    tip: false,
    column: [
      {
        label: "姓名",
        prop: "name"
      },
      {
        label: "账号",
        prop: "account"
      },
      {
        label: "密码",
        prop: "passWord",
        type: "password"
      },
      {
        label: "申请时间",
        prop: "applyTime"
      },
      {
        label: "手机",
        prop: "telNumber"
      }
    ]
  };

  created() {
    this.getList();
  }

  private async getList() {
    console.log("1111111");
    // const {data} = await getQueryRoleInfoList({})
  }

  private sizeChange(val: number) {
    this.page.currentPage = 1;
    this.page.pageSize = val;
    this.getList();
  }

  private currentChange(val: number) {
    this.page.currentPage = val;
    this.getList();
  }

  private handleSubmit() {
    this.showTipsDialog = false;
  }

  private closed() {
    console.log("222222222222");
  }

  private addInfo() {
    this.title = "新增用户";
    this.addDialog = true;
  }

  private editInfo() {
    this.title = "修改密码";
    this.editDialog = true;
  }

  private submit(val: any) {
    (this.$refs[val] as Form).validate(valid => {
      if (valid) {
        alert("submit!");
        this.addDialog = false;
      } else {
        console.log("error submit!!");
        return false;
      }
    });
  }

  private submitRole(val: any) {
    (this.$refs[val] as Form).validate(valid => {
      if (valid) {
        alert("submit!");
        this.addDialogRole = false;
      } else {
        console.log("error submit!!");
        return false;
      }
    });
  }

  private editSubmit(val: any) {
    (this.$refs[val] as Form).validate(valid => {
      if (valid) {
        alert("submit!");
        this.editDialog = false;
      } else {
        console.log("error submit!!");
        return false;
      }
    });
  }

  private error() {
    this.addDialog = true;
  }

  private handleDel(val: any) {
    switch (val) {
      case 1:
        this.delTitle = "删除角色";
        this.delDialogText = "是否删除" + "xxx" + "角色";
        break;
      case 2:
        this.delTitle = "删除用户";
        this.delDialogText = "是否删除" + "用户";
        break;
      default:
    }
    this.showTipsDialog = true;
  }

  // 新增角色
  private addRole(val: any) {
    switch (val) {
      case "add":
        this.title = "新增角色";
        break;
      case "edit":
        this.title = "修改角色";
        break;
      default:
    }
    this.addDialogRole = true;
  }

  public handleClick(): void {
    console.log("22222222222333333333");
  }

  private check(val: any) {
    console.log("val1", this.checked);
  }
}
</script>

<style lang="scss" scoped>
.dashboard-container {
  // padding: 10px;
  background: #fff;
  width: 100%;
  .tabBox {
    padding: 10px;
    background: #fff;
    .tabBox-header {
      .input-with-serch {
        width: 453px;
        min-width: 453px;
        margin-left: 10px;
      }
    }
    .level-select {
      width: auto !important;
      box-sizing: border-box;
    }
  }
}
</style>

<style>
/* .wrapper-box_view {
  display: flex;
}
.box_view_ulBox {
  width: 50%;
  height: 319px;
  border: 1px solid #eaecf1;
  overflow-y: scroll;
}
p {
  padding-left: 13px;
  color: rgba(66, 70, 86, 1);
}
ul {
  list-style: none;
  padding-left: 13px;
  padding-right: 24px;
}
li {
  display: flex;
  justify-content: space-between;
  align-items: center;
} */
</style>
