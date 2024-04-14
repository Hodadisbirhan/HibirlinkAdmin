<template>
  <div class="relative">
    <div class="sticky top-0 bg-green1000 z-40">
      <div class="flex gap-6 pt-4 text-sm font-bold text-dark300/60">
        <NuxtLink
          :class="
            route.path.endsWith('/category')
              ? 'text-primary border-b-[1px] border-primary'
              : ''
          "
          to="/category"
          class="py-2"
        >
          RealTime Product
        </NuxtLink>
        <NuxtLink
          :class="
            route.path.endsWith('/virtual_product')
              ? 'text-primary border-b-[1px] border-primary'
              : ''
          "
          to="/category/virtual_product"
          class="py-2"
        >
          Virtual Product
        </NuxtLink>
        <NuxtLink
          :class="
            route.path.endsWith('/realtime_service')
              ? 'text-primary border-b-[1px] border-primary'
              : ''
          "
          to="/category/realtime_service"
          class="py-2"
        >
          RealTime Service
        </NuxtLink>
        <NuxtLink
          :class="
            route.path.endsWith('/virtual_service')
              ? 'text-primary border-b-[1px] border-primary'
              : ''
          "
          to="/category/virtual_service"
          class="py-2"
        >
          Virtual Service
        </NuxtLink>
      </div>
    </div>
    <NuxtPage />
  </div>
</template>
<style scoped></style>
<script setup>
import {
  EllipsisHorizontalIcon,
  MagnifyingGlassIcon,
  XMarkIcon,
} from "@heroicons/vue/24/solid";
const route = useRoute();
const activeLink = ref("");
// watch(route, (newValue) => {
//   if (newValue.path.endsWith("/category")) {
//     activeLink.value = newValue.path;
//   } else {
//     activeLink.value = "";
//   }
// });
definePageMeta({
  layout: "custom",
});
</script>
