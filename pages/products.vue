<template>
  <div class="relative">
    <div class="sticky top-0 bg-light400 z-40">
      <div class="flex gap-6 pt-4 text-sm">
        <NuxtLink
          to="/products"
          :class="
            activeLink ? '' : 'text-primary border-b-[1px] border-primary '
          "
          class="py-2"
        >
          RealTime Product
        </NuxtLink>
        <NuxtLink
          to="/products/virtual_product"
          :class="
            activeLink ? 'text-primary border-b-[1px] border-primary' : ''
          "
          class="py-2"
        >
          Virtual Product
        </NuxtLink>
      </div>
    </div>
    <NuxtPage />
  </div>
</template>

<script setup>
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
