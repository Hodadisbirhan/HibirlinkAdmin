<template>
  <div class="text-right">
    <Menu as="div" class="relative inline-block text-left text-[#9a9a9a]">
      <div class="bg-white shadow-md px-4 rounded-md py-1 text-sm">
        <MenuButton class="inline-flex justify-center">
          <div
            class="group flex gap-2 items-center min-w-fit hover:cursor-pointer"
          >
            <Squares2X2Icon
              class="transition-colors ease-in-out duration-300 fill-[#9a9a9a] w-3 h-3"
            ></Squares2X2Icon>
            <h1 class="transition-colors ease-in-out duration-300">
              Categories
            </h1>
            <ChevronDownIcon
              class="group-hover:fill-primary fill-[#9a9a9a] w-4 h-4"
            ></ChevronDownIcon>
          </div>
        </MenuButton>
      </div>

      <transition
        enter-active-class="transition duration-100 ease-out"
        enter-from-class="transform scale-95 opacity-0"
        enter-to-class="transform scale-100 opacity-100"
        leave-active-class="transition duration-75 ease-in"
        leave-from-class="transform scale-100 opacity-100"
        leave-to-class="transform scale-95 opacity-0"
      >
        <MenuItems
          v-if="category.length"
          class="absolute z-10 min-h-[150px] bg-white rounded-md overflow-hidden divide-gray/10 divide-x-2 flex min-w-max left-0 top-8 origin-top-right shadow-xl focus:outline-none"
        >
          <div
            class="shadow-md py-1 w-[200px] max-h-[300px] overflow-y-scroll bg-white px-2"
          >
            <MenuItem
              v-for="(menu, index) in category"
              :key="index"
              class="w-full"
              @mouseover="handleHover(menu.category.id, index)"
              @click="emit('selectedCategory', menu.category.id)"
            >
              <p
                class="transition-all w-full capitalize cursor-pointer ease-in-out duration-300 font-semibold line-clamp-1"
                :class="[
                  subCategoryIndex == index
                    ? ' bg-primary text-light400 '
                    : 'text-neutral100 ',
                  'group flex w-full items-center rounded-md px-2 py-1 text-sm',
                ]"
              >
                {{ menu.category.name }}
              </p>
            </MenuItem>
          </div>
          <div
            v-if="
              subCategoryIndex != -1 && haveNestedCategory && showSubCategory
            "
            class="py-1 max-h-[300px] w-[200px] overflow-y-scroll bg-white px-2"
          >
            <MenuItem
              v-for="(menu, index) in category[subCategoryIndex].subCategory"
              :key="index"
              v-slot="{ active, close }"
              class="w-full"
              @click="emit('selectedSubCategory', menu.id)"
            >
              <p
                @click="close"
                class="transition-all capitalize cursor-pointer ease-in-out duration-300 font-semibold line-clamp-1"
                :class="[
                  active ? ' bg-primary text-light400 ' : 'text-neutral200 ',
                  'group flex w-full items-center rounded-md px-2 py-1 text-sm',
                ]"
              >
                {{ menu.name }}
              </p>
            </MenuItem>
          </div>
        </MenuItems>
      </transition>
    </Menu>
  </div>
</template>

<script lang="ts" setup>
import { Menu, MenuButton, MenuItems, MenuItem } from "@headlessui/vue";
import { ChevronDownIcon, Squares2X2Icon } from "@heroicons/vue/20/solid";
const subCategoryIndex = ref(0);
const selectedCategory = ref(0);
const showSubCategory = ref(false);
const emit = defineEmits(["selectedCategory", "selectedSubCategory"]);
const handleHover = (catId: number, currentIndex: number) => {
  showSubCategory.value = true;
  subCategoryIndex.value = currentIndex;
  selectedCategory.value = catId;
  console.log(currentIndex);
};

interface subCategory {
  id: number;
  name: string;
}
interface mainCategory {
  id: number;
  name: string;
}

interface category {
  category: mainCategory;
  subCategory: subCategory[];
}
interface categoryArray {
  category: category[];
  haveNestedCategory?: boolean;
}
const props = defineProps<categoryArray>();
watchEffect(() => {
  console.log(props);
});
const route = useRoute();
</script>
