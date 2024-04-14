<template>
  <div class="w-full items-center justify-center text-sm flex">
    <div
      class="flex items-center justify-center relative w-full lg:w-[90%] px-5 my-4"
    >
      <input
        type="text"
        v-model="searchString"
        @keyup="newString"
        class="peer outline-none py-2 text-sm focus:shadow-md placeholder-[#9a9a9a] border-transparent focus:border-transparent focus:ring-0 focus:border-blue-300 shadow-blue-400 border-none focus:border-none w-full px-10"
        placeholder="Search with product name. . ."
      />
      <MagnifyingGlassIcon
        class="peer-focus:fill-green400 fill-[#9a9a9a] w-5 h-5 absolute left-8"
      />
    </div>
  </div>
</template>
<script setup>
import { MagnifyingGlassIcon } from "@heroicons/vue/24/solid";

const searchString = ref("");
const emits = defineEmits(["searchString"]);
const newString = (value) => {
  emits("searchString", searchString.value);
};
</script>
