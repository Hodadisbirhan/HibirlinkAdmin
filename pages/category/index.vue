<template>
  <div class="p-4 relative">
    <v-notification
      @close="messageShow = false"
      :success="messageStatus"
      v-model:model-value="messageShow"
      >{{ messageContent }}
    </v-notification>
    <confirm-action
      v-if="showConfirmationModal"
      @confirmation="confirmationAction"
    />
    <div class="grid grid-cols-3 gap-x-4 gap-y-6">
      <div
        v-for="category in categoryListItems"
        :key="category.id"
        class="py-4 px-3 rounded-md shadow-sm border hover:border-primary bg-light150/20 cursor-pointer"
        @click="showDetail(category.id)"
      >
        <h1 class="py-2 font-bold text-lg text-primary line-clamp-1">
          {{ category.en }}
        </h1>
        <p class="text-gray py-2 text-sm">
          {{ category.subCategory.length }} subCategories
        </p>
      </div>
    </div>

    <rtp-category-form
      v-if="showCategoryAddForm"
      @addCategory="addNewCategory"
      @closeModal="showCategoryAddForm = false"
      :language="languageList ?? []"
    />
    <category-form
      :initialData="TargetToBeEdited"
      @closeModal="
        showEditModal = false;
        TargetToBeEdited = null;
      "
      :language="languageList ?? []"
      @updateCategory="updateSubCategory"
      @addCategory="addSubCategory"
      v-if="showEditModal"
      class="z-50"
    />
    <v-loading
      :show-loading="isLoading"
      loading-text="Please Wait. . ."
      class="z-50"
    />
    <div
      v-if="selectedCategory"
      class="fixed z-40 top-0 right-0 h-full w-full bg-black/10 shadow-md"
      @click.self="selectedCategory = null"
    >
      <div
        class="fixed z-40 top-0 right-0 h-full w-full md:w-2/3 lg:w-1/2 bg-white shadow-md"
      >
        <XCircleIcon
          class="w-10 h-10 absolute top-4 cursor-pointer right-4 fill-red"
          @click="selectedCategory = null"
        />
        <div class="pt-20 px-4">
          <div class="w-full flex justify-between items-center">
            <h1 class="text-primary font-bold text-lg">
              {{ selectedCategory.en }}
            </h1>
            <div class="flex">
              <PencilIcon class="w-6 h-4 fill-primary" @click="editCategory" />
              <TrashIcon
                class="w-6 h-4 fill-red ml-3"
                @click="deleteCategory(selectedCategory.lng_id)"
              />
            </div>
          </div>
          <div
            class="w-full flex justify-between items-center pl-4 bg-white shadow-sm p-2 my-2"
            v-for="subCat in selectedCategory.subCategory"
            :key="subCat.id"
          >
            <h1 class="text-gray font-bold text-md py-2">
              {{ subCat.en }}
            </h1>
            <PencilIcon
              class="w-6 h-4 fill-primary ml-auto"
              @click="editSubCategory(subCat.id)"
            />
            <TrashIcon
              class="w-6 h-4 fill-red ml-3"
              @click="deleteCategory(subCat.lng_id)"
            />
          </div>
        </div>
        <button
          class="uppercase fixed bottom-4 hover:shadow-md shadow-primary right-8 text-sm outline-none px-4 py-2 bg-primary text-white font-semibold rounded-full hover:bg-primary ring-4 hover:ring-primary hover:ring-opacity-50 ring-opacity-30 ring-transparent transition-all ease-in-out duration-300"
          @click="addSubCategoryBtn()"
        >
          Add SubCategory
        </button>
      </div>
    </div>
    <button
      class="uppercase fixed bottom-4 hover:shadow-md shadow-primary right-8 text-sm outline-none px-4 py-2 bg-primary text-white font-semibold rounded-full hover:bg-primary ring-4 hover:ring-primary hover:ring-opacity-50 ring-opacity-30 ring-transparent transition-all ease-in-out duration-300"
      @click="showCategoryAddForm = true"
    >
      Add Category
    </button>
  </div>
</template>
<script setup>
import { XCircleIcon, PencilIcon, TrashIcon } from "@heroicons/vue/24/solid";
import fetchCategory from "@/apollo/query/products/physical/fetchCategory.gql";
import languages from "@/apollo/query/avaiableLanguages.gql";
import addCategory from "@/apollo/mutation/product/physical/addCategory.gql";
import updateSubCategoryGql from "@/apollo/mutation/product/physical/updateSubCategory.gql";
import addSubCategoryGql from "@/apollo/mutation/product/physical/addSubCategory.gql";
import updateMainCategoryGql from "@/apollo/mutation/product/physical/updateMainCategory.gql";
import deleteCategoryGql from "@/apollo/mutation/product/physical/deleteCategory.gql";
definePageMeta({
  layout: "custom",
});
const showCategoryAddForm = ref(false);
const selectedCategory = ref(false);
const showEditModal = ref(false);
const TargetToBeEdited = ref(null);
const isMainCategory = ref(false);
const isLoading = ref(false);
const showConfirmationModal = ref(false);
const showDetail = (id) => {
  selectedCategory.value = categoryListItems.value.find((cat) => {
    return cat.id == id;
  });
};
const editCategory = () => {
  isMainCategory.value = true;
  TargetToBeEdited.value = selectedCategory.value;
  showEditModal.value = true;
};
const editSubCategory = (id) => {
  isMainCategory.value = false;
  TargetToBeEdited.value = selectedCategory.value.subCategory.find((subCat) => {
    return subCat.id == id;
  });
  showEditModal.value = true;
};
const addSubCategory = async (value) => {
  console.log("category id", selectedCategory.value.id, value);
  isLoading.value = true;
  const cat_id = selectedCategory.value.id;
  const en_name = value.category[1].value;
  const am_name = value.category[0].value;
  let logo;
  const { uploadImages } = useUploadFile();

  const { urls: catLogo, error: catError } = await uploadImages(
    [value.img],
    "images/products/realtime"
  );
  if (!catLogo || catError) {
    console.log(catError);
    isLoading.value = false;
    return;
  } else {
    logo = catLogo[0];
  }
  addSubCategoryMutation({ cat_id, logo, en_name, am_name });
};
const updateSubCategory = async (value) => {
  if (isMainCategory.value) {
    isLoading.value = true;
    const en_name = value.category[1].value;
    const am_name = value.category[0].value;
    let logo = value.img;
    const id = selectedCategory.value.cat_lng_id;
    const cat_id = selectedCategory.value.id;
    if (!(typeof value.img == "string")) {
      const { uploadImages } = useUploadFile();

      const { urls: catLogo, error: catError } = await uploadImages(
        [value.img],
        "images/products/realtime"
      );
      if (!catLogo || catError) {
        console.log(catError);
        isLoading.value = false;
        return;
      } else {
        logo = catLogo[0];
      }
    }

    updateMainCategoryMutation({ id, cat_id, en_name, am_name, logo });
  } else {
    isLoading.value = true;
    console.log("category id", selectedCategory.value.id);
    console.log("sub cat id", TargetToBeEdited.value.id);
    console.log("sub cat id lng", TargetToBeEdited.value.sub_cat_lng_id);
    console.log(value);
    const en_name = value.category[1].value;
    const am_name = value.category[0].value;
    let logo = value.img;
    const sub_id = TargetToBeEdited.value.id;
    if (!(typeof value.img == "string")) {
      const { uploadImages } = useUploadFile();

      const { urls: catLogo, error: catError } = await uploadImages(
        [value.img],
        "images/products/realtime"
      );
      if (!catLogo || catError) {
        console.log(catError);
        isLoading.value = false;
        return;
      } else {
        logo = catLogo[0];
      }
    }

    updateSubCategoryMutation({
      id: TargetToBeEdited.value.sub_cat_lng_id,
      en_name,
      am_name,
      logo,
      sub_id,
    });
  }
};

const {
  onDone: addCategoryDone,
  onError: addCategoryError,
  mutate: addCategoryMutation,
} = useCustomMutation(addCategory);
addCategoryError((error) => {
  showNotification(false, "Category Add Fail..try again");
  isLoading.value = false;
  console.log("add category mutation error", error);
});
addCategoryDone((result) => {
  showNotification(true, "Category Successfully Added");
  isLoading.value = false;
  categoryRefetch();
  showCategoryAddForm.value = false;
  console.log("add category mutation result", result);
});

const {
  onDone: updateMainCategoryDone,
  onError: updateMainCategoryError,
  mutate: updateMainCategoryMutation,
} = useCustomMutation(updateMainCategoryGql);
updateMainCategoryError((error) => {
  showNotification(false, "Category Updated Fail..try again");
  isLoading.value = false;
  console.log("add category mutation error", error);
});
updateMainCategoryDone((result) => {
  showNotification(true, "Category Successfully Updated");
  isLoading.value = false;
  categoryRefetch();
  selectedCategory.value = null;
  showEditModal.value = false;
  console.log("add category mutation result", result);
});
const {
  onDone: updateSubCategoryDone,
  onError: updateSubCategoryError,
  mutate: updateSubCategoryMutation,
} = useCustomMutation(updateSubCategoryGql);
updateSubCategoryError((error) => {
  showNotification(false, "Category Updated Fail..try again");
  isLoading.value = false;
  console.log("update category mutation error", error);
});
updateSubCategoryDone((result) => {
  showNotification(true, "Category Updated Successfully");
  isLoading.value = false;
  categoryRefetch();
  selectedCategory.value = null;
  showEditModal.value = false;
  console.log("update category mutation result", result);
});

const {
  onDone: addSubCategoryDone,
  onError: addSubCategoryError,
  mutate: addSubCategoryMutation,
} = useCustomMutation(addSubCategoryGql);
addSubCategoryError((error) => {
  showNotification(false, "Category Add Fail..try again");
  isLoading.value = false;
  console.log("add sub category mutation error", error);
});
addSubCategoryDone((result) => {
  showNotification(true, "Category Add Successful");
  isLoading.value = false;
  categoryRefetch();
  selectedCategory.value = null;
  showEditModal.value = false;
  console.log("add sub category mutation result", result);
});

const {
  onDone: deleteCategoryDone,
  onError: deleteCategoryError,
  mutate: deleteCategoryMutation,
} = useCustomMutation(deleteCategoryGql);
deleteCategoryError((error) => {
  showNotification(
    false,
    error.message.includes("violate")
      ? "U can't delete this category as it is associated to sub products"
      : "deletion error"
  );
  isLoading.value = false;
  console.log("add sub category mutation error", error);
});
deleteCategoryDone((result) => {
  showNotification(true, "Category Delete successful");
  isLoading.value = false;
  categoryRefetch();
  selectedCategory.value = null;
  showEditModal.value = false;
  showConfirmationModal.value = false;
  console.log("add sub category mutation result", result);
});

const addNewCategory = async (value) => {
  isLoading.value = true;
  console.log("add new Category", value);
  let categoryLanguageEntry = [];
  let subCategoryLanguageEntry = [];
  let subCategoryImages = ref([]);
  value.category.category.map((cat) => {
    categoryLanguageEntry.push({ language_type: cat.type, name: cat.value });
  });
  const { uploadImages } = useUploadFile();

  const { urls: catLogo, error: catError } = await uploadImages(
    [value.category.img],
    "images/products/realtime"
  );
  console.log(catError);
  if (catError && !catLogo) {
    isLoading.value = false;
    return;
  }
  const uploadImage = ref(true);
  console.log("IMAGE", catLogo[0], "ERROR", catError);
  subCategoryImages.value = value.subCategory.map((sub) => {
    return sub.img;
  });
  const { urls: subLogo, error: subError } = await uploadImages(
    subCategoryImages.value,
    "images/products/realtime"
  );
  if (subError && !subLogo) {
    isLoading.value = false;
    console.log("SUB ERROR", subError);
    uploadImage.value = false;
    return;
  }
  if (!uploadImage) return;
  console.log("IMAGE Sub", subLogo);
  subCategoryLanguageEntry = value.subCategory.map((sub, index) => {
    console.log("INDEX", index, subLogo[index]);
    return {
      logo: subLogo[index],
      original_language: {
        data: {
          translation_contents: {
            data: [
              {
                language_type: sub.language[0].type,
                name: sub.language[0].value,
              },
              {
                language_type: sub.language[1].type,
                name: sub.language[1].value,
              },
            ],
          },
        },
      },
    };
  });

  const variable = {
    object: [
      {
        logo: catLogo[0],
        original_language: {
          data: {
            translation_contents: {
              data: categoryLanguageEntry,
            },
          },
        },
        physical_product_sub_categories: {
          data: subCategoryLanguageEntry,
        },
      },
    ],
  };

  addCategoryMutation(variable);
};

const {
  result: category_result,
  onError: onCategoryError,
  refetch: categoryRefetch,
} = useCustomQuery(fetchCategory);
onCategoryError((error) => {
  console.log(error);
});

const { result: language_result, onError: onLanguageError } =
  useCustomQuery(languages);
onCategoryError((error) => {
  console.log(error);
});

const languageList = computed(() => {
  return language_result.value?.language?.map((lan) => {
    return { name: lan.name };
  });
});
const categoryListItems = computed(() => {
  return category_result.value?.category?.map((cat) => {
    return {
      id: cat.id,
      en: cat.language.en[0].name,
      am: cat.language.am[0].name,
      cat_lng_id: cat.language.am[0].id,
      lng_id: cat.language.id,
      img: cat.logo,
      subCategory: cat.sub_categories.map((sub) => {
        return {
          id: sub.id,
          en: sub.language.en[0].name,
          am: sub.language.am[0].name,
          sub_cat_lng_id: sub.language.am[0].id,
          lng_id: sub.language.id,
          img: sub.logo,
        };
      }),
    };
  });
});

const addSubCategoryBtn = () => {
  showEditModal.value = true;
  TargetToBeEdited.value = null;
};

let categoryToDeleteId = ref();

const deleteCategory = (id) => {
  console.log(id);
  categoryToDeleteId.value = id;
  showConfirmationModal.value = true;
};
const confirmationAction = (value) => {
  if (value.accept) {
    isLoading.value = true;
    deleteCategoryMutation({ id: categoryToDeleteId.value });
  } else {
    showConfirmationModal.value = false;
    categoryToDeleteId.value = null;
  }
};

const messageShow = ref(false);
const messageStatus = ref(false);
const messageContent = ref("");
const showNotification = (status, message) => {
  messageShow.value = true;
  messageStatus.value = status;
  messageContent.value = message;
};
</script>
