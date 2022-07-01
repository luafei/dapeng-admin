<template>
<div class="dashboard-container">
    <!--<component :is="currentRole" />-->
    <div class="tabBox">
        <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="角色管理" name="first">
                <Role></Role>
            </el-tab-pane>
            <el-tab-pane label="用户管理" name="second">
                <User></User>
            </el-tab-pane>
        </el-tabs>
    </div>
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

import Role from './components/role.vue'
import User from './components/user.vue'
// import { findComponentDownward } from '@/utils/index.ts'

@Component({
    name: 'userRole',
    components: {
        Role,
        User
    }
})
export default class extends Vue {
    private activeName = 'first'

    handleClick(component:any){
        component.$children[0].getList()
        component.$children[0].getRoleList && component.$children[0].getRoleList()
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

        .level-select {
            width: auto !important;
            box-sizing: border-box;
        }
    }
}
</style><style>
.wrapper-box_view {
    display: flex;
}

.box_view_ulBox {
    width: 50%;
    height: 319px;
    border: 1px solid #eaecf1;
    overflow-y: scroll;
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
    background-color: #fff;
}

/*定义滑块 内阴影+圆角*/
::-webkit-scrollbar-thumb {
    border-radius: 10px;
    box-shadow: inset 0 0 0px rgba(95, 37, 37, 0.5);
    background-color: rgba(240, 240, 240, .5);
}

.roleImg {
    width: 13px;
    height: 13px;
    margin-right: 6px;
}
</style>
