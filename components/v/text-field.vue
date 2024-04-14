<script setup lang="ts">
import { useField } from "vee-validate";
import { XCircleIcon, EyeIcon, EyeSlashIcon } from "@heroicons/vue/24/solid";

interface Props {
  modelValue?: string | number;
  name: string;
  id?: string;
  type?: string;
  placeholder?: string;
  label?: string;
  labelClass?: string;
  hideDetail?: boolean;
  trailingIcon?: Function;
  autocomplete?: string;
  leadingIcon?: Function;
  leadingText?: string;
  min?: string;
  max?: string;
  rules?: string;
  disabled?: boolean;
  class?: string;
  iconLeadingClass?: string;
  leadingTextClass?: string;
  placeholderStyle?: string;
  clearable?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: "",
  type: "text",
  hideDetail: false,
  rules: "",
  disabled: false,
});

const emit = defineEmits(["update:modelValue", "trailingAction"]);

const {
  errorMessage,
  value: inputValue,
  meta,
} = useField(props.name, props.rules);

const type = ref(props.type);
const trailingIcon = ref(props.trailingIcon);

const set = (event: any) => {
  emit("update:modelValue", event?.target?.value);
};

const togglePassword = () => {
  if (type.value === "password") {
    type.value = "text";
    trailingIcon.value = EyeIcon;
    return;
  }
  if (type.value === "text") {
    type.value = "password";
    trailingIcon.value = EyeSlashIcon;
    return;
  }
};

watch(
  () => props.modelValue,
  (newVal) => {
    if (newVal) inputValue.value = newVal;
  },
  {
    immediate: true,
  }
);

const clear = () => {
  inputValue.value = "";
  emit("update:modelValue", undefined);
};
const onTrailingAction = () => {
  emit("trailingAction");
};
</script>

<template>
  <div class="w-full">
    <slot name="label"
      ><h4
        :class="props.labelClass"
        class="text-gray font-bold">
        {{ label }}
      </h4></slot
    >
    <div
      class="relative group flex items-center justify-center transition-all ease-in-out duration-300"
      :class="props.class">
      <div
        v-if="props.leadingIcon || props.leadingText"
        class="h-full w-[4rem] absolute top-0 left-0 bottom-0 flex items-center justify-evenly pointer-events-none bg-transparent">
        <component
          class="h-5 w-5 text-green100 hover:cursor-pointer"
          :class="[
            errorMessage ? 'text-red' : 'text-green200',
            props.iconLeadingClass,
          ]"
          :is="props.leadingIcon"></component>
        <p
          v-if="props.leadingText && !props.leadingIcon"
          class="font-medium"
          :class="[
            errorMessage ? 'text-red' : 'text-green200',
            props.leadingTextClass,
          ]">
          {{ leadingText }}
        </p>
        <div
          class="w-[1px] h-[60%] bg-gray-light self-end my-auto group-hover:bg-green400 transition-all ease-in-out duration-300"></div>
      </div>

      <input
        v-model="inputValue"
        @input="set($event)"
        @change="set($event)"
        :autocomplete="props.autocomplete"
        :min="min"
        :max="max"
        :type="type"
        :name="props.name"
        step="any"
        :id="id"
        :class="[
          errorMessage
            ? 'focus:border-red-500 hover:border-red border-red'
            : 'focus:border-green400 hover:border-green400 border-gray-light',
          props.iconLeadingClass ? props.iconLeadingClass : '',
          props.trailingIcon ? 'pr-0' : '',
          props.class ? props.class : '',
          props.placeholderStyle
            ? props.placeholderStyle
            : ' placeholder-[#9a9a9a] font-medium',
          props.leadingIcon || props.leadingText ? 'pl-16' : '',
          props.trailingIcon ? 'pr-9' : '',
        ]"
        class="block w-full h-full text-gray border-gray-light hover:border-green400 rounded-lg bg-transparent text-secondary px-4 focus:outline-none ring-0 focus:ring-0 hover:outline-none outline-none transition-all ease-in-out duration-300"
        :placeholder="props.placeholder"
        aria-invalid="true"
        aria-describedby="email-error"
        :disabled="props.disabled" />
      <!-- icon -->
      <div
        v-if="clearable"
        @click="clear"
        class="absolute inset-y-0 right-0 pr-2 flex items-center">
        <XCircleIcon
          class="h-5 w-5 text-gray-light hover:text-red cursor-pointer transition-all ease-in-out duration-300" />
      </div>
      <div
        v-if="props.trailingIcon"
        class="absolute inset-y-0 right-0 pr-2 flex items-center hover:cursor-pointer"
        @click="
          props.type == 'password' ? togglePassword() : onTrailingAction()
        ">
        <component
          class="h-6 w-6 hover:text-green400 transition-all ease-in-out duration-300"
          :class="[type === 'password' ? 'text-gray-light' : 'text-gray-light']"
          :is="trailingIcon"></component>
      </div>
    </div>
    <p
      v-if="!props.hideDetail"
      :visible="errorMessage"
      class="px-1 text-sm text-red font-body"
      id="email-error">
      {{ errorMessage || "" }} &nbsp;
    </p>
  </div>
</template>
