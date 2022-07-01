import {
  VuexModule,
  Module,
  Action,
  Mutation,
  getModule
} from "vuex-module-decorators";
import { login, logout, getUserInfo, getPicCode, getDSVSCert, getStep910, queryUserBySfId } from "@/api/users";
import { getToken, setToken, removeToken } from "@/utils/cookies";
import router, { resetRouter } from "@/router";
import { PermissionModule } from "./permission";
import { TagsViewModule } from "./tags-view";
import store from "@/store";
import AES from "@/utils/AES.ts";

export interface IUserState {
  token: string
  name: string
  avatar: string
  introduction: string
  roles: string[]
  email: string
  kId: string | null,
  certID: string
}

@Module({ dynamic: true, store, name: "user" })
class User extends VuexModule implements IUserState {
  public token = getToken() || "";
  public name = "";
  public avatar = "";
  public introduction = "";
  public roles: string[] = localStorage.getItem('roles') ? JSON.parse(localStorage.getItem('roles')!): [];;
  public email = "";
  public phone = "";
  public keyName = "";
  public kId = localStorage.getItem("kId");
  public certID = "";  // 

  @Mutation
  private SET_CERTID(certID: string) {
    this.certID = certID
  }

  @Mutation
  private SET_TOKEN(token: string) {
    this.token = token;
  }

  @Mutation
  private SET_NAME(name: string) {
    this.name = name;
  }

  @Mutation
  private SET_AVATAR(avatar: string) {
    this.avatar = avatar;
  }

  @Mutation
  private SET_INTRODUCTION(introduction: string) {
    this.introduction = introduction;
  }

  @Mutation
  private SET_PHONE(phone: string) {
    this.phone = phone;
  }

  @Mutation
  private SET_KEY_NAME(keyName: string) {
    this.keyName = keyName;
  }

  @Mutation
  private SET_ROLES(roles: string[]) {
    this.roles = roles;
    localStorage.setItem('roles', JSON.stringify(roles))
  }

  @Mutation
  private SET_KID(kId: string) {
    this.kId = kId;
    localStorage.setItem("kId", kId);
  }

  @Mutation
  private SET_EMAIL(email: string) {
    this.email = email;
  }

  @Action
  public async Login(userInfo: {
    username: string
    password: string
    code: string
  }) {
    let { username, password, code, flag } = userInfo;
    username = username.trim();
    password = AES.encrypt(password);
    const { data } = await login({
      petName: username,
      keyName: password,
      code,
      flag
    });
    this.SET_KID(data.id);
    setToken(data.tokenId);
    this.SET_TOKEN(data.tokenId);
    const {
      userRoles,
      userName,
      avatar,
      introduction,
      email,
      mobileNum,
      keyName
    } = data;
    this.SET_ROLES(userRoles);
    this.SET_NAME(userName);
    this.SET_AVATAR(avatar);
    this.SET_INTRODUCTION(introduction);
    this.SET_PHONE(mobileNum);
    this.SET_KEY_NAME(keyName);
    this.SET_EMAIL(email);
    // Generate dynamic accessible routes based on roles
    PermissionModule.GenerateRoutes(userRoles);
    // Add generated routes
    router.addRoutes(PermissionModule.dynamicRoutes);
  }

  @Action
  public ResetToken() {
    removeToken();
    this.SET_TOKEN("");
    this.SET_ROLES([]);
  }

  @Action
  public async GetUserInfo() {
    if (this.token === "") {
      throw Error("GetUserInfo: token is undefined!");
    }
    const { data } = await getUserInfo(this.kId);
    if (!data) {
      throw Error("Verification failed, please Login again.");
    }
    const {
      userRoles,
      userName,
      avatar,
      introduction,
      email,
      mobileNum,
      keyName
    } = data;
    // roles must be a non-empty array
    if (!userRoles || userRoles.length <= 0) {
      throw Error("GetUserInfo: roles must be a non-null array!");
    }
    this.SET_ROLES(userRoles);
    this.SET_NAME(userName);
    this.SET_AVATAR(avatar);
    this.SET_INTRODUCTION(introduction);
    this.SET_PHONE(mobileNum);
    this.SET_KEY_NAME(keyName);
    this.SET_EMAIL(email);
  }

  @Action
  public async ChangeRoles(role: string) {
    // Dynamically modify permissions
    const token = role + "-token";
    this.SET_TOKEN(token);
    setToken(token);
    await this.GetUserInfo();
    resetRouter();
    // Generate dynamic accessible routes based on roles
    PermissionModule.GenerateRoutes(this.roles);
    // Add generated routes
    router.addRoutes(PermissionModule.dynamicRoutes);
    // Reset visited views and cached views
    TagsViewModule.delAllViews();
  }

  @Action
  public async LogOut() {
    if (this.token === "") {
      throw Error("LogOut: token is undefined!");
    }
    this.certID && this.SET_CERTID("");
    localStorage.getItem('certID') && localStorage.removeItem('certID')
    // await logout()
    removeToken();
    resetRouter();

    // Reset visited views and cached views
    TagsViewModule.delAllViews();
    this.SET_TOKEN("");
    this.SET_ROLES([]);
    localStorage.removeItem('roles');
  }

  // 獲取圖形碼s
  @Action
  public async GetPicCode(params: any) {
    return new Promise(async resolve => {
      const res = await getPicCode(params);
      resolve(res);
    });
  }

  // 服务器随机数
  @Action
  public async getStep3() {
    return new Promise(async resolve => {
      const { data } = await getDSVSCert()
      resolve(data)
    })
  }

  //
  @Action
  public async getStep910(params: any) {
    return new Promise(async resolve => {
      const { data }= await getStep910(params)
      resolve(data)
    })
  }

  //
  @Action
  public async queryUserBySfId(params: any) {
    return new Promise(async (resolve, reject) => {
      try {
        const { data } = await queryUserBySfId(params)
        const token = data.tokenId
        this.SET_KID(data.id);
        this.SET_TOKEN(token);
        setToken(token)
        resolve(data)
      } catch (error) {
        reject(error)
      }
    })
  }
  @Action
  public setCertId(params:string) {
    this.SET_CERTID(params);
    localStorage.setItem('certID', params);

  }
}

export const UserModule = getModule(User);
