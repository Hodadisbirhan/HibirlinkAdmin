import { defineStore } from "pinia";

export const useAuth = defineStore({
  id: "_hibirlink",
  state: () => {
    return {
      toSignInPageFrom: "",
      token: "",
      uid: "",
      name: "",
      role: "",
      email: "",
    };
  },
  actions: {
    setToSignInPageFrom(from: string) {
      this.toSignInPageFrom = from;
    },

    setToken(token: string) {
      this.token = token;
    },

    setUID(uid: string) {
      this.uid = uid;
    },

    setName(name: string) {
      this.name = name;
    },
    setRole(role: string) {
      this.role = role;
    },

    setEmail(email: string) {
      this.email = email;
    },
  },
  persist: {
    paths: ["token", "uid", "name", "role", "email"],
  },
});
