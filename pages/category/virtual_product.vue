<template>
  <div class="relative">
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
    <div
      class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-6 gap-x-4 my-4"
    >
      <div
        class="p-4 pb-0 relative  rounded-md border hover:border-primary bg-light150/20 shadow-sm"
        v-for="cat in categoryListItems"
        :key="cat.id"
      >
        <img
          class="object-center block object-cover rounded-md overflow-hidden h-12 w-12"
          :src="cat.img"
          alt=""
          srcset=""
        />
        <div class="flex justify-between py-1 items-center">
          <p class="font-semibold text-lg text-green400 text-dark300/60">
            {{ cat.en }}
          </p>

          <v-menu
            @click.stop="null"
            leading_icon="mdi:dots-horizontal"
            :menu="{
              actions: ['Edit', 'Delete'],
              id: { id: cat.id },
            }"
            @option-clicked="actionSelect"
          />
        </div>
      </div>
    </div>
    <category-form
      v-if="showModal"
      :language="languageList ?? []"
      @closeModal="
        showModal = false;
        categoryToBeEdited = null;
      "
      @updateCategory="updateCategory"
      @addCategory="addCategory"
      :initial-data="categoryToBeEdited"
    />
    <v-loading
      :show-loading="isLoading"
      loading-text="Please Wait. . ."
      class="z-50"
    />
    <button
      class="uppercase fixed bottom-4 hover:shadow-md shadow-primary right-8 text-sm outline-none px-4 py-2 bg-primary text-white font-semibold rounded-full hover:bg-primary ring-4 hover:ring-primary hover:ring-opacity-50 ring-opacity-30 ring-transparent transition-all ease-in-out duration-300"
      @click="showModal = true"
    >
      Add Category
    </button>
  </div>
</template>
<script setup>
import { EllipsisVerticalIcon } from "@heroicons/vue/24/solid";
import languages from "@/apollo/query/avaiableLanguages.gql";
import fetchCategory from "@/apollo/query/products/virtual/fetchCategory.gql";
import updateMainCategoryGql from "@/apollo/mutation/product/virtual/updateMainCategory.gql";
import deleteCategoryGql from "@/apollo/mutation/product/physical/deleteCategory.gql";
import addCategoryGql from "@/apollo/mutation/product/virtual/addCategory.gql";
definePageMeta({
  layout: "custom",
});

const categoryToBeEdited = ref(null);
const showConfirmationModal = ref(false);
const showModal = ref(false);
const isLoading = ref();
const { result: language_result, onError: onLanguageError } =
  useCustomQuery(languages);

const languageList = computed(() => {
  return language_result.value?.language?.map((lan) => {
    return { name: lan.name };
  });
});
const {
  result: category_result,
  onError: onCategoryError,
  refetch: categoryRefetch,
} = useCustomQuery(fetchCategory);
onCategoryError((error) => {
  console.log(error);
});

const {
  onDone: updateMainCategoryDone,
  onError: updateMainCategoryError,
  mutate: updateMainCategoryMutation,
} = useCustomMutation(updateMainCategoryGql);
updateMainCategoryError((error) => {
  showNotification(true, "Category Updated Fail..try again");
  isLoading.value = false;
  console.log("add category mutation error", error);
});
updateMainCategoryDone((result) => {
  showNotification(true, "Category Updated Successfully");
  isLoading.value = false;
  categoryRefetch();
  showModal.value = false;
  categoryToBeEdited.value = null;
  console.log("add category mutation result", result);
});
const {
  onDone: deleteCategoryDone,
  onError: deleteCategoryError,
  mutate: deleteCategoryMutation,
} = useCustomMutation(deleteCategoryGql);
deleteCategoryError((error) => {
  showConfirmationModal.value = false;
  isLoading.value = false;
  showNotification(
    false,
    error.message.includes("violate")
      ? "U can't delete this category as it is associated to product"
      : "deletion error"
  );
  console.log("add category mutation error", error);
});
deleteCategoryDone((result) => {
  showNotification(true, "Category Deleted");
  isLoading.value = false;
  showConfirmationModal.value = false;
  categoryRefetch();
  showModal.value = false;
  categoryToBeEdited.value = null;
  console.log("add category mutation result", result);
});

const {
  onDone: addCategoryDone,
  onError: addCategoryError,
  mutate: addCategoryMutation,
} = useCustomMutation(addCategoryGql);
addCategoryError((error) => {
  isLoading.value = false;
  showNotification(false, "Add Category Fail ... Please Try Again");
  console.log("add category mutation error", error);
});
addCategoryDone((result) => {
  showNotification(true, "Category Add Successful");
  isLoading.value = false;
  categoryRefetch();
  showModal.value = false;
  categoryToBeEdited.value = null;
  console.log("add category mutation result", result);
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
    };
  });
});
let catToDeleteId;
const actionSelect = (value) => {
  if (value.action == "Edit") {
    console.log(value);
    categoryToBeEdited.value = categoryListItems.value.find((elem) => {
      return elem.id == value.id.id;
    });
    console.log(categoryToBeEdited.value);
    showModal.value = true;
  } else {
    catToDeleteId = categoryListItems.value.find((elem) => {
      return elem.id == value.id.id;
    })?.lng_id;
    showConfirmationModal.value = true;
    console.log("delete");
  }
};

const updateCategory = async (value) => {
  // console.log("Update", value, categoryToBeEdited.value);
  isLoading.value = true;
  const id = categoryToBeEdited.value.cat_lng_id;

  const am_name = value.category[0].value;
  const en_name = value.category[1].value;
  const cat_id = categoryToBeEdited.value.id;
  console.log(value);
  let logo = value.img;
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
  updateMainCategoryMutation({ id, logo, en_name, am_name, cat_id });
};
const addCategory = async (value) => {
  isLoading.value = true;
  let logo = value.img;
  const en_name = value.category[1].value;
  const am_name = value.category[0].value;

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
  addCategoryMutation({ logo, en_name, am_name });
};

const confirmationAction = (value) => {
  if (value.accept) {
    isLoading.value = true;
    deleteCategoryMutation({ id: catToDeleteId });
  } else showConfirmationModal.value = false;
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
