<template>
  <div
    class="fixed z-40 top-0 right-0 h-full w-full bg-black/10 shadow-md"
    @click.self="emit('closeModal')"
  >
    <div
      class="fixed top-0 flex items-center justify-center left-0 w-full h-full bg-black/10 z-40"
    >
      <form
        @submit.prevent="submit"
        class="p-5 bg-white rounded-lg min-w-[400px]"
      >
        <h1 class="text-xl text-gray font-bold mb-5">
          {{ initialData ? "Edit Form" : "Add Form" }}
        </h1>
        <div
          class="flex gap-4 items-center"
          v-for="(lng, index) in language"
          :key="lng"
        >
          <div class="flex gap-4 items-center w-full">
            <v-text-field
              v-if="index == 0"
              :name="lng.name + 'Name'"
              v-model="cityValueAm"
              :label="isCitySelected ? 'City' : 'SubCity'"
              :placeholder="lng.name + ' name'"
              rules="required"
            />
            <v-text-field
              v-if="index == 1"
              :name="lng.name + 'Name'"
              v-model="cityValueEn"
              :placeholder="lng.name + ' name'"
              rules="required"
            />
          </div>
        </div>
        <div v-if="!isCitySelected">
          <v-text-field
            name="Latitude"
            label="Latitude"
            v-model="latitude"
            placeholder="latitude"
            type="number"
            rules="required"
          />
          <v-text-field
            name="Longitude"
            label="Longitude"
            v-model="longitude"
            placeholder="latitude"
            type="number"
            rules="required"
          />
        </div>

        <div class="flex gap-4 my-2">
          <button
            class="uppercase block ml-auto hover:shadow-md shadow-primary text-sm outline-none px-4 py-2 bg-primary text-white font-semibold rounded-sm hover:bg-primary ring-4 hover:ring-primary hover:ring-opacity-50 ring-opacity-30 ring-transparent transition-all ease-in-out duration-300"
          >
            {{ initialData ? "Update" : "Add City" }}
          </button>
          <button
            class="uppercase block hover:shadow-md shadow-red text-sm outline-none px-4 py-2 bg-red text-white font-semibold rounded-sm hover:bg-red ring-4 hover:ring-red hover:ring-opacity-50 ring-opacity-30 ring-transparent transition-all ease-in-out duration-300"
            @click="emit('closeModal')"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
<script setup>
import { useForm } from "vee-validate";
import { PhotoIcon } from "@heroicons/vue/24/solid";
const { setValues, setErrors, handleSubmit, resetForm } = useForm();
const cityValueEn = ref();
const cityValueAm = ref();
const longitude = ref();
const latitude = ref();
const emit = defineEmits(["closeModal", "addCity", "updateCity"]);
const props = defineProps({
  initialData: { required: false, type: Object, default: null },
  language: { type: Object, required: true },
  isCitySelected: { type: Boolean, required: true, default: false },
});
if (props.initialData?.en) {
  if (props.isCitySelected)
    setValues({ amName: props.initialData.am, enName: props.initialData.en });
  else
    setValues({
      amName: props.initialData.am,
      enName: props.initialData.en,
      Latitude: props.initialData.lat,
      Longitude: props.initialData.long,
    });
}
const submit = handleSubmit(
  (value) => {
    if (props.initialData)
      emit("updateCity", {
        city: [
          { language_type: "am", name: value.amName },
          { language_type: "en", name: value.enName },
        ],
        latitude: value.Latitude,
        longitude: value.Longitude,
      });
    else
      emit("addCity", {
        city: [
          { language_type: "am", name: value.amName },
          { language_type: "en", name: value.enName },
        ],
        latitude: value.Latitude,
        longitude: value.Longitude,
      });
  },
  (error) => {}
);
</script>
