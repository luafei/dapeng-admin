<template>
  <div>
    <el-dialog
      :title="title"
      :visible.sync="syncedShow"
      append-to-body
      class="tips-dialog"
      width="50%"
      @closed="closed"
    >
      <slot />
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="syncedShow = false">取 消</el-button>
        <el-button
          type="primary"
          @click="handleSubmit"
        >确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script lang="ts">

import { Component, Vue, Prop, PropSync, Emit } from 'vue-property-decorator'

@Component({
  name: 'TipsDialog'
})

export default class extends Vue {
    @PropSync('show', { type: Boolean }) syncedShow!: Boolean
    @Prop({ default: '提示' }) readonly title: string

    @Emit()
    private handleSubmit() {
      console.log('ooooooo')
    }

    @Emit()
    private closed() {
      console.log('ooooooo')
    }
}
</script>
<style lang="scss">
    .tips-dialog{
        .el-dialog__header{
            display: flex;
            height: 50px;
            align-items: center;
            padding: 0 30px;
            background: #f7f8fa;
            border-radius: 6px 6px 1px 1px;
            .el-dialog__title{
                font-size: 16px;
            }
            .el-dialog__headerbtn{
                top: 18px;
            }
        }
        .el-dialog__footer{
            padding: 15px 0;
            text-align: right;
            border: 1px solid #eaecf1;
            .el-button{
                width: 80px;
                height: 30px;
                line-height: 30px;
                padding:0;
                border-radius: 2px;
                margin: 0 10px;
            }
        }
    }
</style>
