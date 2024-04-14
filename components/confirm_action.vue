<template>
  <div
    class="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black/10 z-50"
  >
    <div class="bg-white rounded-lg p-5 flex-col">
      <div class="flex">
        <ExclamationTriangleIcon class="fill-yellow-300 w-6 h-6 mr-4" />
        <div>
          <h1 class="text-green400 font-semibold text-xl mb-4">
            Please confirm your choice
          </h1>
          <p class="text-start pb-2 text-gray">
            Are you sure with your action ?
          </p>
        </div>
      </div>

      <div v-if="reason">
        <v-text-area
          name="Reason"
          class="min-w-[400px]"
          placeholder="Please enter ur reason"
          v-model:model-value="reason_area"
          rules="required"
        />
      </div>

      <div class="flex gap-4 items-end justify-end">
        <div class="flex gap-4 py-2">
          <button
            class="outline:none px-2 py-1 text-sm text-green400 border-b border-transparent hover:border-b-green400"
            @click="
              reason
                ? reason_area
                  ? emit('confirmation', { accept: true, reason: reason_area })
                  : null
                : emit('confirmation', { accept: true, reason: reason_area })
            "
          >
            Yes
          </button>
          <button
            class="outline:none px-2 py-1 text-sm text-red border-b border-transparent hover:border-b-red"
            @click="emit('confirmation', false)"
          >
            No
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ExclamationTriangleIcon } from "@heroicons/vue/20/solid";
const reason_area = ref();
const props = defineProps({
  reason: {
    type: Boolean,
    required: false,
  },
});
const emit = defineEmits(["confirmation"]);
</script>
