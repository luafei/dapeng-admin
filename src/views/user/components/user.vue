<template>
  <div class="user">
    <div>
      <avue-crud
        :data="list"
        ref="crud"
        :table-loading="tableLoading"
        :page.sync="page"
        :option="option"
        @size-change="sizeChange"
        @current-change="currentChange"
        @row-del="rowDel"
        @row-save="handleSave"
        @refresh-change="refreshChange"
        @row-update="submitEdit"
      >
        <template slot="menuLeft">
          <!-- <el-button size="small" type="primary" @click="addInfo">
                        {{ ' + ' + $t('permission.createUser') }}
                    </el-button> -->
          <!-- <el-button size="small" @click="editInfo">
                        {{ $t('permission.editUser') }}
                    </el-button>
                    <el-button size="small" @click="handleDel(2)">
                        {{ $t('permission.deleteUser') }}
                    </el-button> -->
          <Search v-model="keyword" @input="searchByKeyWord"></Search>
          <!-- <el-input v-model="keyword" size="small" class="avue-search" placeholder="请输入关键词查询" suffix-icon="el-icon-search" /> -->
        </template>
        <template slot="userRolesForm" slot-scope="scope">
          <el-transfer
            :titles="['请选择角色', '已选择角色']"
            filterable
            v-model="role"
            :props="{
              key: 'role',
              label: 'roleName',
            }"
            :data="roleList"
          >
          </el-transfer>
        </template>
        <template slot="userRoles" slot-scope="scope">
          <el-tag
            v-for="item in scope.row.userRoles"
            :key="item.role"
            style="margin: 3px 6px 3px 0"
            >{{ item.roleName }}</el-tag
          >
        </template>
        <template slot="menu" slot-scope="{ row, size, type, index }">
          <el-button
            icon="el-icon-edit"
            :size="size"
            :type="type"
            @click="handleEdit(row, index)"
          >
            {{ "修改" }}
          </el-button>
          <!-- <el-button icon="el-icon-delete" :size="size" :type="type" @click="handleDel(1)">
                        {{ '删除' }}
                    </el-button> -->
        </template>
      </avue-crud>
    </div>
    <!--修改密码-->
    <!-- <infoDialog :show.sync="editDialog" :title="title" @closed="closed" @handle-submit="editSubmit('ruleFormEdit')">
            <div>
                <el-form ref="ruleFormEdit" :model="ruleFormEdit" :rules="rulesEdit" label-width="80px" label-position="left" class="addForm">
                    <el-form-item label="姓名">
                        <el-input v-model="ruleFormEdit.name" autocomplete="off" :disabled="true" />
                    </el-form-item>

                    <el-form-item label="账号">
                        <el-input v-model.number="ruleFormEdit.account" :disabled="true" />
                    </el-form-item>
                    <el-form-item label="密码" prop="pass">
                        <el-input v-model="ruleFormEdit.pass" type="password" autocomplete="off" />
                    </el-form-item>

                    <el-form-item label="确认密码" prop="checkPass">
                        <el-input v-model="ruleFormEdit.checkPass" type="password" autocomplete="off" />
                    </el-form-item>
                </el-form>
            </div>
        </infoDialog> -->
    <!--删除弹窗-->
    <tipsDialog
      :show.sync="showTipsDialog"
      :title="delTitle"
      @handle-submit="handleSubmit"
    >
      <div>
        {{ delDialogText }}
      </div>
    </tipsDialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { Form } from "element-ui";

import { getUserPageList, addUser, delUser, getDSVSCert } from "@/api/users.ts";
import { rolePageList } from "@/api/roles.ts";
import { validatePhone } from "@/utils/validate";
import { validatePetNameExist } from "@/utils/async-validate";
import { IRoleData } from "@/api/types";
import { parseTime } from "@/utils/index.ts";
import { isValidPassword } from "@/utils/validate";
import { Irole } from "@/store/modules/permission";
import tipsDialog from "@/components/TipsDialog";
import Search from "@/components/Search";
import { init, WebsocketInterface } from "@/utils/XTXSAB";
import { UserModule } from "@/store/modules/user";

interface IuserData {
  id?: number;
  createTime?: number;
  keyName: string;
  mobileNum: string;
  petName: string;
  tokenId: string;
  userId: number;
  userName: string;
  userRoles: Irole[];
}

@Component({
  name: "user",
  components: {
    Search,
    tipsDialog,
  },
})
export default class extends Vue {
  private tableLoading: boolean = false;
  private title: string = "";
  private delTitle: string = "";
  private delDialogText: string = "";
  private addDialog: boolean = false;
  private editDialog: boolean = false;
  private showTipsDialog: boolean = false;
  private keyword: string = "";
  private currentId: number = 0;
  private role: Array<number> = [];
  private roleList: Array<Irole> = [];
  private debounced: any = null;
  private page: any = {
    currentPage: 1,
    pageSize: 10,
    total: 0,
  };
  private validatePass = (rule: any, value: string, callback: any) => {
    //长度不小于8位，因为数字混合，大小写混合
    const result = isValidPassword(value);
    if (!result[0]) {
      callback(new Error(result[1]));
    } else {
      let { keyName, keyName2 } = (this.$refs["crud"] as any).tableForm;
      if (!keyName || !keyName2) callback();
      keyName === keyName2 ? callback() : callback("两次输入密码不一致");
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
  private option = {
    index: true,
    indexLabel: "序号",
    page: true,
    addBtn: true,
    selection: false,
    align: "left",
    menuAlign: "center",
    labelWidth: 90,
    stripe: true,
    addBtnText: "新增用户",
    // editBtnText: '修改',
    editBtn: false,
    delBtn: true,
    edititle: "修改用户",
    tip: false,
    dialogWidth: "50%",
    dialogClickModal: false,
    column: [
      {
        label: "姓名",
        prop: "userName",
        rules: [
          { required: true, message: "请输入姓名", trigger: "blur" },
          { min: 2, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" },
        ],
      },
      {
        label: "账号",
        prop: "petName",
        editDisplay: false,
        rules: [
          { required: true, message: "请输入账号", trigger: "blur" },
          { min: 3, message: "长度在 3 个字符及以上", trigger: "blur" },
          { validator: validatePetNameExist, trigger: "blur" },
        ],
      },
      {
        label: "密码",
        prop: "keyName",
        type: "password",
        rules: [
          {
            validator: this.validatePass,
            trigger: "blur",
            required: true,
          },
        ],
      },
      {
        label: "确认密码",
        prop: "keyName2",
        type: "password",
        addDetail: false,
        showColumn: false,
        rules: [
          {
            validator: this.validatePass,
            trigger: "blur",
            required: true,
          },
        ],
      },
      {
        label: "申请时间",
        prop: "createTime",
        addDisplay: false,
        editDisplay: false,
        formatter: function (row: IuserData, value: number) {
          return value && parseTime(value);
        },
      },
      {
        label: "手机号",
        prop: "mobileNum",
        rules: [{ required: true, validator: validatePhone, trigger: "blur" }],
      },
      {
        label: "所属角色",
        prop: "userRoles",
        span: 24,
        formslot: true,
        slot: true,
      },
    ],
  };
  private list: Array<object> = [];
  private ruleForm = {
    name: "",
    account: "",
    pass: "",
    checkPass: "",
    phoneNum: "",
  };
  private ruleFormEdit = {
    name: "张三",
    account: "123456",
    pass: "",
    checkPass: "",
  };
  private rulesEdit = {
    pass: [
      {
        validator: this.validatePass,
        trigger: "blur",
      },
    ],
    checkPass: [
      {
        validator: this.validatePass2,
        trigger: "blur",
      },
    ],
  };
  created() {
    console.log('user created', 11111)
    this.getList();
    this.getRoleList();
    this.debounced = (this as any)._.debounce(this.getList, 300);
    this.initXTX();
  }
  private async getList() {
    try {
      let postData = {
        page: this.page.currentPage,
        pageSize: this.page.pageSize,
        userName: this.keyword,
      };
      this.tableLoading = true;
      const res = await getUserPageList(postData);
      this.tableLoading = false;
      this.page.total = res.data.total;
      this.list = res.data.data;
    } catch (error) {
      this.tableLoading = false;
    }
  }

  private initXTX() {
    init(
      function () {
        console.log("xtx init success");
      },
      function () {}
    );
  }

  private refreshChange() {
    this.getList();
  }
  private async getRoleList() {
    let params = {
      page: 1,
      pageSize: 100,
    };
    const res = await rolePageList(params);
    this.roleList = res.data.data;
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

  private async handleSave(row: IuserData, done: any, loading: any) {
    console.log('handleSave');
    try {
      let { userName, petName, keyName, mobileNum } = row;
      let roleNameList = this._filterRoleNameList(this.role, this.roleList);
      let curData = await getDSVSCert();
      let cur = curData.data.serverCert;
      let that = this;
      const certId = localStorage.getItem("certID") || UserModule.certID;
      console.log("UserModule.certID", UserModule.certID);
      console.log("localStorage.getItem", localStorage.getItem("certID"));

      console.log("handleSave init success");
      WebsocketInterface.SOF_EncryptData(cur, mobileNum, async (res: any) => {
        console.log("SOF_EncryptData UserModule.certID", certId);
        if (certId) {
          let postData = {
            userName,
            petName,
            keyName,
            mobileNum: res.retVal,
            role: that.role.join(","),
            roleName: roleNameList.join(","),
          };
          WebsocketInterface.SOF_SignData(
            certId,
            JSON.stringify(postData),
            async (val: any) => {
              console.log(val.retVal);
              let params = {
                ...postData,
                clientCert: certId,
                signValue: val.retVal,
              };
              await addUser(params);
              that.getList();
              that.$message({
                message: "新增成功",
                type: "success",
              });
            }
          );
        } else {
          let postData = {
            userName,
            petName,
            keyName,
            mobileNum: res.retVal,
            role: that.role.join(","),
            roleName: roleNameList.join(","),
          };
          await addUser(postData);
          that.getList();
          that.$message({
            message: "新增成功",
            type: "success",
          });
        }
      });
    } catch (error) {
      done();
    }
  }
  private addInfo() {
    this.title = "新增用户";
    this.addDialog = true;
  }
  private editInfo() {
    this.title = "修改密码";
    this.editDialog = true;
  }
  private handleEdit(row: IuserData, index: number) {
    this.role = [];
    row.userRoles.forEach((item) => {
      this.role.push(item.role);
    });
    (this.$refs.crud as any).rowEdit(row, index);
  }
  private async submitEdit(row: any, index: number, done: any) {
    let { userName, petName, keyName, mobileNum, id, userId } = row;
    let roleNameList = this._filterRoleNameList(this.role, this.roleList);
    let curData = await getDSVSCert();
    let cur = curData.data.serverCert;
    let that = this;
    const certId = localStorage.getItem("certID") || UserModule.certID;

    WebsocketInterface.SOF_EncryptData(cur, mobileNum, async (res: any) => {
      console.log("submitEdit UserModule.certID", certId);
      if (certId) {
        let postData = {
          userName,
          petName,
          keyName,
          mobileNum: res.retVal,
          role: that.role.join(","),
          roleName: roleNameList.join(","),
        };
        WebsocketInterface.SOF_SignData(
          certId,
          JSON.stringify(postData),
          async (val: any) => {
            console.log("SOF_SignData", val.retVal);
            let params = {
              ...postData,
              clientCert: certId,
              signValue: val.retVal,
            };
            await addUser(params);
            that.getList();
            that.$message({
              message: "新增成功",
              type: "success",
            });
          }
        );
      } else {
        let postData = {
          userName,
          petName,
          keyName,
          mobileNum: res.retVal,
          userId,
          id,
          role: that.role.join(","),
          roleName: roleNameList.join(","),
        };
        await addUser(postData);
        that.getList();
        that.$message({
          message: "修改成功",
          type: "success",
        });
      }
    });
    done();
  }
  private async handleSubmit() {
    let postData = {
      id: this.currentId,
    };
    await delUser(postData);
    this.getList();
    this.showTipsDialog = false;
  }
  private rowDel(row: any) {
    this.currentId = row.id;
    this.delTitle = "删除用户";
    this.delDialogText = "是否删除" + "用户";
    this.showTipsDialog = true;
  }
  private searchByKeyWord() {
    this.debounced();
  }
  private _filterRoleNameList(
    role: number[],
    roleList: Irole[]
  ): Array<string> {
    let result: string[] = [];
    role.forEach((role: number) => {
      roleList.some((item) => {
        if (role === item.role) {
          result.push(item.roleName);
          return true;
        }
      });
    });
    return result;
  }
}
</script>
<style lang="scss" scoped></style>
