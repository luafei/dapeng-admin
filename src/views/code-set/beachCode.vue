
<template>
    <el-card class="box-card">
        <div slot="header" class="clearfix">
            <span>{{$t('route.beachCode')}}</span>
        </div>
         <avue-crud 
            :before-open="beforeOpen"
            :table-loading="tableLoading"
            :data="list" 
            :page.sync="page" 
            @size-change="sizeChange" 
            @current-change="currentChange" 
            @row-del="handleShowDelDialog" 
            @row-save="handleRowSave" 
            @row-update="handleRowUpdated" 
            @selection-change="selectionChange" 
            @refresh-change="refreshChange"
            :option="option" 
            ref="crud">
            <template slot="menuLeft">
                <el-upload style="display:inline-block;" accept=".xlsx, .xls" :auto-upload="false" :show-file-list="false" :action="''" :on-change="handleChange">
                    <el-button size="small">导入</el-button>
                </el-upload>
                <el-button size="small" @click="handleExport">导出</el-button>
            </template>
            <template slot="pathwayBusForm">
                <div>
                    <el-tag
                        :key="name"
                        v-for="name in dynamicBus"
                        closable
                        :disable-transitions="false"
                        @close="handleClose(name)">
                        {{name}}
                    </el-tag>
                    <el-input
                        class="input-new-tag"
                        v-if="busVisible"
                        v-model="bus"
                        ref="saveTagInput"
                        size="small"
                        @keyup.enter.native="handleInputConfirm"
                        @blur="handleInputConfirm"
                        >
                    </el-input>
                    <el-button v-else class="button-new-tag" size="small" @click="showInput">+ 新增</el-button>
                </div>
            </template>
            <template slot="menu" slot-scope="{row, size, type, index}">
                <el-button icon="el-icon-edit" :size="size" :type="type" @click="handleEdit(row, index)">
                    修改
                </el-button>
            </template>
            <!-- <template slot-scope="scope" slot="menu">
                <el-button type="text" size="small" @click.stop="$refs.bigCrud.rowEdit(scope.row,scope.index)">修改</el-button>
                <el-button type="text" size="small" @click.stop="$refs.bigCrud.rowDel(scope.row,scope.index)">删除</el-button>
            </template> -->
        </avue-crud>
        <tipsDialog v-if="showTipsDialog" :show.sync="showTipsDialog" title="删除码表" @closed="closed" @handle-submit="handleSubmit">
            <div class="dle-tip">
                <i class="el-icon-warning"></i>
                是否删除沙滩码表记录：{{delName}} 的记录
            </div>
        </tipsDialog>
        <tipsDialog v-if="showUploadResultDialog" :show.sync="showUploadResultDialog" title="导入" @closed="closedUploadDialog" @handle-submit="closedUploadDialog">
            <div class="upload-tip">
                <div class="icon">
                    <i v-if="UploadResultMessage==='success'" class="el-icon-success" />
                    <i v-else class="el-icon-error" />
                </div>
                <div>
                    <p>{{UploadFileName}}，{{UploadResultMessage==='success'?'上传成功':'上传失败'}}</p>
                </div>
            </div>
        </tipsDialog>
    </el-card>
</template>
<script lang="ts">
import {
    Component,
    Vue,
    Watch
} from "vue-property-decorator";

import {
    getBeachDicPageList,
    addBeachDic,
    updateBeachDic,
    deleteBeachDic,
    importBeachCode,
    exportBeachCode
} from '@/api/tableCode.ts'
import tipsDialog from '@/components/TipsDialog'

@Component({
    name: "BeachCode",
    components: {
        tipsDialog
    }
})
export default class extends Vue {
    private list: Array < object > = []
    private tableLoading =  false
    private showTipsDialog = false
    private page: page = {
        currentPage: 1,
        pageSize: 10,
        total: 0
    }
    private dynamicBus = []
    private busVisible = false
    private bus = ''
    private delName = "";
    private showUploadResultDialog = false;
    private UploadResultMessage = "";
    private UploadFileName = "";
    private showRowDialog = false;
    private ids:string = ''
    private option = {
        page: true,
        align: "center",
        menuAlign: "center",
        index: true,
        indexLabel: "序号",
        labelWidth: 120,
        stripe: true,
        addTitle: "新增记录",
        addBtnText: "新增记录",
        editBtnText: "修改",
        editBtn: false,
        delBtn: true,
        selection: false,
        tip: false,
        reserveSelection: true,
        dialogClickModal: false,
        column: [
            // {
            //     label: 'ID',
            //     prop: 'id',
            //     editDisplay: false,
            //     rules: [
            //         {required: true, message:'请输入ID', trigger:'blur'}
            //     ]
            // },
            {
                label: '类型',
                prop: 'type',
                rules: [
                    {required: true, message:'请输入类型', trigger:'blur'}
                ]
            },
            {
                label: '类别名称',
                prop: 'typeName',
                minWidth: 230,
                rules: [
                    {required: true, message:'请输入类别名称', trigger:'blur'}
                ]
            },
            {
                label: "沙滩名称",
                prop: "beachName",
                minWidth: 230,
                rules: [
                    {required: true, message:'请输入沙滩名称', trigger:'blur'}
                ]
            },
            {
                label: '所属办事处',
                prop: 'depart',
                rules: [
                    {required: true, message:'请输入所属办事处', trigger:'blur'}
                ]
            },
             {
                label: '管理主体',
                prop: 'manager',
                minWidth: 230,
                rules: [
                    {required: true, message:'请输入管理主体', trigger:'blur'}
                ]
            },
            {
                label: '管理类型',
                prop: 'managerType',
                rules: [
                    {required: true, message:'请输入管理类型', trigger:'blur'}
                ]
            },
            {
                label: "经度",
                prop: "longitude",
                type: 'number',
                minWidth: 130
            },
            {
                label: "纬度",
                prop: "latitude",
                minWidth: 130,
                type: 'number',
            },
             {
                label: '长(m)',
                prop: 'length',
                type: 'number',
                rules: [
                    {required: true, message:'请输入长(m)', trigger:'blur'}
                ]
            },
             {
                label: '宽(m)',
                prop: 'wide',
                type: 'number',
                rules: [
                    {required: true, message:'请输入宽(m)', trigger:'blur'}
                ]
            },
             {
                label: '面积(㎡)',
                prop: 'beachArea',
                type: 'number',
                rules: [
                    {required: true, message:'请输入面积(㎡)', trigger:'blur'}
                ]
            },
             {
                label: '备注',
                prop: 'remark',
                minWidth: 400
            },
        ],
    }
    created() {
        this.getList()
    }
    private async getList(){
        try {      
            let params = {
                page: this.page.currentPage,
                pageSize: this.page.pageSize,
            }
            this.tableLoading = true
            const res = await getBeachDicPageList(params);
            this.tableLoading = false
            this.list = res.data.data
            this.page.total = res.data.total
        } catch (error) {
            this.tableLoading = false
        }
    }
    // 表格页码
    private sizeChange(val: number): void {
        this.page.currentPage = 1;
        this.page.pageSize = val;
        this.getList();
    }
    // 切换页面时触发该事件 page
    private currentChange(val: number): void {
        this.page.currentPage = val;
        this.getList();
    }
    private async handleRowSave(row: any, done: any) {
        await addBeachDic(row)
        done();
        this.$message.success("新增成功");
        this.getList();
    }
    private handleEdit(row, index){
        this.$refs.crud.rowEdit(row, index)
    }
    private async handleRowUpdated(row: any, index: Number, done: any) {
        row.pathwayBus = this.dynamicBus.join('、')
        await updateBeachDic(row)
        done();
        this.$message.success("修改成功");
        this.getList();
    }
    private handleShowDelDialog(row: any): void {
        // console.log(row)
        this.delName = row.beachName;
        this.ids = row.id+''
        this.showTipsDialog = true;
    }
    private async handleSubmit() {
        await deleteBeachDic(this.ids)
        this.showTipsDialog = false;
        this.$message.success("删除成功");
        this.getList();
    }
    private handleUploadDialogSubmit(name: any, msg: any) {
        this.UploadResultMessage = msg;
        this.UploadFileName = name;
        this.showUploadResultDialog = true;
    }
    private closedUploadDialog() {
        this.UploadResultMessage = "";
        this.UploadFileName = "";
        this.showUploadResultDialog = false;
    }
    private submitUpload(file){
        this.$confirm('此操作将覆盖之前数据, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
            const res = await importBeachCode(file.raw);
            this.getList()
            return this.handleUploadDialogSubmit(file.name, "success");
        }).catch(() => {
        });
    }
    private async handleChange(file: any, fileList: Array < any > ) {
        let extension = file.name.substring(file.name.lastIndexOf(".") + 1);
        if (extension != "xlsx" && extension != "xls") {
            fileList.pop();
            return this.handleUploadDialogSubmit(file.name, "error");
            // return this.$message.warning(`只能上传后缀是.xlsx或者.xsl的文件`);
        }
        
        this.submitUpload(file)
    }
    private async handleExport() {
        const res = await exportBeachCode();
    }
    private selectionChange(row: any): void {
        console.log(row,'selectionChange')
    }
    private handleClose(tag) {
        this.dynamicBus.splice(this.dynamicBus.indexOf(tag), 1);
    }
    private beforeOpen(done,type){
        if(type === 'add') this.dynamicBus = []
        done()
    }
    private showInput() {
        this.busVisible = true;
        this.$nextTick(() => {
            this.$refs.saveTagInput.$refs.input.focus();
        });
    }
    private handleInputConfirm() {
        let bus = this.bus;
        if (bus) {
            this.dynamicBus.push(bus);
        }
        this.busVisible = false;
        this.bus = '';
    }
    private refreshChange(){
        this.getList()
    }
    private closed(): void {
        this.delName = "";
    }
}
</script>
<style lang="scss" scoped>
     .el-tag + .el-tag {
    margin-left: 10px;
  }
  .button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }
  .input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
  }
  .upload-tip {
    display: flex;
    align-items: center;
    flex-direction: column;
    padding-left: 8px;
    color: #3e475f;

    div {
        display: block;
    }

    .icon {
        margin: 0 auto;
        font-size: 70px;

        .el-icon-error {
            color: rgba(233, 62, 62, 1);
        }

        .el-icon-success {
            color: rgba(103, 193, 58, 1);
        }
    }
}
</style>