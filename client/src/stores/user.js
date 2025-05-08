import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', {
  state: () => ({
    id: '',
    empName: '',
    dep: '',
    isLogin: false
  })
  ,
  actions: {
    setUser(data) {
      this.id = data.id;
      this.empName = data.empName;
      this.dep = data.dep;
      this.isLogin = true;
    },
    logout() {
      this.id = '';
      this.empName = '';
      this.dep = '';
      this.isLogin = false;
    }
  }
});
