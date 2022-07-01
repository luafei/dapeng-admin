<template>
    <el-card class="box-card">
        <el-row>
             <el-col class="col-item" v-for="item in list" :key="item.id" :span="24">
                <span>{{item.pageName}}：</span>
                <el-switch
                    v-model="item.pageStatus"
                    @change="hanldeChange(item)">
                </el-switch>
            </el-col>
            <!-- <el-col class="col-item" :span="24">
                <span>设备离线预警开关：</span>
                <el-switch
                    v-model="deviceWarningSwitch"
                    @change="hanldeDeviceWarning">
                </el-switch>
            </el-col>
            <el-col class="col-item" :span="24">
                <span>台风天开关：</span>
                <el-switch
                    v-model="typhoonDaySwitch"
                    @change="hanldeTyphoonDay">
                </el-switch>
            </el-col> -->
        </el-row>
    </el-card>
</template>
<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import { queryDicPageStatus, alterDicPageStatus } from '@/api/switchPage'

export interface IdicPageStatus{
    id?: number,
    createTime: number,
    pageCode: string,
    pageName: string,
    pageStatus: string | boolean
}

@Component({
  name: 'SwitchPage',
})
export default class SwitchPage extends Vue{
    private deviceWarningSwitch:boolean = false
    private typhoonDaySwitch:boolean = true
    private list:IdicPageStatus[] = []

    created(){
        this.queryPageStatus()
    }

    private async queryPageStatus(){
        const res = await queryDicPageStatus()
        this.list = res.data
        this.list.forEach((item:IdicPageStatus) => {
            item.pageStatus = item.pageStatus === '1' ? true : false ;
        })
        // console.log(this.list,'ddd')
    }

    private async hanldeChange(item:IdicPageStatus){
        let postData = {
            id: item.id,
            pageStatus: item.pageStatus ? '1' : '0'
        }
        const res:any = await alterDicPageStatus(postData)
        this.$message({
          message: res.msg,
          type: 'success'
        });
    }
}
</script>
<style lang="scss" scoped>
    .col-item{
        margin: 10px 0;
    }
</style>