<template>
  <el-card class="box-card">
    <div
      slot="header"
      class="clearfix"
    >
      <span>规则设置</span>
    </div>
    <avue-crud
      ref="crud"
      :table-loading="tableLoading"
      :data="list"
      :page.sync="page"
      :option="option"
      @row-save="handleSave"
      @row-del="handleShowDelDialog"
      @row-update="rowUpdate"
      @size-change="sizeChange"
      @current-change="currentChange"
      @refresh-change="refreshChange"
      @selection-change="selectionChange"
    >
      <template slot="menuLeft">
        <!-- <el-button  size="small" @click="handleShowDelDialog">删除规则</el-button> -->
        <el-select
          v-model="alarmLevel"
          class="level-select"
          clearable
          size="small"
          placeholder="请选择预警级别"
          @change="searchByAlarmLevel"
        >
          <el-option
            v-for="item in alarmLevelList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
        <!-- <el-input
                    size="small"
                    class="avue-search"
                    clearable
                    placeholder="请输入关键词查询"
                    suffix-icon="el-icon-search"
                    @input="searchByKeyWord"
                    v-model="keyword">
                </el-input> -->
        <Search
          v-model="keyword"
          @input="searchByKeyWord"
        />
      </template>
      <template
        slot="menu"
        slot-scope="{row, size, type, index}"
      >
        <el-button
          icon="el-icon-edit"
          :size="size"
          :type="type"
          @click="handleEdit(row, index)"
        >
          修改
        </el-button>
        <!-- <el-button icon="el-icon-delete" :size="size" :type="type" @click="handleDel(1)">
                    {{ '删除' }}
                </el-button> -->
      </template>
    </avue-crud>
    <tipsDialog
      :show.sync="showTipsDialog"
      title="删除规则"
      @handle-submit="handleSubmit"
    >
      <div class="dle-tip">
        <i class="el-icon-warning" />
        是否删除规则
      </div>
    </tipsDialog>
  </el-card>
</template>
<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import {
  getRuleList,
  getAlarmTypeTree,
  addRule,
  getRuleDetail,
  delRule,
  updateRule,
} from "@/api/setRule.ts";
import { getRoleList } from "@/api/roles.ts";
import {
  alarmLevelDic,
  pushModeDic,
  alarmLevelMap,
  pushWayList,
  alarmTree,
} from "@/const/dicData.ts";
import Search from "@/components/Search";
import tipsDialog from "@/components/TipsDialog";

@Component({
  name: "ruleSet",
  components: {
    Search,
    tipsDialog,
  },
})
export default class extends Vue {
  private showTipsDialog = false;
  private tableLoading = false;
  private list = [];
  private alarmLevel = "";
  private keyword = "";
  private alarmLevelList = alarmLevelDic;
  private page = {
    currentPage: 1,
    pageSize: 10,
    total: 0,
  };

  private alarmTypeList = [];
  // private defaultProps = {
  //     children: 'subType',
  //     label: 'alarmType'
  // }
  private roleList = [];
  private subTypes = "";
  private currentId = 0;
  private isShowPopover = true;
  private option = {};
  private debounced: any = null;
  created() {
    this.getList();
    this.debounced = this._.debounce(this.getList, 300);
  }

  async mounted() {
    await Promise.all([this.getRoleList(), this.getAlarmTypeTree()]);
    this.option = {
      page: true,
      align: "center",
      menuAlign: "center",
      index: true,
      indexLabel: "序号",
      labelWidth: 115,
      stripe: true,
      addTitle: "新增规则设置",
      addBtnText: "新增规则",
      editBtnText: "修改",
      selection: true,
      tip: false,
      reserveSelection: true,
      dialogClickModal: false,
      editBtn: false,
      column: [
        {
          label: "规则名称",
          prop: "ruleName",
          rules: [
            { required: true, message: "请输入规则名称", trigger: "blur" },
          ],
        },
        {
          label: "推送用户",
          prop: "roles",
          type: "select",
          multiple: true,
          dicData: this.roleList,
          showColumn: false, // 后端说这个字段值只能查单条数据才能拿到
          rules: [
            { required: true, message: "请选择推送用户", trigger: "change" },
          ],
        },
        {
          label: "推送时间起",
          prop: "pushStarttime",
          type: "date",
          format: "yyyy-MM-dd hh:mm:ss",
          valueFormat: "yyyy-MM-dd hh:mm:ss",
        },
        {
          label: "推送时间止",
          prop: "pushEndtime",
          type: "date",
          format: "yyyy-MM-dd hh:mm:ss",
          valueFormat: "yyyy-MM-dd hh:mm:ss",
        },
        {
          label: "预警起始时间",
          prop: "alarmStarttime",
          type: "date",
          format: "yyyy-MM-dd hh:mm:ss",
          valueFormat: "yyyy-MM-dd hh:mm:ss",
        },
        {
          label: "预警截止时间",
          prop: "alarmEndtime",
          type: "date",
          format: "yyyy-MM-dd hh:mm:ss",
          valueFormat: "yyyy-MM-dd hh:mm:ss",
        },
        {
          label: "预警类型",
          prop: "subTypes",
          type: "tree",
          dicData: this.alarmTypeList,
          multiple: true,
          showColumn: false, // 后端说这个字段值只能查单条数据才能拿到
          rules: [
            { required: true, message: "请选择预警类型", trigger: "change" },
          ],
        },
        {
          label: "预警级别",
          prop: "alarmLevel",
          type: "select",
          multiple: true,
          dicData: alarmLevelDic,
          formatter: function(row, value) {
            if (!value) return value;
            let result = [];
            value.length !== 0 &&
              value.split(",").forEach((level) => {
                result.push(alarmLevelMap[level]);
              });
            return result.join(",");
          },
          rules: [
            { required: true, message: "请选择预警级别", trigger: "change" },
          ],
        },
        {
          label: "推送方式",
          prop: "pushType",
          type: "select",
          dicData: pushWayList,
          rules: [
            { required: true, message: "请选择推送方式", trigger: "change" },
          ],
        },
        {
          label: "转发方式",
          prop: "pushMode",
          type: "select",
          dicData: pushModeDic,
          rules: [
            { required: true, message: "请选择转发方式", trigger: "change" },
          ],
        },
      ],
    };
  }

  private async getList() {
    try {
      let postData = {
        page: this.page.currentPage,
        pageSize: this.page.pageSize,
        alarmLevel: this.alarmLevel,
        ruleName: this.keyword,
      };
      this.tableLoading = true;
      const res = await getRuleList(postData);
      this.tableLoading = false;
      this.page.total = res.data.total;
      this.list = res.data.data;
    } catch (error) {
      this.tableLoading = false;
    }
  }

  private refreshChange() {
    this.getList();
  }

  private async getAlarmTypeTree() {
    // const res = await getAlarmTypeTree();
    this.alarmTypeList = [];
    alarmTree.forEach((item, index) => {
      this.alarmTypeList[index] = {
        label: item.alarmType,
        value: item.alarmType,
        children: [],
      };
      item.subType.forEach((subType: any) => {
        if (subType) {
          this.alarmTypeList[index].children.push({
            label: subType,
            value: subType,
          });
        }
      });
    });
  }

  private async getRoleList() {
    const res = await getRoleList();
    this.roleList = [];
    res.data.forEach((item) => {
      this.roleList.push({
        label: item.roleName,
        value: item.role,
      });
    });
  }

  private sizeChange(val: number): void {
    this.page.currentPage = 1;
    this.page.pageSize = val;
    this.getList();
  }

  private currentChange(val: number): void {
    this.page.currentPage = val;
    this.getList();
  }

  private async handleSave(row, done) {
    let postData = this._filterPostData(row);
    await addRule(postData);
    done();
    this.getList();
  }

  private async handleSubmit() {
    this.showTipsDialog = false;
    await delRule(this.currentId + "");
    this.getList();
  }

  private async handleEdit(row, index) {
    this.$refs.crud.rowEdit(row, index);
    const res = await getRuleDetail(row.id);
    row.roles = this._filterRolesIds(res.data.roles);
    row.subTypes = res.data.subTypes;
    this.$refs.crud.rowEdit(row, index);
  }

  private async rowUpdate(row, index, done) {
    let postData = this._filterPostData(row);
    await updateRule(postData);
    done();
    this.getList();
  }

  private selectionChange(row: any): void {
    console.log(row, "dddss");
  }

  private handleCheckChange(data, checked, indeterminate) {
    let checkedItems = this.$refs.tree.getCheckedNodes();
    let result = [];
    checkedItems.forEach((item) => {
      !item.subType && result.push(item.alarmType);
    });
    this.subTypes = result.join(",");
  }

  private handleShowDelDialog(row: any): void {
    this.currentId = row.id;
    this.showTipsDialog = true;
  }

  private searchByAlarmLevel() {
    this.getList();
  }

  private searchByKeyWord(val) {
    this.debounced();
  }

  private _filterRoleList(roles, roleList): Array<string> {
    let result = [];
    roles.forEach((role) => {
      roleList.some((item) => {
        if (role === item.value) {
          result.push({
            role: item.value,
            roleName: item.label,
          });
          return true;
        }
      });
    });
    return result;
  }

  private _filterRolesIds(roles: any): number[] {
    const result = [];
    roles.forEach((item: any) => {
      result.push(item.role);
    });
    return result;
  }

  private _filterPostData(row) {
    let {
      ruleName,
      roles,
      pushStarttime,
      pushEndtime,
      alarmStarttime,
      alarmEndtime,
      subTypes,
      alarmLevel,
      pushType,
      pushMode,
      id,
    } = row;
    let filterRoles = this._filterRoleList(roles, this.roleList);
    let postData = {
      ruleName,
      roles: filterRoles,
      pushStarttime,
      pushEndtime,
      alarmStarttime,
      alarmEndtime,
      subTypes: subTypes.join(","),
      alarmLevel:
        typeof alarmLevel === "string" ? alarmLevel : alarmLevel.join(","),
      pushType,
      pushMode,
    };
    id && (postData.id = id);
    return postData;
  }
}
</script>
<style lang="scss" scoped>
.level-select {
  width: auto !important;
  box-sizing: border-box;
  background: #eff2f7;
  // border: 1px solid #bbbfcd;
}
.dle-tip {
  display: flex;
  align-items: center;
  padding-left: 8px;
  color: #3e475f;
  .el-icon-warning {
    font-size: 32px;
    color: #ff0018;
    margin-right: 8px;
  }
}
</style>
<style lang="scss">
// .popper-tree{
//     height: 250px;
//     overflow: hidden;
// }
// .scrollbar-wrapper{
//     height: 250px;
// }
</style>
