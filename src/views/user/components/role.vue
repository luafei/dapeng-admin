<template>
<div class="role">
    <div>
        <avue-crud 
            ref="crud"
            :table-loading="tableLoading"
            :data="list" 
            :page.sync="page" 
            :option="option" 
            @row-save="handleSave" 
            @size-change="sizeChange"
            @current-change="currentChange" 
            @refresh-change="refreshChange"
            @row-update="rowUpdate"
            @row-del="handleDel">
            <template slot="menuLeft">
                <!-- <el-button size="small" type="primary" @click="addRole('add')">
                    {{ ' + ' + $t('permission.createRole') }}
                </el-button> -->
                <!-- <el-button size="small" @click="addRole('edit')">
                    {{ $t('permission.editRole') }}
                </el-button> -->
                <!-- <el-button size="small" @click="handleDel(1)">
                    {{ $t('permission.deleteRole') }}
                </el-button> -->
                <!-- <el-input v-model="keyword" size="small" class="avue-search" suffix-icon="el-icon-search" debounce @input="handleSearch" placeholder="请输入关键词查询" >
                </el-input> -->
                <Search v-model="keyword" @input="searchByKeyWord"></Search>
            </template>
            <template slot="user" slot-scope="scope">
                <el-tag>{{ scope.row.user }}</el-tag>
            </template>
            <template slot="resourceList" slot-scope="{row}">
                <el-popover
                    placement="right"
                    width="500"
                    :popper-class="'roles-popper'"
                    trigger="hover">
                    <el-table :data="row.resourceList">
                        <el-table-column width="100" property="webId" label="网页ID"></el-table-column>
                        <el-table-column width="160" property="webName" label="网页名称"></el-table-column>
                        <el-table-column width="220" property="webUrl" label="网页URL"></el-table-column>
                    </el-table>
                    <el-button size="mini" slot="reference">查看权限</el-button>
                </el-popover>
            </template>
            <template slot="resourceListForm">
                 <el-transfer
                    :titles="['请选择权限','已选择已选择']"
                    filterable
                    v-model="resourceList"
                    :props="{
                        key: 'webId',
                        label: 'webName'
                    }"
                    :data="permissionList">
                </el-transfer>
            </template>
            <template slot="menu" slot-scope="{row, size, type, index}">
                <el-button icon="el-icon-edit" :size="size" :type="type" @click="handleEdit(row, index)">
                    修改
                </el-button>
                <!-- <el-button icon="el-icon-delete" :size="size" :type="type" @click="handleDel(1)">
                    {{ '删除' }}
                </el-button> -->
            </template>
        </avue-crud>
    </div>
     <!--删除弹窗-->
    <tipsDialog :show.sync="showTipsDialog" :title="delTitle" @handle-submit="handleSubmit">
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
import {
    Form
} from 'element-ui'
import { rolePageList, addRole, delRole } from '@/api/roles.ts'
import { getUserPageList } from '@/api/users.ts'
import { webPagePermissionList } from '@/api/permissions'
import Search from '@/components/Search'
import tipsDialog from '@/components/TipsDialog'
import { parseTime } from '@/utils/index.ts'
import  { Iresouce } from '../../../store/modules/permission'

interface IroleData {
    createTime:number,
    id?: number,
    resourceList: Iresouce[],
    role: number,
    roleName: string
}

@Component({
    name: 'role',
    components: {
        Search,
        tipsDialog
    }
})
export default class extends Vue {
    private tableLoading =  false
    private delTitle = ''; // 删除弹窗标题
    private delDialogText = ''; // 删除弹窗文字内容
    private showDialog = false; // 控制提示弹窗的
    private showTipsDialog = false
    private keyword = ''
    private title = '提示';
    private addDialogRole = false;
    private resourceList:string[] = []
    private currentId:number = 0
    private list:Array<object> = []
    private permissionList:Array<Iresouce> = []
    private debounced:any = null
    private option = {
        index: true,
        indexLabel: '序号',
        page: true,
        addBtn: true,
        delBtn: true,
        editBtn: false,
        selection: false,
        align: 'left',
        menuAlign: 'center',
        labelWidth: 80,
        stripe: true,
        addTitle: '新增角色',
        ediTitle: '修改角色',
        addBtnText: '新增角色',
        editBtnText: '修改',
        tip: false,
        dialogClickModal: false,
        dialogWidth: '50%',
        column: [
            {
                label: '角色名称',
                prop: 'roleName',
                span: 24
            },
            {
                label: '权限设置',
                prop: 'resourceList',
                slot: true,
                formslot: true,
                span: 24
            },
            // {
            //     label: '网页ID',
            //     prop: 'webId',
            //     span: 24,
            // },
            // {
            //     label: '网页URL',
            //     prop: 'webUrl',
            //     span: 24,
            // },
            {
                label: '申请时间',
                prop: 'createTime',
                editDisplay: false,
                addDisplay: false,
                formatter: function(row:IroleData, value:number){
                    return value && parseTime(value)
                }
            }
        ]
    }

    private page:page = {
        currentPage: 1,
        pageSize: 10,
        total: 0
    }
    private ruleFormRole = {
        name: ''
    }
    private ruleRole = {
        name: [{
            required: true,
            message: '请输入角色',
            trigger: 'blur'
        }]
    }
    created(){
        this.getList()
        this.getPermissionList()
        this.debounced = this._.debounce(this.getList, 300)
    }
    private async getList() {
        try {     
            let params = {
                page: this.page.currentPage,
                pageSize: this.page.pageSize,
                roleName: this.keyword
            }
            this.tableLoading = true
            const res = await rolePageList(params);
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
    // private handleSearch(val){
    // }
    private async getPermissionList(){
        let postData = {
            page: 1,
            pageSize: 1000
        }
        const res = await webPagePermissionList(postData)
        this.permissionList = res.data.data
    }
    private async handleSave(row:IroleData,done:any){
        let webUrlArr:string[] = this._filterResourceList(this.resourceList, this.permissionList)
        let {roleName } = row
        let postData = {roleName,webId:this.resourceList.join(','),webUrl: webUrlArr.join(',')}
        await addRole(postData)
         this.$message({
            message: '新增成功',
            type: 'success'
        });
        this.getList()
        done()
    }
    private handleEdit(row:IroleData, index:number){
        this.resourceList = []
        row.resourceList.forEach(item => {
            this.resourceList.push(item.webId)
        });
        (this.$refs.crud as any).rowEdit(row, index)
    }
    private async rowUpdate(row:IroleData, index:number, done:any){
        let webUrlArr:string[] = this._filterResourceList(this.resourceList, this.permissionList)
        let {roleName, id, role } = row
        let postData = {id, role, roleName, webId:this.resourceList.join(','), webUrl: webUrlArr.join(',')}
        await addRole(postData)
        this.getList()
        this.$message({
            message: '修改成功',
            type: 'success'
        });
        done()
    }
    private handleDel(val: any) {
        console.log(val,'000');
        this.currentId = val.id
        this.delTitle = '删除角色'
        this.delDialogText = '是否删除' + val.roleName + '角色'
        this.showTipsDialog = true
    }

    // 新增角色
    private addRole(val: any) {
        switch (val) {
            case 'add':
                this.title = '新增角色'
                break
            case 'edit':
                this.title = '修改角色'
                break
            default:
        }
        this.addDialogRole = true
    }

    private submitRole(val: any) {
        (this.$refs[val] as Form).validate((valid) => {
            if (valid) {
                alert('submit!')
                this.addDialogRole = false
            } else {
                console.log('error submit!!')
                return false
            }
        })
    }
    private searchByKeyWord(){
        this.debounced()
    }
    private async handleSubmit() {
        let postData = {id: this.currentId}
        await delRole(postData)
        this.$message({
          message: '已删除',
          type: 'success'
        });
        this.getList()
        this.showTipsDialog = false
    }

    private _filterResourceList(filterList:string[], list:Iresouce[]): Array<string>{
        let result:string[] = []
        filterList.forEach(id => {
            list.some(item => {
                if(id === item.webId){
                    result.push(item.webUrl)
                    return true
                }
            })
        })
        return result
    }
}
</script>

<style lang='scss'>
.roles-popper{
    max-height: 400px;
    overflow-y: scroll;
}
</style>
