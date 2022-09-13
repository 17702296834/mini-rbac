import { ref, computed } from "vue";
import { defineStore } from "pinia";
import { message } from "ant-design-vue";
import { getMenus, getUserInfo, login } from "@/service/user";
import router from "@/router";

export const userStore = defineStore(
  "user",
  () => {
    const token = ref("");
    const userInfo = ref({});
    const userMenus = ref([]);

    const isLoading = ref(false);

    // getter
    const accessToken = computed(() => "Bearer " + token.value);

    // setup store 不提供$reset 需要自己重置
    // https://github.com/vuejs/pinia/issues/1056
    const $reset = () => {
      token.value = "";
      userInfo.value = {};
      userMenus.value = [];
    };

    // 非setup语法时的actions
    const loginAction = async (data) => {
      // 1. 登录
      const res = await login(data);
      token.value = res.data.token;

      // 2. 获取用户信息
      const info = await getUserInfo(res.data.id);
      userInfo.value = info.data;

      // 3. 获取权限信息
      const menus = await getMenus(info.data.roles[0].id);
      userMenus.value = menus.data;

      // 4. 跳转
      router.push("/main");

      // 弹框提示登录成功
      message.success("登录成功.");
    };

    return {
      token,
      accessToken,
      userInfo,
      userMenus,
      isLoading,
      $reset,
      loginAction,
    };
  },
  {
    persist: true, // 解决pinia刷新时数据丢失问题
  }
);

// export const userStore = defineStore('user',{
//     state: () => ({
//         token: ""
//     }),
//     getters: {
//         accessToken() {
//             return `Bearer ${this.token}`
//         }
//     },
//     actions: {
//       async loginAction(data){
//         const res = await login(data)
//         console.log(res)
//         this.token = res.data.token
//         // uid.value = res.data.id
//       }
//     },
//     persist: true
// })
