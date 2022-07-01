import {
  VuexModule,
  Module,
  Mutation,
  Action,
  getModule
} from "vuex-module-decorators";
import { RouteConfig } from "vue-router";
import { asyncRoutes, constantRoutes } from "@/router";
import store from "@/store";

export interface Irole {
  id?: number;
  role: number;
  roleName: string;
  roleResources: Iresouce[];
  userId: number;
  userName: string;
}

export interface Iresouce {
  id?: number;
  role: number;
  roleName: string;
  webId: string;
  webName?: string | null;
  webUrl: string;
}

const hasPermission = (roles: string[], route: RouteConfig) => {
  if (route.meta && route.meta.roles) {
    return roles.some(role => route.meta.roles.includes(role));
  } else {
    return false;
  }
};

export const filterAsyncRoutes = (routes: RouteConfig[], roles: string[]) => {
  const res: RouteConfig[] = [];
  routes.forEach(route => {
    const r = { ...route };
    if (hasPermission(roles, r)) {
      if (r.children) {
        r.children = filterAsyncRoutes(r.children, roles);
      }
      res.push(r);
    }
  });
  return res;
};

export const filterRoles = (roles: Irole[]): string[] => {
  const res: string[] = [];
  roles.forEach(role => {
    res.push(role.roleName);
    role.roleResources.forEach(resouce => {
      //由于大屏端，pc端，h5用的同一个登录接口，所有每个角色都有自己的各个端的权限，所有需要过滤出来
      if (
        resouce.webUrl.includes("GET/permit") ||
        resouce.webUrl.includes("GET/pc")
      ) {
        res.push(resouce.webUrl);
      }
    });
  });
  return res;
};

export interface IPermissionState {
  routes: RouteConfig[];
  dynamicRoutes: RouteConfig[];
}

@Module({ dynamic: true, store, name: "permission" })
class Permission extends VuexModule implements IPermissionState {
  public routes: RouteConfig[] = [];
  public dynamicRoutes: RouteConfig[] = [];

  @Mutation
  private SET_ROUTES(routes: RouteConfig[]) {
    this.routes = constantRoutes.concat(routes);
    routes.push({ path: "*", redirect: "/404", hidden: true });
    this.dynamicRoutes = routes;
  }

  @Action
  public GenerateRoutes(roles: Irole[]) {
    let accessedRoutes;
    let webUrlRoles: string[] = filterRoles(roles);
    if (webUrlRoles.includes("admin")) {
      accessedRoutes = asyncRoutes;
    } else {
      accessedRoutes = filterAsyncRoutes(asyncRoutes, webUrlRoles);
    }
    this.SET_ROUTES(accessedRoutes);
  }
}

export const PermissionModule = getModule(Permission);
