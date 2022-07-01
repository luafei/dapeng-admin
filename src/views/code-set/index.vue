<template>
<el-card class="box-card">
    <div slot="header" class="clearfix">
        <span>{{$t('route.videoCodeSet')}}</span>
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
        <template slot="menuLeft">
            <el-upload style="display:inline-block;" accept=".xlsx, .xls" :auto-upload="false" :show-file-list="false" :action="''" :on-change="handleChange">
                <el-button size="small">导入</el-button>
            </el-upload>
            <el-button size="small" @click="handleExport">导出</el-button>
        </template>
        <!-- <template slot-scope="scope" slot="menu">
            <el-button type="text" size="small" @click.stop="$refs.bigCrud.rowEdit(scope.row,scope.index)">修改</el-button>
            <el-button type="text" size="small" @click.stop="$refs.bigCrud.rowDel(scope.row,scope.index)">删除</el-button>
        </template> -->
    </avue-crud>
    <tipsDialog v-if="showTipsDialog" :show.sync="showTipsDialog" title="删除记录" @closed="closed" @handle-submit="handleSubmit">
        <div class="dle-tip">
            <i class="el-icon-warning"></i>
            是否删除视频点名称：{{delName}} 的记录
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
    <tipsDialog v-if="showDialogRowDialog" :show.sync="showDialogRowDialog" title="删除记录" @closed="closedDialogRowDialog" @handle-submit="handleSubmitDelRow">
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
    getTableCodeList,
    addTableCode,
    updateTableCode,
    delTableCode,
    importTableCode,
    exportTableCode
} from '@/api/tableCode.ts'

import { carInOutDic } from '@/const/dicData.ts'
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
        selection: false,
        addBtnText: "新增字段",
        tip: false,
        reserveSelection: true,
        dialogClickModal: false,
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
        // title:'记录',
        // excelBtn:true,
        align: "center",
        menuAlign: "center",
        index: true,
        indexLabel: "序号",
        labelWidth: 115,
        stripe: true,
        addTitle: "新增记录",
        addBtnText: "新建记录",
        editBtnText: "修改",
        editBtn: true,
        delBtn: true,
        selection: false,
        tip: false,
        reserveSelection: true,
        column: [
            {
                label: '视频点名称',
                prop: 'videoName',
                minWidth: 200
            },
            {
                label: '视频点编码',
                prop: 'videoCode',
                minWidth: 200
            },
            {
                label: '卡口编码',
                prop: 'crossingIndexCode',
                minWidth: 230
            },
            {
                label: "经度",
                prop: "longitude",
                minWidth: 130
            },
            {
                label: "纬度",
                prop: "latitude",
                minWidth: 130
            },
            {
                label: '所属出入口',
                prop: 'tollName'
            },
            {
                label: '所属路段',
                prop: 'roadName'
            },
            {
                label: '所属范围',
                prop: 'scope'
            },
            {
                label: '所属沙滩',
                prop: 'beach',
                minWidth: 200
            },
            {
                label: '所属加油站',
                prop: 'petrolStation'
            },
            {
                label: '所属危化品企业',
                prop: 'dangerCompany',
                minWidth: 200
            },
            {
                label: '驶入驶出',
                prop: 'carIn',
                type: 'select',
                dicData: carInOutDic,
                formatter: function(row, value){ //0:驶入  1:驶出
                    return value == 0 ? '驶入' : (value == 1 ? '驶出' : '')
                }
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
            const res = await getTableCodeList(params);
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
        console.log(val)
        this.page.currentPage = val;
        this.getList();
    }
    // 删除记录
    private async handleSubmit() {
        await delTableCode(this.ids)
        this.showTipsDialog = false;
        this.$message.success("删除单个记录成功");
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
        this.delName = row.videoName;
        this.ids = row.id+''
        this.showTipsDialog = true;
    }
    private handleRowDBLClick(row: any) {
        console.log(row);
        this.showRowDialogTitle = row.name;
        this.showRowDialog = true;
    }
    private async handleRowUpdated(row: any, index: Number, done: any) {
        await updateTableCode(row)
        done();
        this.$message.success("保存记录成功");
        this.getList();
    }
    private async handleRowSave(row: any, done: any) {
        // let {crossingIndexCode, videoName, videoCode, roadName, tollName, scope, beach, petrolStation, dangerCompany, carIn, longitude, latitude} = row
        await addTableCode(row)
        done();
        this.$message.success("新增记录成功");
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
        this.$message.success("保存记录成功");
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
    private submitUpload(file:any){
        this.$confirm('此操作将覆盖之前数据, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
            const res = await importTableCode(file.raw);
            this.getList()
            return this.handleUploadDialogSubmit(file.name, "success");
        }).catch(() => {
        });
    }
    private handleChange(file: any, fileList: Array < any > ) {
        let extension = file.name.substring(file.name.lastIndexOf(".") + 1);
        if (extension != "xlsx" && extension != "xls") {
            fileList.pop();
            return this.handleUploadDialogSubmit(file.name, "error");
            // return this.$message.warning(`只能上传后缀是.xlsx或者.xsl的文件`);
        }
        this.submitUpload(file)
        // var reader = new FileReader();
        // reader.readAsBinaryString(file.raw);
        // reader.onload = (e:any) => {
        // const data = e.target.result;
        //     const zzexcel = (window as any).XLS.read(data, {
        //         type: 'binary'
        //     });
        //     const result = [];
        //     for (let i = 0; i < zzexcel.SheetNames.length; i++) {
        //         const newData = (window as any).XLS.utils.sheet_to_json(zzexcel.Sheets[zzexcel.SheetNames[i]]);
        //         result.push(...newData)
        //     }
        //     if(result.length === 0){
        //         return this.$message.warning(`请勿上传空文件`);
        //     }else{
        //         console.log('result', result)
        //         return this.$message.success(`上传成功`);
        //     }
        // }
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
        const res = await exportTableCode();

        // console.log((this as any).$export)
        // console.log(this.option.column)
        // let opt = {
        //     title: "记录",
        //     column: this.option.column,
        //     data: this.list,
        // };
        // // return;
        // // let opt = {
        // // title: '文档标题',
        // //     column: [{
        // //     label: '标题',
        // //     prop: 'title'
        // //     }],
        // //     data: [{
        // //     title: "测试数据1"
        // //     }, {
        // //     title: "测试数据2"
        // //     }]
        // // };
        // (this as any).$export.excel({
        //     title: opt.title || new Date().getTime(),
        //     columns: opt.column,
        //     data: opt.data,
        // });
        // return;
        // var aoa = [
        //     ['姓名', '性别', '年龄', '注册时间'],
        //     ['张三', '男', 18, new Date()],
        //     ['李四', '女', 22, new Date()]
        // ];
        // var sheet = (window as any).XLSX.utils.aoa_to_sheet(aoa);
        // this.openDownloadDialog(this.sheet2blob(sheet), '记录.xlsx');
    }
    // private openDownloadDialog(url:any, saveName:String)
    // {
    //     if(typeof url == 'object' && url instanceof Blob)
    //     {
    //         url = URL.createObjectURL(url); // 创建blob地址
    //     }
    //     var aLink:any = document.createElement('a');
    //     aLink.href = url;
    //     aLink.download = saveName || ''; // HTML5新增的属性，指定保存文件名，可以不要后缀，注意，file:///模式下不会生效
    //     var event;
    //     if(window.MouseEvent) event = new MouseEvent('click');
    //     else
    //     {
    //         event = document.createEvent('MouseEvents');
    //         event.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
    //     }
    //     aLink.dispatchEvent(event);
    // }
    // private sheet2blob(sheet:any) {
    //     var sheetName = 'sheet1';
    //     var workbook:any = {
    //         SheetNames: [sheetName],
    //         Sheets: {}
    //     };
    //     workbook.Sheets[sheetName] = sheet;
    //     // 生成excel的配置项
    //     var wopts = {
    //         bookType: 'xlsx', // 要生成的文件类型
    //         bookSST: false, // 是否生成Shared String Table，官方解释是，如果开启生成速度会下降，但在低版本IOS设备上有更好的兼容性
    //         type: 'binary'
    //     };
    //     var wbout = (window as any).XLSX.write(workbook, wopts);
    //     var blob = new Blob([s2ab(wbout)], {type:"application/octet-stream"});
    //     // 字符串转ArrayBuffer
    //     function s2ab(s:any) {
    //         var buf = new ArrayBuffer(s.length);
    //         var view = new Uint8Array(buf);
    //         for (var i=0; i!=s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
    //         return buf;
    //     }
    //     return blob;
    // }
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
