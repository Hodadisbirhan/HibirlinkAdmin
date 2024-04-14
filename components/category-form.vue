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
            <div v-if="index == 0">
              <label
                for="category"
                class="relative overflow-hidden flex items-center justify-center h-10 w-12 bg-primary rounded-md cursor-pointer"
              >
                <PhotoIcon v-if="!catImage" class="w-7 h-8 fill-light400" />
                <img
                  v-else
                  :src="catImage"
                  class="h-full w-full object-cover object-center"
                  alt=""
                  srcset=""
                />
                <input
                  type="file"
                  @change="categoryImageDecode"
                  accept="image/*"
                  class="hidden"
                  id="category"
                />
              </label>
            </div>
            <div v-else class="h-10 w-[56px]"></div>

            <v-text-field
              v-if="index == 0"
              :name="lng.name + 'Name'"
              v-model="categoryValueEn"
              :label="index == 0 ? 'Category' : ''"
              :placeholder="lng.name + ' name'"
              rules="required"
            />
            <v-text-field
              v-if="index == 1"
              :name="lng.name + 'Name'"
              v-model="categoryValueAm"
              :placeholder="lng.name + ' name'"
              rules="required"
            />
          </div>
        </div>

        <div class="flex gap-4 my-2">
          <button
            class="uppercase block ml-auto hover:shadow-md shadow-primary text-sm outline-none px-4 py-2 bg-primary text-white font-semibold rounded-sm hover:bg-primary ring-4 hover:ring-primary hover:ring-opacity-50 ring-opacity-30 ring-transparent transition-all ease-in-out duration-300"
          >
            {{ initialData ? "Update" : "Add Category" }}
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
const categoryImage = ref(null);
const categoryValueEn = ref();
const categoryValueAm = ref();
const catImage = ref();
const emit = defineEmits(["closeModal", "addCategory", "updateCategory"]);
const props = defineProps({
  initialData: { required: false, type: Object, default: null },
  language: { type: Object, required: true },
});
if (props.initialData?.en) {
  console.log(props.initialData);
  setValues({ amName: props.initialData.am, enName: props.initialData.en });
  catImage.value = props.initialData.img;
}
const submit = handleSubmit(
  (value) => {
    if (catImage.value) {
      if (props.initialData)
        emit("updateCategory", {
          img: categoryImage.value ? categoryImage.value : catImage.value,
          category: [
            { type: "am", value: value.amName },
            { type: "en", value: value.enName },
          ],
        });
      else
        emit("addCategory", {
          img: categoryImage.value ? categoryImage.value : catImage.value,
          category: [
            { type: "am", value: value.amName },
            { type: "en", value: value.enName },
          ],
        });
    } else {
      console.log("error");
      setErrors({ amName: "Category Image Not set" });
    }
  },
  (error) => {}
);

const categoryImageDecode = (e) => {
  var file = e.target.files[0];
  var reader = new FileReader();
  reader.onloadend = function () {
    console.log("base64", reader.result);
    categoryImage.value = {
      name: file.name,
      base64: reader.result.toString().split(",")[1],
    };

    catImage.value = reader.result;
  };
  reader.readAsDataURL(file);
};
</script>
