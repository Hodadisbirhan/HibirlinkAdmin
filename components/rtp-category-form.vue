<template>
  <div
    class="fixed z-40 top-0 right-0 h-full w-full bg-black/10 shadow-md"
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
        <h1 class="text-xl text-gray font-bold mb-5">Add Category</h1>
        <div
          class="flex gap-4 items-center justify-end"
          v-for="(lng, index) in language"
          :key="lng"
        >
          <div v-if="index == 0">
            <label
              for="category"
              class="relative overflow-hidden flex items-center justify-center h-10 w-12 bg-primary rounded-md cursor-pointer"
            >
              <PhotoIcon v-if="!categoryImage" class="w-7 h-8 fill-light400" />
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
        <hr class="border-2 my-4 ml-[60px] border-neutral500" />

        <div
          class="flex gap-4 items-center justify-end"
          v-for="(lng, index) in language"
          :key="lng"
        >
          <div v-if="index == 0">
            <label
              for="subCategory"
              class="relative overflow-hidden flex items-center justify-center h-10 w-12 bg-primary rounded-md cursor-pointer"
            >
              <PhotoIcon
                v-if="!subCategoryImage"
                class="w-7 h-8 fill-light400"
              />
              <img
                v-else
                :src="subCatImage"
                class="h-full w-full object-cover object-center"
                alt=""
                srcset=""
              />
              <input
                type="file"
                @change="subCategoryImageDecode"
                accept="image/*"
                class="hidden"
                id="subCategory"
              />
            </label>
          </div>
          <div v-else class="h-10 w-[56px]"></div>
          <v-text-field
            v-if="index == 0"
            :name="lng.name + 'SName'"
            label="subCategory"
            v-model="subCategoryValueEn"
            :placeholder="lng.name + ' name'"
            :rules="
              subCategories.length
                ? ''
                : 'required|subCategory:' + lng.name + 'Name'
            "
          />
          <v-text-field
            v-if="index == 1"
            :name="lng.name + 'SName'"
            v-model="subCategoryValueAm"
            :placeholder="lng.name + ' name'"
            :rules="
              subCategories.length
                ? ''
                : 'required|subCategory:' + lng.name + 'Name'
            "
          />
        </div>
        <div
          class="flex gap-1 py-1 px-2 bg-primary w-fit text-light400 rounded-sm capitalize ml-auto mb-3 cursor-pointer"
          @click="addSubCategory"
        >
          <PlusIcon class="fill-light400 w-6 h-6" />
          <span class="capitalize">Sub Category</span>
        </div>
        <div class="flex gap-4 my-2">
          <button
            class="uppercase block ml-auto hover:shadow-md shadow-primary text-sm outline-none px-4 py-2 bg-primary text-white font-semibold rounded-sm hover:bg-primary ring-4 hover:ring-primary hover:ring-opacity-50 ring-opacity-30 ring-transparent transition-all ease-in-out duration-300"
          >
            Add Category
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
            v-for="(subCategory, index) in subCategories"
            :key="index"
            class="py-3 text-md my-2 bg-primary/10 rounded-md shadow-sm px-4 pr-8 flex gap-4 relative"
          >
            <XCircleIcon
              class="w-5 h-5 absolute top-1 cursor-pointer right-1 fill-red"
              @click="deleteImage(index)"
            />
            <img
              :src="subCategoryImageCollection[index]"
              class="h-[50px] w-[50px] object-cover object-center rounded-lg"
              alt=""
              srcset=""
            />
            <div class="flex h-full flex-col justify-between">
              <p>en : {{ subCategory.language[0].value }}</p>
              <p>am: {{ subCategory.language[1].value }}</p>
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
const categoryImage = ref(null);
const subCategoryImage = ref(null);
const subCategoryValueEn = ref();
const subCategoryValueAm = ref();
const categoryValueEn = ref();
const categoryValueAm = ref();
const catImage = ref();
const subCatImage = ref();
const subCategoryImageCollection = ref([]);

const subCategories = ref([]);
const emit = defineEmits(["closeModal", "addCategory", "updateCategory"]);

const deleteImage = (index) => {
  subCategories.value = subCategories.value.filter((sub, idx) => idx != index);
};
const addSubCategory = () => {
  if (categoryValueAm.value && categoryValueEn.value && categoryImage.value)
    if (
      subCategoryImage.value &&
      subCategoryValueAm.value &&
      subCategoryValueEn.value
    ) {
  

      subCategories.value.push({
        img: subCategoryImage.value,
        language: [
          { type: "en", value: subCategoryValueEn.value },
          {
            type: "am",
            value: subCategoryValueAm.value,
          },
        ],
      });
      subCategoryImageCollection.value.push(subCatImage.value)
      subCategoryImage.value = null;
      subCategoryValueAm.value = null;
      subCategoryValueEn.value = null;
    } else {
      if (!subCategoryValueAm.value || !subCategoryValueEn.value) {
        setErrors({ amSName: "subCategory Required" });
      } else {
        setErrors({ amSName: "subCategory Image Not set" });
      }
    }
  else {
    if (!categoryValueAm.value || !categoryValueEn.value)
      setErrors({ amName: "Category Required" });
    else setErrors({ amName: "Category Image not set" });
  }
};
const submit = handleSubmit(
  (value) => {
    if (categoryImage.value && subCategoryImage.value) {
      subCategories.value.push({
        img: subCategoryImage.value,
        language: [
          { type: "en", value: value.enSName },
          {
            type: "am",
            value: value.amSName,
          },
        ],
      });
      subCategoryImageCollection.value.push(subCatImage.value)

      emit("addCategory", {
        category: {
          img: categoryImage.value,
          category: [
            { type: "am", value: value.amName },
            { type: "en", value: value.enName },
          ],
        },
        subCategory: subCategories.value,
      });
    } else {
      if (!categoryImage.value) setErrors({ amName: "Category Image Not set" });
      if (!subCategoryImage.value)
        setErrors({ amSName: "subCategory Image Not set" });
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
const subCategoryImageDecode = (e) => {
  var file = e.target.files[0];
  var reader = new FileReader();
  reader.onloadend = function () {
    console.log("base64", reader.result);
    subCategoryImage.value = {
      name: file.name,
      base64: reader.result.toString().split(",")[1],
    };
    subCatImage.value = reader.result;
    
  };
  reader.readAsDataURL(file);
};
</script>
