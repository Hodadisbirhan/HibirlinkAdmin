<template>
  <div class="relative">
    <confirm-action
      v-if="showConfirmationModal"
      :reason="have_reason"
      @confirmation="confirmationAction"
    />
    <v-loading :show-loading="updating" loading-text="Updating. . ." />
    <div class="sticky top-14 bg-green1000 pb-1 z-40">
      <div class="flex w-full items-center justify-center my-2 relative">
        <div class="relative w-full md:w-1/2">
          <Icon
            name="ic:twotone-search"
            class="w-9 h-8 text-primary absolute top-1 left-1"
          />
          <input
            type="search"
            placeholder="Search by Product Name"
            class="pl-10 w-full border-[1px] rounded-md border-primary focus:border-[1px] focus:ring-0 outline-none ring-0"
            v-model="searchString"
          />
        </div>
      </div>
      <div class="flex items-center justify-center w-full mb-2">
        <div class="flex items-center flex-wrap gap-4 w-full lg:w-[90%] px-5">
          <v-select
            class="w-[150px]"
            label="Category"
            :items="categoryListItems"
            name="category"
            v-model="serviceCategory"
          />
          <v-select
            class="w-[150px]"
            label="Status"
            :items="['All', 'Pending', 'verified', 'suspended']"
            name="status"
            v-model="serviceReleaseStatus"
          />
          <v-select
            class="w-[150px]"
            label="Time"
            :items="[
              'All',
              'This week',
              'This month',
              'This year',
              'Before a year',
            ]"
            name="status"
            v-model="issueDate"
          />
        </div>
      </div>
    </div>
    <v-table
      v-if="services"
      class="pb-20"
      :headers="header"
      :loading="serviceLoading"
      :body="services"
      :item-i-d="itemId"
      header-class="py-2 px-2"
      @click:row="showDetail"
    >
      <template #date="{ item }">
        <div>
          {{ item.date }}
        </div>
      </template>
      <template #service_name="{ item }">
        <div>
          {{ item.title }}
        </div>
      </template>

      <template #service_owner="{ item }">
        <div>
          {{ item.owner }}
        </div>
      </template>
      <template #phone_number="{ item }">
        <div>
          {{ item.phone }}
        </div>
      </template>
      <template #category="{ item }">
        <div>
          {{ item.category }}
        </div>
      </template>

      <template #release_status="{ item }">
        <div
          class="w-fit rounded-lg"
          :class="
            item.release_status == 'pending'
              ? 'text-yellow-500 px-4 bg-yellow-300/10'
              : item.release_status == 'verified'
              ? 'text-primary px-4 bg-green400/10'
              : item.release_status == 'suspended'
              ? 'text-red px-4 bg-red/10'
              : ''
          "
        >
          {{ item.release_status }}
        </div>
      </template>
      <template #action="{ item }">
        <v-menu
          @click.stop="null"
          leading_icon="mdi:dots-horizontal"
          v-if="item.release_status == 'pending'"
          :menu="{
            actions: ['verify', 'reject'],
            id: { id: item.id, email: item.email },
          }"
          @option-clicked="actionSelect"
        />

        <v-menu
          @click.stop="null"
          v-if="item.release_status == 'verified'"
          leading_icon="mdi:dots-horizontal"
          :menu="{
            actions: ['reject'],
            id: { id: item.id, email: item.email },
          }"
          @option-clicked="actionSelect"
        />
      </template>
    </v-table>
    <div
      class="flex flex-row justify-center items-center w-full text-primary font-semibold"
      v-if="services?.length <= 0 && !serviceLoading"
    >
      No Result Found
    </div>
    <v-pagination
      :items-per-page="limit"
      :total-data="total_services"
      @update:offset="updateOffset"
    />
    <div
      v-if="showServiceDetail"
      class="fixed left-0 top-0 overflow-x-scroll overflow-y-scroll h-full transition-colors duration-1000 ease-in-out w-full bg-black/20 z-40 flex items-center justify-center"
    >
      <div
        class="bg-slate-50 shadow-md rounded-lg relative lg:max-w-[90%] text-gray py-10 px-8"
      >
        <XMarkIcon
          class="fill-red absolute top-4 right-3 w-8 h-8 cursor-pointer"
          @click="showServiceDetail = false"
        />
        <div class="my-4 flex gap-4 w-[90%]">
          <v-swiper :images="imageCollection" />

          <div class="w-full">
            <h1 class="text-green400 font-bold text-xl">
              {{ selectedService.title }}
            </h1>
            <p>
              {{
                selectedService.category.language.translation_contents[0].name
              }}
            </p>
            <p class="w-full text-sm">
              {{ serviceDescription }}
            </p>
          </div>
        </div>
        <div class="flex flex-wrap gap-8">
          <p class="font-semibold">
            <span class="text-blue-500">Service Owner</span> :
            {{ selectedService.supplier.userById.first_name }}
          </p>
          <p class="font-semibold">
            <span class="text-blue-500">Service Release Status</span> :
            {{ selectedService.release_status }}
          </p>
          <p class="font-semibold">
            <span class="text-blue-500">Issued Date</span> :
            {{ selectedService.created_at }}
          </p>
          <p class="font-semibold">
            <span class="text-blue-500">Web Link</span>
            {{ selectedService.web_link }}
          </p>

          <p class="font-semibold">
            <span class="text-blue-500">Reviewed By</span> :
            {{ selectedService.reviewer?.first_name ?? "-" }}
          </p>

          <p class="font-semibold">
            <span class="text-blue-500">Service License</span> :

            <span
              class="cursor-pointer"
              @click="
                selectedService?.license ? (showServiceLicense = true) : null
              "
              >{{ selectedService?.license ? "view" : "-" }}</span
            >
          </p>
        </div>
      </div>
    </div>
    <div
      v-if="showServiceLicense"
      class="fixed left-0 top-0 overflow-x-scroll overflow-y-scroll h-full transition-colors duration-1000 ease-in-out w-full bg-black/20 z-40 flex items-center justify-center"
    >
      <div
        class="bg-slate-50 shadow-md rounded-lg relative lg:max-w-[70%] max-h-[500px] text-gray py-10 px-8"
      >
        <XMarkIcon
          class="fill-red absolute top-4 right-3 w-8 h-8 cursor-pointer"
          @click="showServiceLicense = false"
        />
        <div class="h-[90%] w-full">
          <img
            :src="selectedService.license"
            alt=""
            srcset=""
            class="max-h-[400px] min-w-[350px] min-h-[400px] w-full my-4"
          />
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { EllipsisHorizontalIcon, XMarkIcon } from "@heroicons/vue/24/solid";
import fetchServices from "@/apollo/query/services/virtual/fetchService.gql";
import fetchCategory from "@/apollo/query/services/virtual/fetchCategory.gql";
import updateServiceStatus from "@/apollo/mutation/service/virtual/updateServiceStatus.gql";
import rejectService from "@/apollo/mutation/service/virtual/rejectService.gql";
import { useAuth } from "@/store/auth";
const store = useAuth();
const adminId = computed(() => {
  return store.$state.uid;
});

definePageMeta({
  layout: "custom",
});

const issueDate = ref();
const serviceReleaseStatus = ref();
const searchString = ref();
const serviceCategory = ref();

const limit = ref(20);
const offset = ref(0);
const itemId = ref([]);
const selectedService = ref();
const categoryListItems = ref([{ id: -1, name: "All" }]);
const have_reason = ref(false);
const updating = ref(false);
const time = computed(() => {
  const timeStamp = Date.now();
  const date = new Date(timeStamp);
  if (issueDate.value === "This week") return date.setDate(date.getDate() - 7);
  else if (issueDate.value === "This month")
    return date.setDate(date.getMonth() - 1);
  else if (issueDate.value === "This year")
    return date.setDate(date.getDate() - 365);
  else issueDate.value === "All";
  return null;
});
watch(
  [issueDate, serviceReleaseStatus, serviceCategory, searchString],
  ([date, releaseStatus, pc, ss]) => {
    offset.value = 0;
  }
);
const variable = computed(() => {
  return {
    offset: offset.value,
    limit: limit.value,
    where: {
      ...(serviceCategory.value && serviceCategory.value.id != -1
        ? {
            virtual_service_category: {
              id: { _eq: serviceCategory.value.id },
            },
          }
        : {}),

      ...(serviceReleaseStatus.value?.length > 0 &&
      serviceReleaseStatus.value != "All"
        ? {
            release_status: {
              _eq: serviceReleaseStatus.value + "".toLowerCase(),
            },
          }
        : {}),
      ...(time.value ? { created_at: { _gt: new Date(time.value) } } : {}),
      ...(searchString.value
        ? {
            _or: [
              {
                title: {
                  _iregex: searchString.value.trim(),
                },
              },

              {
                release_status: {
                  _iregex: searchString.value.trim(),
                },
              },

              {
                virtual_service_category: {
                  original_language: {
                    translation_contents: {
                      _and: [
                        {
                          language_type: { _eq: "en" },
                          name: { _iregex: searchString.value.trim() },
                        },
                      ],
                    },
                  },
                },
              },
            ],
          }
        : {}),
    },
  };
});

const {
  result: service_result,
  onError: onServiceError,
  refetch: refetchService,
  loading: serviceLoading,
} = useCustomQuery(fetchServices, variable, 500);

const { result: category_result, onError: onCategoryError } =
  useCustomQuery(fetchCategory);

watch(category_result, (newValue) => {
  if (newValue?.category)
    newValue.category.map((cat) => {
      categoryListItems.value.push({
        id: cat.id,
        name: cat.language.en[0].name,
      });
    });
});
onServiceError((error) => {
  console.log(error);
});

const {
  mutate: updateStatus,
  onError: updateStatusError,
  onDone: updateStatusDone,
} = useCustomMutation(updateServiceStatus);
const {
  mutate: rejectServiceMutation,
  onError: rejectServiceError,
  onDone: rejectServiceDone,
} = useCustomMutation(rejectService);

updateStatusError((error) => {
  updating.value = false;
  console.log("UPDATE STATUS ERROR", error);
});
updateStatusDone((result) => {
  updating.value = false;
  refetchService();
  console.log("UPDATE STATUS DONE",result);
});
rejectServiceError((error) => {
  updating.value = false;
  console.log("REJECT PRODUCT ERROR", error);
});
rejectServiceDone((result) => {
  updating.value = false;
  refetchService();
  console.log("REJECT PRODUCT DONE");
});

const header = [
  "date",
  "service_name",
  "service_owner",
  "phone_number",
  "category",
  "release_status",
  "action",
];

const services = computed(() => {
  return service_result.value?.services?.map((element) => {
    itemId.value.push(element.id);
    return {
      id: element.id,
      email: element.supplier.userById.email,
      date: element.created_at,
      title: element.title,
      owner: element.supplier.userById.first_name,
      phone: element.supplier.userById.phone_number,
      category: element.category.language.translation_contents[0].name,
      release_status: element.release_status,
    };
  });
});
const total_services = computed(() => {
  return service_result.value?.total?.service?.value;
});

const imageCollection = ref([]);
const serviceDescription = ref("");
const showServiceDetail = ref(false);
const showServiceLicense = ref(false);
const showDetail = (value) => {
  console.log(value);
  selectedService.value = service_result.value.services.find(
    (service) => service.id == value
  );
  if (selectedService.value) {
    imageCollection.value = [];
    serviceDescription.value = "";
    imageCollection.value.push(selectedService.value.logo);
    selectedService.value?.images?.map((images) => {
      imageCollection.value.push(images.url);
    });
    selectedService.value?.description?.ops?.map((text) => {
      serviceDescription.value += text.insert + " ";
    });
  }
  showServiceDetail.value = true;
};
const showConfirmationModal = ref(false);
const status = ref();
const actionSelect = (value) => {
  showConfirmationModal.value = true;

  if (value.action != "verify") have_reason.value = true;
  else have_reason.value = false;
  showConfirmationModal.value = true;
  status.value = value;
};
const confirmationAction = (response) => {
  showConfirmationModal.value = false;

  if (response.accept) {
    updating.value = true;
    if (status.value.action == "verify") {
    console.log(status.value.id.id,adminId.value);
      updateStatus({
        id: status.value.id.id,
        status: "verified",
        reviewer_id: adminId.value,
        input: {
          from: "hibirlink@gmail.com",
          to: status.value.id.email,
          subject: "Verification Alert",
          text: "Ur Product is now Visible to Audience",
        },
      });
    }
    if (status.value.action == "reject") {
      rejectServiceMutation({
        id: status.value.id.id,
        input: {
          from: "hibirlink@gmail.com",
          to: status.value.id.email,
          subject: "Reject Alert",
          text: "Ur account is rejected With a Reason " + response.reason,
        },
      });
    }
  }
};
const updateOffset = (value) => {
  offset.value = value;
};
</script>
