<template>
<el-card class="box-card">
    <div slot="header" class="clearfix">
        <span>{{$t('route.holidayCode')}}</span>
    </div>
    <avue-crud 
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
        ref="bigCrud">
        <!-- <template slot="menuLeft">
            <el-upload style="display:inline-block;" accept=".xlsx, .xls" :auto-upload="false" :show-file-list="false" :action="''" :on-change="handleChange">
                <el-button size="small">导入</el-button>
            </el-upload>
            <el-button size="small" @click="handleExport">导出</el-button>
        </template> -->
        <!-- <template slot-scope="scope" slot="menu">
            <el-button type="text" size="small" @click.stop="$refs.bigCrud.rowEdit(scope.row,scope.index)">修改</el-button>
            <el-button type="text" size="small" @click.stop="$refs.bigCrud.rowDel(scope.row,scope.index)">删除</el-button>
        </template> -->
    </avue-crud>
    <tipsDialog v-if="showTipsDialog" :show.sync="showTipsDialog" title="删除码表" @closed="closed" @handle-submit="handleSubmit">
        <div class="dle-tip">
            <i class="el-icon-warning"></i>
            是否删除{{$t('route.holidayCode')}}记录：{{delName}} 的记录
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
    <tipsDialog v-if="showRowDialog" :show.sync="showRowDialog" :title="showRowDialogTitle" @closed="closedRowDialog" dialogWidth="80%" @handle-submit="closedRowDialog">
        <div class="upload-tip">
            <avue-crud :data="rowlist" @row-del="handleShowDelRowDialog" @row-save="handleShowAddRowDialog" @row-update="handledataRowUpdated" :option="rowOption" ref="rowCrud">
                <template slot-scope="scope" slot="menu">
                    <el-button type="text" size="small" @click.stop="$refs.rowCrud.rowEdit(scope.row,scope.index)">修改</el-button>
                    <el-button type="text" size="small" @click.stop="$refs.rowCrud.rowDel(scope.row,scope.index)">删除</el-button>
                </template>
            </avue-crud>
        </div>
    </tipsDialog>
    <tipsDialog v-if="showDialogRowDialog" :show.sync="showDialogRowDialog" title="删除码表" @closed="closedDialogRowDialog" @handle-submit="handleSubmitDelRow">
        <div class="dle-tip">
            <i class="el-icon-warning"></i>
            <span v-html="dialogRowDel&&dialogRowDel.name"></span>
            <!-- 是否删除字段：{{dialogRowDel.name}} -->
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
    getHolidayCodeList,
    addHolidayCode,
    updateHolidayCode,
    delHolidayCode,
    importIconTableCode,
    exportIconTableCode
} from '@/api/tableCode.ts'

import { carInOutDic, iconTypeDic } from '@/const/dicData.ts'
import { AnySrvRecord } from "dns";
import tipsDialog from '@/components/TipsDialog'

@Component({
    name: "Message",
    components: {
        tipsDialog
    }
})
export default class extends Vue {
    private tableLoading =  false
    private showTipsDialog = false;
    private delName = "";
    private showUploadResultDialog = false;
    private UploadResultMessage = "";
    private UploadFileName = "";
    private showRowDialog = false;
    private showRowDialogTitle = "";
    private ids:string = ''
    private rowlist = [{
        id: 1,
        name: "张三",
        type: "Number",
        desc: "11",
    }, ];
    private rowOption = {
        align: "center",
        menuAlign: "center",
        index: true,
        indexLabel: "ID",
        labelWidth: 115,
        stripe: true,
        columnBtn: false,
        refreshBtn: false,
        editBtn: false,
        delBtn: false,
        selection: true,
        addBtnText: "新增字段",
        tip: false,
        reserveSelection: true,
        column: [{
                label: "字段",
                prop: "name",
                span: 23,
                row: true,
            },
            {
                label: "字段类型",
                prop: "type",
                span: 23,
                row: true,
                type: "select",
                dicData: [{
                    label: "测试",
                    value: 1,
                }, ],
            },
            {
                label: "备注",
                prop: "desc",
                span: 23,
                row: true,
            },
        ],
    };
    private showDialogRowDialog = false;
    private dialogRowDel = {
        id: "",
        name: "",
    };
    private list: Array < object > = [];
    private page: page = {
        currentPage: 1,
        pageSize: 10,
        total: 0
    }
    private option = {
        page: true,
        // title:'码表',
        // excelBtn:true,
        align: "center",
        menuAlign: "center",
        index: true,
        indexLabel: "序号",
        labelWidth: 90,
        stripe: true,
        addTitle: "新增记录",
        addBtnText: "新增记录",
        editBtnText: "修改",
        editBtn: true,
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
                label: '天',
                prop: 'day',
                type: 'date',
                valueFormat: 'yyyy-MM-dd',
                rules: [
                    {required: true, message:'请选择天', trigger:'blur'}
                ]
            },
            {
                label: '节假日描述',
                prop: 'dayInfo',
            },
            {
                label: '创建时间',
                prop: 'createTime',
                addDisplay: false,
                editDisplay: false,
                type: 'timerange',
                valueFormat: 'yyyy-MM-dd HH:mm:ss',
                format: 'yyyy-MM-dd HH:mm:ss'
            }
        ],
    };
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
            const res = await getHolidayCodeList(params);
            this.tableLoading = false
            this.list = res.data.data
            this.list.forEach((item:any) => {item.type = item.typeCode})
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
        console.log(val)
        this.page.currentPage = val;
        this.getList();
    }
    // 删除码表
    private async handleSubmit() {
        await delHolidayCode(this.ids)
        this.showTipsDialog = false;
        this.$message.success("删除成功");
        this.getList();
    }
    // 当选择项发生变化时会触发该事件
    private selectionChange(row: any): void {
        // console.log(row,'dddss')
    }
    // 关闭时触发
    private closed(): void {
        this.delName = "";
    }
    private handleShowDelDialog(row: any): void {
        // console.log(row)
        this.delName = row.name;
        this.ids = row.id+''
        this.showTipsDialog = true;
    }
    private handleRowDBLClick(row: any) {
        console.log(row);
        this.showRowDialogTitle = row.name;
        this.showRowDialog = true;
    }
    private async handleRowUpdated(row: any, index: Number, done: any) {
        await updateHolidayCode(row)
        done();
        this.$message.success("修改成功");
        this.getList();
    }
    private async handleRowSave(row: any, done: any) {
        delete row.createTime
        await addHolidayCode(row)
        done();
        this.$message.success("新增成功");
        this.getList();
    }
    private handleShowAddRowDialog(row: any, done: any) {
        // console.log(row)
        done();
        this.$message.success("增加字段成功");
    }
    private handledataRowUpdated(row: any, index: Number, done: any) {
        // console.log(row);
        done();
        this.$message.success("保存码表成功");
    }
    private closedDialogRowDialog() {
        this.showDialogRowDialog = false;
    }
    private handleShowDelRowDialog(row: any) {
        // console.log(row)
        this.dialogRowDel.id = row.id;
        this.dialogRowDel.name = row.name;
        this.showDialogRowDialog = true;
    }
    private handleSubmitDelRow() {
        this.dialogRowDel.id = "";
        this.dialogRowDel.name = "";
        this.showDialogRowDialog = false;
        this.$message.success("删除字段成功");
    }
    private closedRowDialog() {
        this.showRowDialogTitle = "";
        this.showRowDialog = false;
    }
    private submitUpload(file){
        this.$confirm('此操作将覆盖之前数据, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
            const res = await importIconTableCode(file.raw);
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
    private async handleExport() {
        const res = await exportIconTableCode();
    }
    private refreshChange(){
        this.getList()
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

.avue-crud__left {
    width: 500px;
}
</style>
