import { useAuth } from "@/store/auth";
import { storeToRefs } from "pinia";
export default defineNuxtRouteMiddleware((to, from) => {
  const { role } = storeToRefs(useAuth());

  if (role.value !== "super_admin") {
    window.location.href = "http://localhost:3000";
  } else {
    return true;
  }
});
