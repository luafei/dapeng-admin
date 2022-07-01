<template>
  <div class="dashboard-container">
    <!--<component :is="currentRole" />-->
    <div class="tabBox">
      <web-page></web-page>
      <!-- <el-tabs
        v-model="activeName"
        @tab-click="handleClick"
      >
        <el-tab-pane
          label="网页权限"
          name="first"
        >
          <web-page></web-page>
        </el-tab-pane>
        <el-tab-pane
          label="大屏权限"
          name="second"
        >
          <big-screen></big-screen>
        </el-tab-pane>
      </el-tabs> -->
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { Form } from 'element-ui'
import WebPage from './components/webPage.vue'
import BigScreen from './components/bigScreen.vue'
import tipsDialog from '@/components/TipsDialog'

@Component({
  name: 'Permissions',
  components: {
      WebPage,
      BigScreen,
      tipsDialog
  }
})
export default class extends Vue {
  private currentRole = 'admin-dashboard';
  private activeName = 'first';
  private delTitle = '';// 删除弹窗标题
  private addDialog = false;
  private editDialog = false;
  private addDialogRole = false;
  private dialogText = '';
  private title = '提示';
  private checked = false;
  private cityOptions = ['上海', '北京', '广州', '深圳'];
  private checkAll= false;
  private checkedCities=['上海', '北京'];
  private cities = this.cityOptions;
  private isIndeterminate = true;
  private checkoutList = [
    {
      title: '泥土车',
      fileList: [
        {
          name: '泥土车A',
          value: '1'
        },
        {
          name: '泥土车B',
          value: '2'
        },
        {
          name: '泥土车C',
          value: '3'
        }
      ]
    },
    {
      title: '泥土车1',
      fileList: [
        {
          name: '泥土车A',
          value: '1'
        },
        {
          name: '泥土车B',
          value: '2'
        },
        {
          name: '泥土车C',
          value: '3'
        }
      ]
    },
    {
      title: '泥土车2',
      fileList: [
        {
          name: '泥土车A',
          value: '1'
        },
        {
          name: '泥土车B',
          value: '2'
        },
        {
          name: '泥土车C',
          value: '3'
        },
        {
          name: '泥土车D',
          value: '4'
        },
        {
          name: '泥土车E',
          value: '5'
        }
      ]
    }
  ]

  private nameList = [
    {
      label: 'admin',
      value: 1
    },
    {
      label: '管理',
      value: 2
    }
  ]

  private alarmLevelList = [
    {
      label: '一级菜单',
      value: 1
    },
    {
      label: '二级菜单',
      value: 2
    },
    {
      label: '三级菜单',
      value: 3
    }
  ]

  private listData = [
    { name: '张三' },
    { name: '张三1' },
    { name: '张三2' },
    { name: '张三3' }

  ]

  private ruleForm = {
    name: '',
    account: '',
    pass: '',
    checkPass: '',
    phoneNum: ''
  };

  private ruleFormEdit = {
    name: '张三',
    account: '123456',
    pass: '',
    checkPass: ''
  }

  private ruleFormRole = {
    webUrl: '',
    webName: '',
    webMuen: 1
  }

  private ruleRole = {
    webUrl: [
      { required: true, message: '请输入地址', trigger: 'blur' }
    ],
    webName: [
      { required: true, message: '请输入网页名称', trigger: 'blur' }
    ],
    webMuen: [
      { required: true, message: '请选择菜单', trigger: 'change' }
    ]
  }

  private rules ={
    name: [
      { required: true, message: '请输入姓名', trigger: 'blur' }
    ],
    account: [
      { required: true, message: '请输入账号', trigger: 'blur' }
    ],
    phoneNum: [
      { required: true, message: '请输入手机号', trigger: 'blur' }
    ]
  }

  private list = [
    {
      webUrl: 'www.123.com',
      webName: '用户管理',
      webMuen: '一级菜单'
    }, {
      webUrl: 'www.123.com',
      webName: '用户管理',
      webMuen: '一级菜单'
    }, {
      webUrl: 'www.123.com',
      webName: '用户管理',
      webMuen: '一级菜单'
    }, {
      webUrl: 'www.123.com',
      webName: '用户管理',
      webMuen: '一级菜单'
    }
  ]

  private listSec = [
    {
      name: '管理员',
      largeScreenPermission: '泥土车、危化品车、公交运力保障、旅游-沙滩、生态环保'
    },
    {
      name: '管理员',
      largeScreenPermission: '泥土车、危化品车、公交运力保障、旅游-沙滩、生态环保'
    },
    {
      name: '管理员',
      largeScreenPermission: '泥土车、危化品车、公交运力保障、旅游-沙滩、生态环保'
    },
    {
      name: '管理员',
      largeScreenPermission: '泥土车、危化品车、公交运力保障、旅游-沙滩、生态环保'
    }
  ]

    private showTipsDialog = false
    private keyword = ''
    private page = {
      currentPage: 1,
      pageSize: 2,
      pageSizes: [2],
      total: 4
    }

    private option = {
      page: true,
      addBtn: false,
      index: true,
      indexLabel: 'ID',
      selection: true,
      align: 'center',
      menuAlign: 'center',
      labelWidth: 115,
      stripe: true,
      addTitle: '新增角色',
      ediTitle: '修改角色',
      tip: false,
      delBtn: false,
      editBtn: false,
      column: [
        {
          label: '网页URL',
          prop: 'webUrl'
        },
        {
          label: '网页名称',
          prop: 'webName'
        },
        {
          label: '菜单',
          prop: 'webMuen'
        }
      ]
    }

    private optionSec = {
      page: true,
      addBtn: false,
      selection: true,
      index: true,
      indexLabel: '序号',
      align: 'center',
      menuAlign: 'center',
      labelWidth: 115,
      stripe: true,
      addBtnText: '新增用户',
      // editBtnText: '修改',
      editBtn: false,
      delBtn: false,
      edititle: '修改用户',
      tip: false,
      column: [
        {
          label: '角色名称',
          prop: 'name'
        },
        {
          label: '大屏权限',
          prop: 'largeScreenPermission'
        }
      ]
    }
    created() {
      console.log('pppp')
    }
    private getList() {
      console.log('1111111')
    }

    private handleCheckAllChange(val:any) {
      this.checkedCities = val ? this.cityOptions : []
      this.isIndeterminate = false
    }

    private handleCheckedCitiesChange(value:any) {
      const checkedCount = value.length
      this.checkAll = checkedCount === this.cities.length
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.cities.length
    }

    private sizeChange(val:number) {
      this.page.currentPage = 1
      this.page.pageSize = val
      this.getList()
    }

    private currentChange(val:number) {
      this.page.currentPage = val
      this.getList()
    }

    private handleSubmit() {
      this.showTipsDialog = false
    }

    private closed() {
      console.log('222222222222')
    }

    private addInfo() {
      this.title = '新增权限'
      this.addDialog = true
    }

    private editInfo() {
      this.title = '修改密码'
      this.editDialog = true
    }

    private editSubmit(val:any) {
      (this.$refs[val] as Form).validate((valid) => {
        if (valid) {
          alert('submit!')
          this.editDialog = false
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }

    private error() {
      this.addDialog = true
    }

    // 新增角色
    private addRole(val:any) {
      switch (val) {
        case 'add':
          this.title = '新增网页'
          break
        case 'edit':
          this.title = '修改角色'
          break
        default:
      }
      this.addDialogRole = true
    }

    public handleClick(): void {
      
    }

    private check(index:any) {
      console.log('index', index)
    }
}
</script>

<style lang="scss" scoped>
.dashboard-container {
  padding: 10px;
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
    .level-select{
        width: auto!important;
        box-sizing: border-box;
    }
    .dialogBox {
        width: 300px;
        height: 300px;
        background: red($color: #000000);
    }
  }
  .el-form-item__content {
      background: red;
  }

  .el-select .level-select .el-select--medium{
      width: 100%;
  }
}
</style>
<style>
    .dialogBox {
      width: 100%;
      height: 280px;
      background: #ffffff;
      border: 1px solid #e2e3e6;
      border-radius: 2px;
      overflow-y:scroll ;
      padding: 13px 15px;
    }
    .chockoutBox {
      width: 100%;
      height: 100%;
      background: #f5f5f6;
      padding: 0 28px;
    }
    .itemBox {
      margin-right: 86px;
    }
    /* 定义滚动条样式 */
    ::-webkit-scrollbar {
      width: 6px;
      height: 6px;
      background-color: rgba(240, 240, 240, 1);
    }

    /*定义滚动条轨道 内阴影+圆角*/
    ::-webkit-scrollbar-track {
      box-shadow: inset 0 0 0px rgba(240, 240, 240, .5);
      border-radius: 10px;
      background-color:#fff;
    }

    /*定义滑块 内阴影+圆角*/
    ::-webkit-scrollbar-thumb {
      border-radius: 10px;
      box-shadow: inset 0 0 0px rgba(95, 37, 37, 0.5);
      background-color: rgba(240, 240, 240, .5);
    }
</style>
