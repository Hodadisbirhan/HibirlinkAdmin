<template>
  <div class="relative">
    <confirm-action
      v-if="showConfirmationModal"
      :reason="have_reason"
      @confirmation="confirmationAction"
    />
    <v-loading :show-loading="updating" loading-text="Updating. . ." />
    <div
      class="sticky top-0 bg-light400 pb-1 z-40 flex items-center justify-center flex-row-reverse my-2"
    >
      <div class="flex w-full items-center justify-center my-2 relative">
        <div class="relative w-full">
          <Icon
            name="ic:twotone-search"
            class="w-9 h-8 text-primary absolute top-1 left-1"
          />
          <input
            type="search"
            placeholder="Search by Supplier Name , Phone Number , Email , Tin Number"
            class="pl-10 w-full border-[1px] rounded-md border-primary focus:border-[1px] focus:ring-0 outline-none ring-0"
            v-model="searchString"
          />
        </div>
      </div>

      <div class="flex items-center justify-center w-full mb-2">
        <div class="flex items-center flex-wrap gap-4 w-full lg:w-[90%] px-5">
          <v-select
            class="w-[150px]"
            label="Status"
            :items="['All', 'pending', 'verified', 'suspended']"
            name="status"
            v-model="storeStatus"
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
    <div v-if="storeLoading">Loading</div>

    <v-table
      v-if="stores"
      class="pb-20"
      :headers="header"
      :loading="storeLoading"
      :body="stores"
      header-class="py-2 px-2"
      @click:row="showDetail"
      :item-i-d="itemId"
    >
      <template #date="{ item }">
        <div>
          {{ item.date }}
        </div>
      </template>
      <template #name="{ item }">
        <div>
          {{ item.name }}
        </div>
      </template>

      <template #email="{ item }">
        <div>
          {{ item.email }}
        </div>
      </template>
      <template #phone="{ item }">
        <div>
          {{ item.phone }}
        </div>
      </template>
      <template #tnt="{ item }">
        <div>
          {{ item.tnt }}
        </div>
      </template>
      <template #status="{ item }">
        <div
          class="w-fit rounded-lg"
          :class="
            item.status == 'pending'
              ? 'text-yellow-500 px-4 bg-yellow-300/10'
              : item.status == 'verified'
              ? 'text-primary px-4 bg-primary/10'
              : item.status == 'suspended'
              ? 'text-red px-4 bg-red/10'
              : ''
          "
        >
          {{ item.status }}
        </div>
      </template>
      <template #reviewed_by="{ item }">
        <div>
          {{ item.reviewed_by }}
        </div>
      </template>
      <template #action="{ item }">
        <v-menu
          @click.stop="null"
          leading_icon="mdi:dots-horizontal"
          v-if="item.status == 'pending'"
          :menu="{
            actions: ['verify', 'reject'],
            id: { id: item.id, email: item.email },
          }"
          @option-clicked="actionSelect"
        />
        <v-menu
          @click.stop="null"
          v-if="item.status == 'suspended'"
          leading_icon="mdi:dots-horizontal"
          :menu="{
            actions: ['release', 'reject'],
            id: { id: item.id, email: item.email },
          }"
          @option-clicked="actionSelect"
        />
        <v-menu
          @click.stop="null"
          v-if="item.status == 'verified'"
          leading_icon="mdi:dots-horizontal"
          :menu="{
            actions: ['suspend', 'reject'],
            id: { id: item.id, email: item.email },
          }"
          @option-clicked="actionSelect"
        />
      </template>
    </v-table>
    <div
      class="flex flex-row justify-center items-center w-full text-primary font-semibold"
      v-if="stores?.length <= 0 && !storeLoading"
    >
      No Result Found
    </div>
    <v-pagination
      :items-per-page="limit"
      :total-data="total_store"
      @update:offset="updateOffset"
    />
    <div
      v-if="showStoreDetail"
      class="fixed left-0 top-0 overflow-x-scroll overflow-y-scroll h-full transition-colors duration-1000 ease-in-out w-full bg-black/20 z-40 flex items-center justify-center"
    >
      <div
        class="bg-slate-50 shadow-md rounded-lg relative lg:max-w-[90%] text-gray py-10 px-8"
      >
        <XMarkIcon
          class="fill-red absolute top-4 right-3 w-8 h-8 cursor-pointer"
          @click="showStoreDetail = false"
        />
        <div class="py-4 flex gap-5">
          <div>
            <img
              :src="selectedStore.licence"
              alt=""
              srcset=""
              class="w-[350px] h-[350px]"
            />
          </div>
          <div class="flex flex-col justify-between">
            <p>
              <span class="font font-semibold text-primary">Store Name</span>
              {{ " :- " + selectedStore.name }}
            </p>
            <p>
              <span class="font font-semibold text-primary">Created At</span>
              {{ " :- " + selectedStore.created_at }}
            </p>
            <p>
              <span class="font font-semibold text-primary"
                >Release Status</span
              >
              {{ " :- " + selectedStore.release_status }}
            </p>
            <p>
              <span class="font font-semibold text-primary">Reviewed By</span>
              {{ " :- " + selectedStore.reviewer?.first_name ?? "-" }}
            </p>

            <p>
              <span class="font font-semibold text-primary">Phone Number</span>
              {{ " :- " + selectedStore.phone_number }}
            </p>
            <p>
              <span class="font font-semibold text-primary">Email</span>
              {{ " :- " + selectedStore.supplier.userById.email }}
            </p>
            <p>
              <span class="font font-semibold text-primary"
                >Main Selling Category</span
              >
              {{ " :- " + selectedStore.category }}
            </p>
            <p>
              <span class="font font-semibold text-primary"
                >Bank Account Number</span
              >
              {{ " :- " + selectedStore.bank_account.account_number }}
            </p>
            <p>
              <span class="font font-semibold text-primary"
                >Bank Account Holder</span
              >
              {{
                " :- " +
                selectedStore.bank_account.first_name +
                " " +
                selectedStore.bank_account.last_name
              }}
            </p>
            <p>
              <span class="font font-semibold text-primary">Description</span>
              {{ " :- " + selectedStore.description }}
            </p>
          </div>
        </div>
      </div>
    </div>
    <div
      v-if="showStoreLicense"
      class="fixed left-0 top-0 overflow-x-scroll overflow-y-scroll h-full transition-colors duration-1000 ease-in-out w-full bg-black/20 z-40 flex items-center justify-center"
    >
      <div
        class="bg-slate-50 shadow-md rounded-lg relative lg:max-w-[70%] max-h-[500px] text-gray py-10 px-8"
      >
        <XMarkIcon
          class="fill-red absolute top-4 right-3 w-8 h-8 cursor-pointer"
          @click="showStoreLicense = false"
        />
        <!-- <div class="h-[90%] w-full">
          <img
            :src="selectedStore.license"
            alt=""
            srcset=""
            class="max-h-[400px] min-w-[350px] min-h-[400px] w-full my-4"
          />
        </div> -->
      </div>
    </div>
  </div>
</template>
<script setup>
import { XMarkIcon } from "@heroicons/vue/24/solid";
import storeGql from "~/apollo/query/store/fetchStore.gql";
import updateStoreStatus from "@/apollo/mutation/store/updateStoreStatus.gql";
import rejectStore from "@/apollo/mutation/store/rejectStore.gql";
import { useAuth } from "@/store/auth";
const store = useAuth();
const adminId = computed(() => {
  return store.$state.uid;
});

definePageMeta({
  layout: "custom",
});
const itemId = ref([]);
const showStoreDetail = ref(false);
const showStoreLicense = ref(false);
const storeStatus = ref("");
const issueDate = ref();
const searchString = ref("");
const limit = ref(20);
const offset = ref(0);
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

const header = [
  "date",
  "name",
  "email",
  "phone",
  "status",
  "reviewed_by",
  "action",
];
watch([issueDate, storeStatus, searchString], ([date, releaseStatus, ss]) => {
  offset.value = 0;
});
const variable = computed(() => {
  return {
    limit: limit.value,
    offset: offset.value,
    where: {
      ...(storeStatus.value?.length > 0 && storeStatus.value != "All"
        ? { status: { _eq: storeStatus.value } }
        : {}),
      ...(time.value ? { created_at: { _gt: new Date(time.value) } } : {}),
      ...(searchString.value
        ? {
            _or: [
              {
                name: { _iregex: searchString.value.trim() },
              },
              {
                status: { _iregex: searchString.value.trim() },
              },
              {
                category: { _iregex: searchString.value.trim() },
              },
              {
                phone_number: { _iregex: searchString.value.trim() },
              },

              {
                supplier: {
                  userById: {
                    email: { _iregex: searchString.value.trim() },
                  },
                },
              },
            ],
          }
        : {}),
    },
  };
});
const selectedStore = ref();
const showDetail = (value) => {
  selectedStore.value = store_result.value?.store?.find(
    (store) => store.id == value
  );
  if (selectedStore.value?.id) {
    showStoreDetail.value = true;
  }
};
const {
  result: store_result,
  error: store_error,
  onError: onStoreError,
  refetch: refetchStore,
  loading: storeLoading,
} = useCustomQuery(storeGql, variable, 500);

const {
  mutate: updateStatus,
  onError: updateStatusError,
  onDone: updateStatusDone,
} = useCustomMutation(updateStoreStatus);
const {
  mutate: rejectStoreMutation,
  onError: rejectStoreError,
  onDone: rejectStoreDone,
} = useCustomMutation(rejectStore);

updateStatusError((error) => {
  updating.value = false;
  console.log("UPDATE STATUS ERROR", error);
});
updateStatusDone((result) => {
  updating.value = false;
  refetchStore();
  console.log("UPDATE STATUS DONE");
});
rejectStoreError((error) => {
  updating.value = false;
  console.log("REJECT STORE ERROR", error);
});
rejectStoreDone((result) => {
  updating.value = false;
  refetchStore();
  console.log("REJECT STORE DONE");
});
const stores = computed(() => {
  itemId.value = [];
  return store_result.value?.store?.map((element) => {
    itemId.value.push(element.id);
    return {
      id: element.id,
      date: element.created_at,
      name: element.name,
      email: element.supplier.userById?.email,
      phone: element.phone_number,
      status: element.release_status,
      reviewed_by: element.reviewer?.first_name ?? "-",
    };
  });
});
const total_store = computed(() => {
  return store_result.value?.total?.store?.value;
});

const showConfirmationModal = ref(false);
const status = ref();
const actionSelect = (value) => {
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
      updateStatus({
        store_id: status.value.id.id,
        status: "verified",
        reason: response.reason,
        reviewer_id: adminId.value,
        input: {
          from: "hibirlink@gmail.com",
          to: status.value.id.email,
          subject: "Verification Alert",
          text: "Ur Store is Verified..now u can do what ever u like",
        },
      });
    }
    if (status.value.action == "suspend") {
      updateStatus({
        store_id: status.value.id.id,
        status: "suspended",
        reason: response.reason,
        reviewer_id: adminId.value,
        input: {
          from: "hibirlink@gmail.com",
          to: status.value.id.email,
          subject: "Suspension Alert",
          text: "Ur account is Suspended With a Reason " + response.reason,
        },
      });
    }
    if (status.value.action == "release") {
      updateStatus({
        store_id: status.value.id.id,
        status: "verified",
        reason: response.reason,
        reviewer_id: adminId.value,
        input: {
          from: "hibirlink@gmail.com",
          to: status.value.id.email,
          subject: "Suspension Release Alert",
          text: "Ur account is released With a Reason " + response.reason,
        },
      });
    }
    if (status.value.action == "reject") {
      rejectStoreMutation({
        store_id: status.value.id.id,
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
onStoreError((error) => {
  console.log(error);
});
const updateOffset = (value) => {
  offset.value = value;
};
</script>
