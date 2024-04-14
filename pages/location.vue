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
        v-for="city in locationListItems"
        :key="city.id"
        class="py-4 px-3 bg-light150/20 border rounded-md hover:border-primary shadow-sm cursor-pointer"
        @click="showDetail(city.id)"
      >
        <h1 class="py-2 font-bold text-lg text-primary line-clamp-1">
          {{ city.en }}
        </h1>
        <p class="text-gray py-2 text-sm">
          {{ city.subCity.length }} subCities
        </p>
      </div>
    </div>

    <location-add-form
      v-if="showLocationAddForm"
      @addCity="addNewCity"
      @closeModal="showLocationAddForm = false"
      :language="languageList ?? []"
    />
    <location-edit-add-form
      :initialData="TargetToBeEdited"
      :isCitySelected="isCitySelected"
      @closeModal="
        showEditModal = false;
        TargetToBeEdited = null;
        isCitySelected = false;
      "
      :language="languageList ?? []"
      @updateCity="updateSubCity"
      @addCity="addSubCity"
      v-if="showEditModal"
      class="z-50"
    />
    <v-loading
      :show-loading="isLoading"
      loading-text="Please Wait. . ."
      class="z-50"
    />
    <div
      v-if="selectedCity"
      class="fixed z-40 top-0 right-0 h-full w-full bg-black/10 shadow-md"
      @click.self="selectedCity = null"
    >
      <div
        class="fixed z-40 top-0 right-0 h-full w-full md:w-2/3 lg:w-1/2 bg-white shadow-md"
      >
        <XCircleIcon
          class="w-10 h-10 absolute top-4 cursor-pointer right-4 fill-red"
          @click="selectedCity = null"
        />
        <div class="pt-20 px-4">
          <div class="w-full flex justify-between items-center">
            <h1 class="text-primary font-bold text-lg">
              {{ selectedCity.en }}
            </h1>
            <div class="flex">
              <PencilIcon class="w-6 h-4 fill-primary" @click="editCity" />
              <TrashIcon
                class="w-6 h-4 fill-red ml-3"
                @click="deleteCategory(selectedCity.lng_id)"
              />
            </div>
          </div>
          <div
            class="w-full flex justify-between items-center pl-4 bg-white shadow-sm p-2 my-2"
            v-for="subCity in selectedCity.subCity"
            :key="subCity.id"
          >
            <h1 class="text-gray font-bold text-md py-2">
              {{ subCity.en }}
            </h1>
            <PencilIcon
              class="w-6 h-4 fill-primary ml-auto"
              @click="editSubCity(subCity.id)"
            />
            <TrashIcon
              class="w-6 h-4 fill-red ml-3"
              @click="deleteCategory(subCity.lng_id)"
            />
          </div>
        </div>
        <button
          class="uppercase fixed bottom-4 hover:shadow-md shadow-primary right-8 text-sm outline-none px-4 py-2 bg-primary text-white font-semibold rounded-full hover:bg-primary ring-4 hover:ring-primary hover:ring-opacity-50 ring-opacity-30 ring-transparent transition-all ease-in-out duration-300"
          @click="addSubCategoryBtn()"
        >
          Add SubCity
        </button>
      </div>
    </div>
    <button
      class="uppercase fixed bottom-4 hover:shadow-md shadow-primary right-8 text-sm outline-none px-4 py-2 bg-primary text-white font-semibold rounded-full hover:bg-primary ring-4 hover:ring-primary hover:ring-opacity-50 ring-opacity-30 ring-transparent transition-all ease-in-out duration-300"
      @click="showLocationAddForm = true"
    >
      Add City
    </button>
  </div>
</template>
<script setup>
import { XCircleIcon, PencilIcon, TrashIcon } from "@heroicons/vue/24/solid";
import fetchLocation from "@/apollo/query/location/fetchLocation.gql";
import languages from "@/apollo/query/avaiableLanguages.gql";
import addLocation from "@/apollo/mutation/location/addLocation.gql";
import updateSubCityGql from "@/apollo/mutation/location/updateSubCity.gql";
import addSubCityGql from "@/apollo/mutation/location/addSubCity.gql";
import updateCityGql from "@/apollo/mutation/location/updateCity.gql";
import deleteCityGql from "@/apollo/mutation/product/physical/deleteCategory.gql";
definePageMeta({
  layout: "custom",
});
const showLocationAddForm = ref(false);
const selectedCity = ref(false);
const showEditModal = ref(false);
const TargetToBeEdited = ref(null);
const isCitySelected = ref(false);
const isLoading = ref(false);
const showConfirmationModal = ref(false);
const showDetail = (id) => {
  console.log(id);
  selectedCity.value = locationListItems.value.find((city) => {
    return city.id == id;
  });
};
const editCity = () => {
  isCitySelected.value = true;
  TargetToBeEdited.value = selectedCity.value;
  showEditModal.value = true;
};
const editSubCity = (id) => {
  isCitySelected.value = false;

  TargetToBeEdited.value = selectedCity?.value?.subCity?.find((subCat) => {
    return subCat.id == id;
  });
  console.log(TargetToBeEdited.value);
  showEditModal.value = true;
};
const addSubCity = async (value) => {
  isLoading.value = true;
  const variable = {
    object: {
      city_region_id: selectedCity.value.id,
      longitude: value.latitude,
      latitude: value.longitude,
      original_language: {
        data: { translation_contents: { data: value.city } },
      },
    },
  };

  addSubCityMutation(variable);
};
const updateSubCity = async (value) => {
  if (isCitySelected.value) {
    isLoading.value = true;
    console.log(value);
    const id = TargetToBeEdited.value.loc_lng_id;
    const en_name = value.city[1].name;
    const am_name = value.city[0].name;

    updateMainCityMutation({ id, en_name, am_name });
  } else {
    isLoading.value = true;

    console.log(value);
    const id = TargetToBeEdited.value.sub_loc_lng_id;
    const en_name = value.city[1].name;
    const am_name = value.city[0].name;
    const lat = value.latitude;
    const long = value.longitude;
    const sub_city_id = TargetToBeEdited.value.id;
    updateSubCityMutation({
      id,
      en_name,
      am_name,
      sub_city_id,
      lat,
      long,
    });
  }
};

const {
  onDone: addLocationDone,
  onError: addLocationError,
  mutate: addLocationMutation,
} = useCustomMutation(addLocation);
addLocationError((error) => {
  showNotification(false, "City Add Fail..try again");
  isLoading.value = false;
  console.log("add city mutation error", error);
});
addLocationDone((result) => {
  showNotification(true, "City Successfully Added");
  isLoading.value = false;
  locationRefetch();
  showLocationAddForm.value = false;
  console.log("add city mutation result", result);
});

const {
  onDone: updateMainCityDone,
  onError: updateMainCityError,
  mutate: updateMainCityMutation,
} = useCustomMutation(updateCityGql);
updateMainCityError((error) => {
  showNotification(false, "City/SubCity Updated Fail..try again");
  isLoading.value = false;
  console.log("add City/SubCity mutation error", error);
});
updateMainCityDone((result) => {
  showNotification(true, "City/SubCity Successfully Updated");
  isLoading.value = false;
  locationRefetch();
  selectedCity.value = null;
  showEditModal.value = false;
  console.log("add City/SubCity mutation result", result);
});
const {
  onDone: updateSubCityDone,
  onError: updateSubCityError,
  mutate: updateSubCityMutation,
} = useCustomMutation(updateSubCityGql);
updateSubCityError((error) => {
  showNotification(false, "City/SubCity Updated Fail..try again");
  isLoading.value = false;
  console.log("update city/subCity mutation error", error);
});
updateSubCityDone((result) => {
  showNotification(true, "City/SubCity Updated Successfully");
  isLoading.value = false;
  locationRefetch();
  selectedCity.value = null;
  showEditModal.value = false;
  console.log("update City/SubCity mutation result", result);
});

const {
  onDone: addSubCityDone,
  onError: addSubCityError,
  mutate: addSubCityMutation,
} = useCustomMutation(addSubCityGql);
addSubCityError((error) => {
  showNotification(false, "City/SubCity Add Fail..try again");
  isLoading.value = false;
  console.log("add  City/SubCity mutation error", error);
});
addSubCityDone((result) => {
  showNotification(true, "City/SubCity Add Successful");
  isLoading.value = false;
  locationRefetch();
  selectedCity.value = null;
  showEditModal.value = false;
  console.log("add  City/SubCity mutation result", result);
});

const {
  onDone: deleteCityDone,
  onError: deleteCityError,
  mutate: deleteCityMutation,
} = useCustomMutation(deleteCityGql);
deleteCityError((error) => {
  showNotification(
    false,
    error.message.includes("violate")
      ? "U can't delete this City/SubCity as it is associated"
      : "deletion error"
  );
  isLoading.value = false;
  console.log("delete  error", error);
});
deleteCityDone((result) => {
  showNotification(true, "City Delete successful");
  isLoading.value = false;
  locationRefetch();
  selectedCity.value = null;
  showEditModal.value = false;
  showConfirmationModal.value = false;
  console.log("city delete done", result);
});

const addNewCity = async (value) => {
  isLoading.value = true;
  console.log("add new City", value);
  console.log(value);
  const subCityList = value.city.subCities?.map((city) => {
    return {
      latitude: city.latitude,
      longitude: city.longitude,
      original_language: {
        data: {
          translation_contents: {
            data: city.language,
          },
        },
      },
    };
  });
  const variable = {
    object: {
      original_language: {
        data: {
          translation_contents: {
            data: value.city.language,
          },
        },
      },
      sub_cities: {
        data: subCityList,
      },
    },
  };
  addLocationMutation(variable);
};

const {
  result: location_result,
  onError: onLocationError,
  refetch: locationRefetch,
} = useCustomQuery(fetchLocation);
onLocationError((error) => {
  console.log(error);
});

const { result: language_result, onError: onLanguageError } =
  useCustomQuery(languages);

const languageList = computed(() => {
  return language_result.value?.language?.map((lan) => {
    return { name: lan.name };
  });
});
const locationListItems = computed(() => {
  return location_result.value?.city?.map((loc) => {
    console.log(loc);
    return {
      id: loc.id,
      en: loc.language.en[0].name,
      am: loc.language.am[0].name,
      loc_lng_id: loc.language.am[0].id,
      lng_id: loc.language.id,
      subCity: loc.sub_cities.map((sub) => {
        return {
          id: sub.id,
          en: sub.language.en[0].name,
          am: sub.language.am[0].name,
          sub_loc_lng_id: sub.language.am[0].id,
          lng_id: sub.language.id,
          lat: sub.latitude,
          long: sub.longitude,
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
    deleteCityMutation({ id: categoryToDeleteId.value });
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
