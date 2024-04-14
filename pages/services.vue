<template>
  <div class="relative">
    <div class="sticky top-0 bg-green1000 z-40">
      <div class="flex gap-6 pt-4 text-sm">
        <NuxtLink
          to="/services"
          :class="
            activeLink ? '' : 'text-primary border-b-[1px] border-primary'
          "
          class="py-2"
        >
          RealTime Service
        </NuxtLink>
        <NuxtLink
          to="/services/virtual_service"
          :class="
            activeLink ? 'text-primary border-b-[1px] border-primary' : ''
          "
          class="py-2"
        >
          Virtual Service
        </NuxtLink>
      </div>
    </div>
    <NuxtPage />
  </div>
</template>

<script setup>
import {
  EllipsisHorizontalIcon,
  MagnifyingGlassIcon,
  XMarkIcon,
} from "@heroicons/vue/24/solid";
const route = useRoute();
const activeLink = ref("");
watch(route, (newValue) => {
  if (newValue.path.includes("virtual")) {
    activeLink.value = newValue.path;
  } else {
    activeLink.value = "";
  }
});
definePageMeta({
  layout: "custom",
});
</script>
