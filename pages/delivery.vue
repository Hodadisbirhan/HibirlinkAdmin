<template>
  <div class="w-full flex gap-2">
    <h-notification
      :success="success"
      :message="message"
      v-model="show_notification"
    />
    <div v-if="show_confirm_action">
      <confirm_action @confirmation="confirmAction" />
    </div>

    <div class="w-full py-2">
      <div class="flex gap-5 items-center w-full">
        <div class="flex w-full items-center justify-center my-1 relative">
          <div class="relative w-full">
            <Icon
              name="ic:twotone-search"
              class="w-5 h-5 text-primary absolute top-3 left-2"
            />
            <input
              type="search"
              placeholder="Search By:- name, owner name, owner email,street_address, tin number"
              class="pl-8 w-full placeholder:text-sm border-[1px] rounded-md border-primary focus:border-[1px] focus:ring-0 outline-none ring-0"
              v-model="searchString"
            />
          </div>
        </div>
        <!--  -->
      </div>

      <div
        v-if="showModal"
        class="w-full min-h-screen bg-neutral200/50 absolute top-0 left-0 flex justify-center items-center"
      >
        <div
          class="lg:max-w-[60%] xl:max-w-[50%] md:max-w-[70%] sm:max-w-[80%] max-w-[90%] w-full h-[20rem]"
        >
          <div class="relative">
            <Icon
              @click="showModal = false"
              name="ion:close-outline"
              class="absolute right-1.5 top-1.5 rounded-tr-md rounded-bl-md w-8 h-8 text-neutral300 hover:text-dark200 cursor-pointer shrink-0 transition-colors ease-in-out duration-300"
            />
          </div>

          <div class="bg-light400 flex items-center gap-3 p-5 rounded-md">
            <img
              :src="imgAddress"
              alt="imgAddress"
              class="w-full h-[15rem] object-contain aspect-square"
            />
            <div class="">
              <p class="text-primary text-xl whitespace-nowrap font-bold">
                Delivery Description
              </p>
              <p class="text-sm font-semibold text-dark300/60">
                {{ description }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div class="w-full flex justify-between mt-10">
        <p class="font-semibold text-lg">All Deliver Providers</p>
        <button
          @click="
            () => {
              initialValue = null;
              showDialog = true;
            }
          "
          type="button"
          class="bg-primary text-light100 px-2 py-1 rounded-md"
        >
          Add Delivery
        </button>
      </div>

      <div
        class="w-full mx-auto bg-white rounded-md px-2 overflow-x-auto my-2 mb-[3rem]"
      >
        <div class="flex flex-col gap-4"></div>

        <!--  -->
        <div class="w-full">
          <v-table
            v-if="!onFetchAllDeliveryLoading && tableData"
            class="pb-20"
            :body="tableData"
            :headers="headers"
            header-class="px-7 py-2"
            body-class="px-7 py-2"
            :loading="onFetchAllDeliveryLoading"
            @click:row="showDetailRow"
          >
            <template #Id="{ item }"> {{ item.id }} </template>

            <template #Name="{ item }">
              {{ item.name }}
            </template>
            <template #TinNumber="{ item }">
              {{ item.tin_number }}
            </template>
            <template #OwnerName="{ item }">
              {{ item.owner_name }}
            </template>

            <template #OwnerPhoneNumber="{ item }">
              {{ item.owner_phone }}
            </template>
            <template #OwnerEmail="{ item }">
              {{ item.owner_email }}
            </template>

            <template #City="{ item }">
              {{ item.city }}
            </template>

            <template #SubCity="{ item }">
              {{ item.sub_city }}
            </template>
            <template #StreetAddress="{ item }">
              {{ item.street_address }}
            </template>
            <template #Created_By="{ item }">
              {{ item.managed_by }}
            </template>
            <template #Action="{ item }">
              <v-menu
                @click.stop="null"
                leading_icon="mdi:dots-horizontal"
                :menu="{
                  actions: ['Edit', 'Delete'],
                  id: { id: item.id },
                }"
                @option-clicked="actionSelect"
              />
            </template>
          </v-table>
          <div
            v-if="!onFetchAllDeliveryLoading && tableData == null"
            class="w-full flex justify-center items-center"
          >
            <span class="text-lg font-bold text-darkblue">No Driver </span>
          </div>
        </div>
      </div>

      <div v-if="onFetchAllDeliveryLoading" class="w-full py-2">
        <h-loading
          class="w-full"
          :show-loading="onFetchAllDeliveryLoading || loading"
        ></h-loading>
      </div>

      <!--  -->

      <h-dialog
        v-if="showDialog"
        title="Add New Delivery"
        titleClass="text-primary font-bold text-2xl"
        :hideClosIcon="false"
        @form-submit="handleAddDeliveryForm"
        v-model="showDialog"
        :setValue="initialValue"
      >
        <template #content>
          <h-loading :show-loading="loading" loading-text="Waiting...." />
          <div
            class="w-full flex flex-col gap-4 pt-6 max-h-[calc(100vh-9rem)] pb-5 overflow-y-auto"
          >
            <p class="font-bold">Basic Info</p>
            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
              <h-text-field
                type="text"
                label="First Name"
                rules="required"
                name="first_name"
                placeholder="First Name"
              ></h-text-field>
              <h-text-field
                type="text"
                label="Last Name"
                rules="required"
                name="last_name"
                placeholder="Last Name"
              ></h-text-field>
              <h-text-field
                type="text"
                label="Company Name"
                rules="required"
                name="company_name"
                placeholder="Company Name"
              ></h-text-field>
              <h-text-field
                type="text"
                label="Email"
                rules="required"
                name="email"
                placeholder="Email Address"
              ></h-text-field>
              <h-text-field
                type="text"
                label="Phone Number"
                rules="required"
                name="phone_number"
                placeholder="Phone Number"
              ></h-text-field>
              <h-text-field
                type="text"
                label="Tin Number"
                rules="required"
                name="tin_number"
                placeholder="Tin Number"
              ></h-text-field>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <h-text-area
                class="min-h-[14.4rem]"
                label="Company Detail"
                name="company_detail"
                placeholder="Company detail upto 200 words"
                rules="required"
              >
              </h-text-area>

              <div class="group min-w-[300px]">
                <label
                  class="text-neutral400 font-semibold group-hover:font-bold mb-1 text-sm"
                  for="coverImage"
                >
                  License
                </label>
                <h-file-upload
                  :limit="1"
                  accept="image/*"
                  size="1 mb"
                  id="license"
                  name="license"
                  rules="required"
                />
              </div>
            </div>

            <p class="font-bold">Location Info</p>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <h-select
                :items="cityList || []"
                label="Region/City Administration"
                name="region_or_administration"
                rules="required"
                v-model:model-value="regionAt"
              >
              </h-select>

              <h-select
                :items="subCityList || []"
                label="Sub City"
                name="sub_city"
                rules="required"
                v-model:model-value="subCityAt"
              >
              </h-select>
              <h-text-field
                type="text"
                label="Street Address"
                rules="required"
                name="street_address"
                placeholder="Street Address"
              ></h-text-field>
              <h-text-field
                type="text"
                label="Zip Code"
                rules="required"
                name="zip_code"
                placeholder="Zip Code"
              ></h-text-field>
            </div>

            <footer class="w-full mx-auto flex gap-5 justify-end">
              <h-button
                type="button"
                btn-name="Cancel"
                @click="showDialog = false"
                class="w-fit"
                :gradient="false"
                rounded-class="rounded-md"
                btn-class="overflow-hidden border-2 border-red text-red hover:bg-red hover:text-light400"
                btn-name-class="font-bold w-16"
              />

              <h-button
                type="submit"
                :is-loading="loading"
                :btn-name="isDialogForAdd ? 'Add Delivery' : 'Edit Delivery'"
                class="w-fit"
                :gradient="false"
                rounded-class="rounded-md"
                btn-class="overflow-hidden border-2 border-darkblue text-darkblue hover:bg-darkblue hover:text-light400"
                btn-name-class="font-bold "
              />
            </footer>
          </div>
        </template>
      </h-dialog>
      <!--  -->
    </div>
  </div>
</template>
<script setup lang="ts">
import fetchAllDelivery from "@/apollo/query/delivery/fetchAllDelivery.gql";
import fetchLocation from "@/apollo/query/location.gql";
import add_delivery from "~/apollo/mutation/delivery/add_delivery.gql";
import update_delivery from "~/apollo/mutation/delivery/update_delivery.gql";
import delete_delivery from "~/apollo/mutation/delivery/delete_delivery.gql";
import { useAuth } from "~/store/auth";
const showModal = ref<boolean>(false);
const showDialog = ref(false);
const isDialogForAdd = ref(true);
const imgAddress = ref<string>();
const description = ref<string>();
const show_confirm_action = ref(false);
const loading = ref(false);
const { uid } = useAuth();
const success = ref(false);
const show_notification = ref(false);
const message = ref("");
const selected_delivery_id: any = ref(null);
const delivery_user_id: any = ref(null);

const deliveries = ref<
  Array<{
    id: number;
    created_at: string;
    name: string;
    description: string;
    street_address: string;
    license: string;
    tin_number: string;
    zip_code: string;
    user: {
      id: String;
      first_name: string;
      last_name: string;
      phone_number: string;
      email: string;
      managed_by: {
        id: String;
        first_name: string;
        last_name: string;
        phone_number: string;
        email: string;
      };
    };
    sub_city: {
      name: {
        to: { name: string; language_type: string }[];
      };
      region_city: {
        name: {
          to: { name: string; language_type: string }[];
        };
      };
    };
  }>
>([]);

const {
  mutate: addDelivery,
  onDone: onAddDeliveryDone,
  onError: onAddDeliveryError,
} = useCustomMutation(add_delivery);
const {
  mutate: updateDelivery,
  onDone: onUpdateDelivery,
  onError: onUpdateDeliveryError,
} = useCustomMutation(update_delivery);
const {
  mutate: deleteDelivery,
  onDone: onDeleteDeliveryDone,
  onError: onDeleteDeliveryError,
} = useCustomMutation(delete_delivery);

definePageMeta({
  layout: "custom",
});

const headers: Array<string> = [
  "Id",
  "TinNumber",
  "Name",
  "OwnerName",
  "OwnerPhoneNumber",
  "OwnerEmail",
  "City",
  "SubCity",
  "StreetAddress",
  "Created_By",
  "Action",
];

const tableData = computed(() => {
  if (deliveries.value.length) {
    return deliveries.value.map((value) => {
      return {
        id: value.id,
        name: value.name,
        description: value.description,
        license: value.license,
        tin_number: value.tin_number,
        created_at: value.created_at,
        street_address: value.street_address,
        zip_code: value.zip_code,
        owner_name: value.user.first_name + " " + value.user.last_name,
        owner_phone: value.user.phone_number,
        owner_email: value.user.email,
        city: value.sub_city.name.to[1].name,
        sub_city: value.sub_city.region_city.name.to[1].name,
        managed_by:
          value?.user?.managed_by?.first_name +
          " " +
          value?.user?.managed_by?.last_name,
      };
    });
  } else return null;
});

const searchString = ref<string>("");

const variable = computed(() => {
  return {
    where: {
      ...(searchString.value
        ? {
            _or: [
              { name: { _iregex: searchString.value } },
              { tin_number: { _iregex: searchString.value } },
              { street_address: { _iregex: searchString.value } },
              {
                user: {
                  _or: [
                    { first_name: { _iregex: searchString.value } },
                    { last_name: { _iregex: searchString.value } },
                    { email: { _iregex: searchString.value } },
                  ],
                },
              },
            ],
          }
        : {}),
    },
  };
});

const {
  onResult: onFetchAllDeliveryResult,
  onError: onFetchAllDeliveryError,
  loading: onFetchAllDeliveryLoading,
  refetch: refetchDelivery,
} = useCustomQuery(fetchAllDelivery, variable, 500);

onFetchAllDeliveryResult((data) => {
  deliveries.value = data.data.delivery_delivery_provider;
});

onFetchAllDeliveryError((error) => {
  console.log(error);
});

const _cityList = ref<
  Array<{
    id: number;
    name: { to: { name: string }[] };
    sub_cities: {
      id: number;
      name: { to: { name: string }[] };
    }[];
  }>
>([]);

const {
  onResult: onFetchLocationResult,
  onError: onFetchLocationError,
  loading: onFetchLocationLoading,
} = useCustomQuery(fetchLocation);

onFetchLocationResult((data) => {
  _cityList.value = data.data.city;
});

const cityList = ref<
  | Array<{
      id: number;
      name: string;
      sub_cities: {
        id: number;
        name: string;
      }[];
    }>
  | undefined
>([]);

const subCityList = ref<
  | Array<{
      id: number;
      name?: string | undefined;
    }>
  | undefined
>();

watchEffect(() => {
  if (_cityList.value.length > 0) {
    cityList.value = _cityList.value.map((city) => {
      return {
        id: city.id,
        name: city.name.to[1].name,
        sub_cities: city.sub_cities.map((sub_city) => {
          return { id: sub_city.id, name: sub_city.name.to[1].name };
        }),
      };
    });
  }
});

onFetchLocationError((error) => {
  console.log(error);
});

const showDetailRow = (value: any) => {
  const selectedRow = tableData.value?.filter((v) => v.id === Number(value))[0];
  imgAddress.value = selectedRow?.license || "";
  description.value = selectedRow?.description || "";
  showModal.value = true;
};

const initialValue = ref();

const actionSelect = (actionObj: { id: { id: number }; action: string }) => {
  const selectedDelivery = deliveries.value.find((delivery) => {
    return delivery.id === actionObj.id.id;
  });
  delivery_user_id.value = selectedDelivery?.user?.id;
  if (actionObj.action === "Edit") {
    selected_delivery_id.value = selectedDelivery?.id;

    regionAt.value = cityList.value?.find((city) => {
      return (
        city.name === selectedDelivery?.sub_city.region_city.name.to[1].name
      );
    });

    subCityAt.value = regionAt.value?.sub_cities.find((sub_city) => {
      return sub_city.name === selectedDelivery?.sub_city.name.to[1].name;
    });

    initialValue.value = {
      first_name: selectedDelivery?.user.first_name,
      last_name: selectedDelivery?.user.last_name,
      company_name: selectedDelivery?.name,
      email: selectedDelivery?.user.email,
      phone_number: selectedDelivery?.user.phone_number,
      tin_number: selectedDelivery?.tin_number,
      company_detail: selectedDelivery?.description,
      license: selectedDelivery?.license,
      region_or_administration:
        selectedDelivery?.sub_city.region_city.name.to[1].name,
      sub_city: selectedDelivery?.sub_city.name.to[1].name,
      street_address: selectedDelivery?.street_address,
      zip_code: selectedDelivery?.zip_code,
    };
    isDialogForAdd.value = false;
    showDialog.value = true;
  } else if (actionObj?.action === "Delete") {
    show_confirm_action.value = true;
  }
};

const confirmAction = (value: any) => {
  if (value === false) {
    show_confirm_action.value = false;
  } else {
    const { accept } = value;
    if (accept == true) {
      loading.value = true;
      show_confirm_action.value = false;
      deleteDelivery({
        user_id: delivery_user_id.value,
      });
    }
  }
  console.log(value);
};

const regionAt = ref<{
  id: number;
  name?: string;
  sub_cities: {
    id: number;
    name?: string;
  }[];
}>();

const subCityAt = ref<
  | {
      id: number;
      name?: string;
    }
  | undefined
>();
watch(regionAt, (newValue) => {
  subCityList.value = newValue?.sub_cities;
});

onAddDeliveryDone((result) => {
  success.value = true;
  show_notification.value = true;
  message.value = "Delivery successfully add";
  loading.value = false;
  showDialog.value = false;
  refetchDelivery();
});

onAddDeliveryError((error) => {
  success.value = true;
  show_notification.value = true;
  message.value = error?.message;
  loading.value = false;
});

onUpdateDelivery((result) => {
  success.value = true;
  show_notification.value = true;
  message.value = "Delivery successfully Updated";
  loading.value = false;
  showDialog.value = false;
  refetchDelivery();
});

onUpdateDeliveryError((error) => {
  success.value = false;
  show_notification.value = true;
  message.value = error?.message;
  loading.value = false;
});

onDeleteDeliveryDone((result) => {
  success.value = true;
  show_notification.value = true;
  message.value = "Delivery successfully Deleted";
  loading.value = false;
  showDialog.value = false;
  refetchDelivery();
});

onDeleteDeliveryError((error) => {
  success.value = false;
  show_notification.value = true;
  message.value = error?.message;
  loading.value = false;
});

const { uploadImages } = useUploadFile();

const handleAddDeliveryForm = async (value: any) => {
  loading.value = true;
  const { error, urls } = await uploadImages(value?.license, "/license");
  if (isDialogForAdd.value) {
    if (urls?.length > 0) {
      addDelivery({
        value: {
          first_name: value?.first_name,
          last_name: value?.last_name,
          email: value?.email,
          phone_number: value?.phone_number,
          license: urls[0],
          manager_id: uid,
          street_address: value?.street_address,
          sub_city_id: value?.sub_city?.id,
          tin_number: value?.tin_number,
          zip_code: value?.zip_code,
          campany_name: value?.company_name,
          campany_detail: value?.company_detail,
        },
      });
    } else {
      loading.value = false;
      success.value = false;
      show_notification.value = true;
      message.value = "image upload error Please try again";
    }
  } else {
    if (typeof value?.license == "string") {
      const setvalue = {
        update_delivery: {
          name: value?.company_name,
          description: value?.company_detail,
          license: value?.license,
          sub_city_id: value?.sub_city?.id,
          street_address: value?.street_address,
          zip_code: value?.zip_code,
          tin_number: value?.tin_number,
        },
        updateUser: {
          first_name: value?.first_name,
          last_name: value?.last_name,
          email: value?.email,
          manager_id: uid,
          phone_number: value?.phone_number,
        },
        user_id: delivery_user_id?.value,
        delivery_id: selected_delivery_id?.value,
      };
      console.log(
        selected_delivery_id?.value,
        "-----------",
        delivery_user_id?.value,
        "..................."
      );

      updateDelivery(setvalue);
      //code with update
    } else {
      const { error, urls } = await uploadImages(value?.license, "/license");
      if (urls?.length > 0) {
        const setvalue = {
          update_delivery: {
            name: value?.company_name,
            description: value?.company_detail,
            license: urls[0],
            sub_city_id: value?.sub_city?.id,
            street_address: value?.street_address,
            zip_code: value?.zip_code,
            tin_number: value?.tin_number,
          },
          updateUser: {
            first_name: value?.first_name,
            last_name: value?.last_name,
            email: value?.email,
            manager_id: uid,
            phone_number: value?.phone_number,
          },
          user_id: delivery_user_id?.value,
          delivery_id: selected_delivery_id?.value,
        };

        updateDelivery(setvalue);
      } else {
        success.value = false;
        show_notification.value = true;
        message.value = "Image Upload Error Please Try again";
      }
    }
  }

  console.log({ value });
};
</script>
