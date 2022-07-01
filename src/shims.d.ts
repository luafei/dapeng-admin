declare module '*.vue' {
  import Vue from 'vue'
  export default Vue
}

declare module 'element-ui/lib/locale/lang/*' {
  export const elementLocale: any
}

declare module '*.gif' {
  export const gif: any
}

// TODO: remove this part after vue-count-to has its typescript file
declare module 'vue-count-to'

// TODO: remove this part after vuedraggable has its typescript file
declare module 'vuedraggable'

// TODO: remove this part after vue2-dropzone has its typescript file
declare module 'vue2-dropzone'

// TODO: remove this part after vue-image-crop-upload has its typescript file
declare module 'vue-image-crop-upload'

declare module 'crypto-js'

declare module '@smallwei/avue'

declare module '@/api/users.ts'

declare module '@/api/roles.ts'

declare module '@/api/types'

declare module '@/api/permissions'

declare module '@/api/setRule.ts'

declare module '@/api/tableCode.ts'

declare module '@/utils/index.ts'

declare module '@/utils/validate'

declare module '@/utils/async-validate'

declare module '@/const/dicData.ts'

declare module '@/store/modules/user'

declare module '@/store/modules/permission'

declare module '@/components/Search'

declare module '@/components/TipsDialog'

declare module '@/components/CodeIdentify'

interface page {
  total: number
  currentPage: number
  pageSize: number
  pageSizes?: Array<number>
  pagerCount?: number
  layout?: string
  background?: boolean
}

