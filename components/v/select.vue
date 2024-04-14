<template>
  <div>
    <div
      class="text-right w-full group bg-white border shadow-sm rounded-lg bg-transparent">
      <Menu
        as="div"
        class="relative w-full inline-block text-left">
        <div class="bg-white rounded-md">
          <MenuButton
            v-slot="{ open }"
            class="justify-center py-1 w-full px-4">
            <div
              class="w-full justify-between group flex gap-2 items-center hover:cursor-pointer">
              <h1
                class="transition-colors text-sm text-[#9a9a9a] ease-in-out duration-300 font-semibold truncate">
                {{
                  selectValue
                    ? isStringData
                      ? selectValue
                      : selectValue.name
                    : label
                }}
              </h1>
              <ChevronDownIcon
                class="group-hover:fill-green400 fill-[#9a9a9a] w-4 h-4"
                :class="{ 'rotate-180': open }"></ChevronDownIcon>
            </div>
          </MenuButton>
        </div>

        <transition
          enter-active-class="transition duration-100 ease-out"
          enter-from-class="transform scale-95 opacity-0"
          enter-to-class="transform scale-100 opacity-100"
          leave-active-class="transition duration-75 ease-in"
          leave-from-class="transform scale-100 opacity-100"
          leave-to-class="transform scale-95 opacity-0">
          <MenuItems
            class="absolute z-10 min-w-max w-full left-0 max-h-[10rem] overflow-y-auto top-7 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-xl ring-1 ring-black ring-opacity-5 focus:outline-none">
            <div class="px-1 py-1">
              <MenuItem
                v-for="item in props.items"
                :key="item"
                v-slot="{ active, close }">
                <h1
                  @click="handleClick(item, close)"
                  class="transition-all text-sm ease-in-out duration-300 text-gray font-semibold"
                  :class="[
                    active
                      ? ' bg-primary text-light400 cursor-pointer'
                      : 'text-neutral100 ',
                    'group flex w-full items-center rounded-md px-2 py-1 text-sm',
                  ]">
                  {{ isStringData ? item : item.name }}
                </h1>
              </MenuItem>
            </div>
          </MenuItems>
        </transition>
      </Menu>
    </div>
  </div>
</template>

<script setup>
import { Menu, MenuButton, MenuItems, MenuItem } from "@headlessui/vue";
import { ChevronDownIcon, Squares2X2Icon } from "@heroicons/vue/20/solid";
import { useField } from "vee-validate";
import { isString } from "vue-composable";

const props = defineProps({
  items: Array,
  name: String,
  label: String,
  modalValue: { type: Object, required: false },
});

const isStringData = isString(props.items[0]);
const { value: selectValue, errorMessage } = useField(props.name);
const emit = defineEmits(["update:modelValue"]);
const handleClick = (item, close) => {
  selectValue.value = item;
  emit("update:modelValue", item);
  close();
};
</script>
