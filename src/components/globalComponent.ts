import Vue from 'vue' // 引入vue

// 处理首字母大写 abc => Abc
function changeStr(str:string){
    return str.charAt(0).toUpperCase() + str.slice(1)
}

/*
    require.context(arg1,arg2,arg3)
        arg1 - 读取文件的路径
        arg2 - 是否遍历文件的子目录
        arg3 - 匹配文件的正则
*/

function importAllComponent(requireComponent:any){
    requireComponent.keys().forEach((fileName:string) => {
        const componentName = changeStr(
            fileName.replace(/^\.\//, '').replace(/\/\w+\.\w+$/, '')   // ./child1.vue => child1
        )
        const config = requireComponent(fileName)
        Vue.component(componentName, config.default || config) // 动态注册该目录下的所有.vue文件
    })
}

importAllComponent(require.context('.', true, /\.vue$/))