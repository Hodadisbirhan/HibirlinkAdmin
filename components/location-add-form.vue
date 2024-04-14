<template>
  <div
    class="fixed z-40 top-0 right-0 h-[100vh] overflow-y-auto w-full bg-black/10 shadow-md"
    @click.self="emit('closeModal')"
  >
    <div
      class="absolute top-0 right-0 h-full w-full md:w-2/3 lg:w-1/2 bg-white shadow-md"
    >
      <XCircleIcon
        class="w-10 h-10 absolute top-4 cursor-pointer right-4 fill-red"
        @click="emit('closeModal')"
      />
      <form
        @submit.prevent="submit"
        class="p-5 bg-white rounded-lg min-w-[400px] pt-16"
      >
        <h1 class="text-xl text-gray font-bold mb-5">Add Location</h1>
        <div
          class="flex gap-4 items-center justify-end"
          v-for="(lng, index) in language"
          :key="lng"
        >
          <v-text-field
            v-if="index == 0"
            :name="lng.name + 'Name'"
            v-model="cityValueAm"
            :label="index == 0 ? 'City' : ''"
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
        <hr class="border-2 my-4 border-neutral500" />

        <div
          class="flex gap-4 items-center justify-end"
          v-for="(lng, index) in language"
          :key="lng"
        >
          <v-text-field
            v-if="index == 0"
            :name="lng.name + 'SName'"
            label="subCity"
            v-model="subCityValueAm"
            :placeholder="lng.name + ' name'"
            :rules="
              subCities.length
                ? ''
                : 'required|subCategory:' + lng.name + 'Name'
            "
          />
          <v-text-field
            v-if="index == 1"
            :name="lng.name + 'SName'"
            v-model="subCityValueEn"
            :placeholder="lng.name + ' name'"
            :rules="
              subCities.length
                ? ''
                : 'required|subCategory:' + lng.name + 'Name'
            "
          />
        </div>
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
        <div
          class="flex gap-1 py-1 px-2 bg-primary w-fit text-light400 rounded-sm capitalize ml-auto mb-3 cursor-pointer"
          @click="addSubCity"
        >
          <PlusIcon class="fill-light400 w-6 h-6" />
          <span class="capitalize">Sub City</span>
        </div>
        <div class="flex gap-4 my-2">
          <button
            class="uppercase block ml-auto hover:shadow-md shadow-primary text-sm outline-none px-4 py-2 bg-primary text-white font-semibold rounded-sm hover:bg-primary ring-4 hover:ring-primary hover:ring-opacity-50 ring-opacity-30 ring-transparent transition-all ease-in-out duration-300"
          >
            Add City
          </button>

          <button
            class="uppercase block hover:shadow-md shadow-red text-sm outline-none px-4 py-2 bg-red text-white font-semibold rounded-sm hover:bg-red ring-4 hover:ring-red hover:ring-opacity-50 ring-opacity-30 ring-transparent transition-all ease-in-out duration-300"
            @click="emit('closeModal')"
          >
            Cancel
          </button>
        </div>
        <div class="w-fit flex flex-wrap gap-4">
          <div
            v-for="(subCity, index) in subCities"
            :key="index"
            class="py-3 text-md my-2 bg-primary/10 rounded-md shadow-sm px-4 pr-8 flex gap-4 relative"
          >
            <XCircleIcon
              class="w-5 h-5 absolute top-1 cursor-pointer right-1 fill-red"
              @click="deleteImage(index)"
            />
            <div class="flex h-full flex-col justify-between">
              <p>En : {{ subCity.language[0].name }}</p>
              <p>Am: {{ subCity.language[1].name }}</p>
              <p>Latitude: {{ subCity.latitude }}</p>
              <p>Longitude: {{ subCity.longitude }}</p>
            </div>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>
<script setup>
import { useForm } from "vee-validate";
import { PhotoIcon, PlusIcon, XCircleIcon } from "@heroicons/vue/24/solid";
const { setErrors, handleSubmit } = useForm();
const props = defineProps({
  language: { type: Object, required: true },
});
const subCityValueEn = ref();
const subCityValueAm = ref();
const cityValueEn = ref();
const cityValueAm = ref();
const latitude = ref();
const longitude = ref();

const subCities = ref([]);
const emit = defineEmits(["closeModal", "addCity", "updateCity"]);

const addSubCity = () => {
  if (cityValueAm.value && cityValueEn.value)
    if (
      subCityValueAm.value &&
      subCityValueEn.value &&
      latitude.value &&
      longitude.value
    ) {
      subCities.value.push({
        latitude: latitude.value,
        longitude: longitude.value,
        language: [
          { language_type: "en", name: subCityValueEn.value },
          { language_type: "am", name: subCityValueAm.value },
        ],
      });
      subCityValueAm.value = null;
      subCityValueEn.value = null;
      latitude.value = null;
      longitude.value = null;
    } else {
      if (!subCityValueAm.value || !subCityValueEn.value) {
        setErrors({ amSName: "subCity Required" });
      }

      if (!latitude.value) setErrors({ Latitude: "Latitude Required" });
      if (!longitude.value) setErrors({ Longitude: "Longitude Required" });
    }
  else {
    if (!cityValueAm.value || !cityValueEn.value)
      setErrors({ amName: "City Required" });
  }
};
const submit = handleSubmit(
  (value) => {
    subCities.value.push({
      latitude: latitude.value,
      longitude: longitude.value,
      language: [
        { language_type: "en", name: subCityValueEn.value },
        { language_type: "am", name: subCityValueAm.value },
      ],
    });

    emit("addCity", {
      city: {
        language: [
          { language_type: "en", name: cityValueEn.value },
          { language_type: "am", name: cityValueAm.value },
        ],
        subCities: subCities.value,
      },
    });
  },
  (error) => {
    console.log(error);
  }
);
</script>
