<template>
<div class="web-page">
    <avue-crud :data="list" :page.sync="page" :option="option" @size-change="sizeChange" @current-change="currentChange">
        <template slot="menuLeft">
            <el-button size="small" type="primary" @click="addRole('add')">
                {{ ' + ' + $t('permission.addWeb') }}
            </el-button>
            <el-input v-model="keyword" size="small" class="avue-search" placeholder="请输入关键词查询" suffix-icon="el-icon-search" />
        </template>
        <template slot="user" slot-scope="scope">
            <el-tag>{{ scope.row.user }}</el-tag>
        </template>
        <template slot="menu" slot-scope="{type,size}">
            <!-- <el-button icon="el-icon-edit" :size="size" :type="type" @click="addRole('edit')">
                {{ '修改' }}
            </el-button>
            <el-button icon="el-icon-delete" :size="size" :type="type" @click="handleDel(1)">
                {{ '删除' }}
            </el-button> -->
        </template>
    </avue-crud>
</div>
</template>

<script lang="ts">
import {
    Component,
    Vue
} from 'vue-property-decorator'
@Component({
  name: 'BigScreen',
})
export default class extends Vue {
    private list = [
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
    private page:page = {
        currentPage: 1,
        pageSize: 10,
        total: 0
    }
    private keyword:string = ''
    private option = {
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

    }
    private getList(){

    }
    private sizeChange(val: number) {
        this.page.currentPage = 1
        this.page.pageSize = val
        this.getList()
    }
    private currentChange(val: number) {
        this.page.currentPage = val
        this.getList()
    }

}
</script>

<style lang="scss" scoped>
.web-page {}
</style>
