<template>
<div class="web-page">
    <avue-crud 
        :table-loading="tableLoading"
        :data="list" 
        :page.sync="page" 
        :option="option" 
        @row-save="handleSave"
        @row-del="handleDel"
        @row-update="rowUpdate"
        @refresh-change="refreshChange"
        @size-change="sizeChange" 
        @current-change="currentChange">
        <template slot="user" slot-scope="scope">
            <el-tag>{{ scope.row.user }}</el-tag>
        </template>
        <template slot="menuLeft">
            <!-- <el-input v-model="keyword" size="small" class="avue-search" placeholder="请输入关键词查询" suffix-icon="el-icon-search" /> -->
            <Search v-model="keyword" @input="searchByKeyWord"></Search>
        </template>
    </avue-crud>
    <tipsDialog :show.sync="showTipsDialog" title="删除" @handle-submit="handleSubmitDel">
        <div>
            {{ delDialogText }}
        </div>
    </tipsDialog>
</div>
</template>

<script lang="ts">
import {
    Component,
    Vue
} from 'vue-property-decorator'
import { webPagePermissionList, addWebInfo, deleteWebInfo } from '@/api/permissions'
import Search from '@/components/Search'
import tipsDialog from '@/components/TipsDialog'

@Component({
  name: 'WebPage',
  components: {
      Search,
      tipsDialog
  }
})
export default class extends Vue {
    private tableLoading:boolean = false
    private list:Array<object> = []
    private page:page = {
        currentPage: 1,
        pageSize: 10,
        total: 0
    }
    private keyword: string = ''
    private showTipsDialog = false
    private currentId = 0
    private delDialogText = ''
    private debounced:any = null
    private option = {
        page: true,
        addBtn: true,
        delBtn: true,
        editBtn: true,
        index: true,
        indexLabel: 'ID',
        selection: true,
        align: 'center',
        menuAlign: 'center',
        labelWidth: 90,
        stripe: true,
        addTitle: '新增网页权限',
        ediTitle: '修改网页权限',
        tip: false,
        dialogWidth: 650,
        column: [{
                label: '网页URL',
                prop: 'webUrl',
                span: 24,
                rules: [{
                    required: true,
                    message: '请输入网页URL',
                    trigger: 'blur'
                }, ]
            },
            {
                label: '网页名称',
                prop: 'webName',
                span: 24,
                rules: [{
                    required: true,
                    message: '请输入网页名称',
                    trigger: 'blur'
                }]
            },
            {
                label: '菜单',
                prop: 'menuType',
                span: 24,
                type: 'select',
                rules: [{
                    required: true,
                    message: '请选择菜单',
                    trigger: 'change'
                }],
                dicData: [
                    {
                        label: '一级菜单',
                        value: 'first'
                    },
                    {
                        label: '二级菜单',
                        value: 'second'
                    },
                    {
                        label: '三级菜单',
                        value: 'third'
                    }
                ]
            }
        ]
    }
    created(){
        this.getList()
        this.debounced = (this as any)._.debounce(this.getList, 300)
    }
    private async getList() {
        try {     
            let postData = {
                page: this.page.currentPage,
                pageSize: this.page.pageSize,
                webName: this.keyword
            }
            this.tableLoading = true
            const res = await webPagePermissionList(postData)
            this.tableLoading = false
            this.page.total = res.data.total
            this.list = res.data.data
        } catch (error) {
            this.tableLoading = false
        }
    }
    private refreshChange(){
        this.getList()
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
    private async handleSave(row, done){
        await addWebInfo(row)
        this.getList()
        done()
    }
    private async rowUpdate(row, index, done){
        let {menuType, webName, webUrl, id} = row
        let postData = {menuType, webName, webUrl, id}
        await addWebInfo(postData)
        this.getList()
        done()
    }
    private searchByKeyWord(val){
        this.debounced()
    }
    private handleDel(val: any) {
        this.currentId = val.id
        this.delDialogText = '是否删除' + val.webName + '权限'
        this.showTipsDialog = true
    }

    private async handleSubmitDel() {
        let postData = {id: this.currentId}
        await deleteWebInfo(postData)
        this.$message({
          message: '已删除',
          type: 'success'
        });
        this.getList()
        this.showTipsDialog = false
    }
}
</script>

<style lang="scss" scoped>
.web-page {}
</style>
