export interface IArticleData {
  id: number
  status: string
  title: string
  abstractContent: string
  fullContent: string
  sourceURL: string
  imageURL: string
  timestamp: string | number
  platforms: string[]
  disableComment: boolean
  importance: number
  author: string
  reviewer: string
  type: string
  pageviews: number
}

export interface IRoleData {
  // key: string
  // name: string
  // description: string
  // routes: any
  role:number
  roleName:string
  webId: string
  webUrl: string
  createTime?: string
}

export interface ITransactionData {
  orderId: string
  timestamp: string | number
  username: string
  price: number
  status: string
}

export interface IUserData {
  id: number
  username: string
  password: string
  name: string
  email: string
  phone: string
  avatar: string
  introduction: string
  roles: string[]
}

export interface ITimerData {
  id: number
  name: string
  desc: string
}

export interface ITimerItemData {
  id: number
  type:string
  name: string
  desc: string
}
