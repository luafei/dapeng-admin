<template>
    <el-input
        size="small"
        class="avue-search"
        clearable
        placeholder="请输入关键词查询"
        suffix-icon="el-icon-search"
        @input="input"
        v-model="keyword">
    </el-input>
</template>
<script lang="ts">
import { Component, Vue, Watch, Emit,Prop } from 'vue-property-decorator'

@Component({
  name: 'Search'
})
export default class extends Vue{
    @Prop(String) readonly value: string
    private keyword:string = ''

    @Emit()
    private input(val){
    
    }
}

</script>
<style lang="scss">
    .avue-search {
        width: 453px!important;
        padding-left: 10px;
        .el-input__inner {
            border-radius: 2px;
            box-sizing: border-box;
            border: 1px solid #979797;
        }
        .el-input__suffix {
            right: 28px;
            .el-input__icon {
                font-size: 16px;
                color: #333754;
            }
        }
    }
</style>