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
            class="w-7 h-7 text-primary absolute top-[0.5rem] left-1"
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
            v-model="supplierStatus"
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
    <div v-if="supplierLoading">Loading</div>

    <v-table
      v-if="suppliers"
      class="pb-20"
      :headers="header"
      :loading="supplierLoading"
      :body="suppliers"
      header-class="py-2 px-2"
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
      v-if="suppliers?.length <= 0 && !supplierLoading"
    >
      No Result Found
    </div>
    <v-pagination
      :items-per-page="limit"
      :total-data="total_supplier"
      @update:offset="updateOffset"
    />
  </div>
</template>
<script setup>
import supplierGql from "~/apollo/query/supplier/fetchSuppliers.gql";
import updateSupplierStatus from "@/apollo/mutation/updateSupplierStatus.gql";
import rejectSupplier from "@/apollo/mutation/rejectSupplier.gql";
import { useAuth } from "@/store/auth";
const store = useAuth();
const adminId = computed(() => {
  return store.$state.uid;
});

definePageMeta({
  layout: "custom",
});
const itemId = ref([1, 2, 3]);
const supplierStatus = ref("");
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
  "tnt",
  "status",
  "reviewed_by",
  "action",
];
watch(
  [issueDate, supplierStatus, searchString],
  ([date, releaseStatus, ss]) => {
    offset.value = 0;
  }
);
const variable = computed(() => {
  return {
    offset: offset.value,
    limit: limit.value,
    where: {
      ...(supplierStatus.value && supplierStatus.value != "All"
        ? { userById: { status: { _eq: supplierStatus.value } } }
        : {}),
      ...(time.value ? { created_at: { _gt: new Date(time.value) } } : {}),
      ...(searchString.value
        ? {
            _or: [
              {
                userById: {
                  first_name: { _iregex: searchString.value.trim() },
                },
              },

              {
                userById: {
                  last_name: { _iregex: searchString.value.trim() },
                },
              },
              {
                userById: {
                  email: { _iregex: searchString.value.trim() },
                },
              },
              {
                userById: {
                  phone_number: { _iregex: searchString.value.trim() },
                },
              },
              {
                tin_number: { _iregex: searchString.value.trim() },
              },
            ],
          }
        : {}),
    },
  };
});

const {
  result: supplier_result,
  error: supplier_error,
  onError: onSupplierError,
  refetch: refetchSupplier,
  loading: supplierLoading,
} = useCustomQuery(supplierGql, variable, 500);

const {
  mutate: updateStatus,
  onError: updateStatusError,
  onDone: updateStatusDone,
} = useCustomMutation(updateSupplierStatus);
const {
  mutate: rejectSupplierMutation,
  onError: rejectSupplierError,
  onDone: rejectSupplierDone,
} = useCustomMutation(rejectSupplier);

updateStatusError((error) => {
  updating.value = false;
  console.log("UPDATE STATUS ERROR", error);
});
updateStatusDone((result) => {
  updating.value = false;
  refetchSupplier();
  console.log("UPDATE STATUS DONE");
});
rejectSupplierError((error) => {
  updating.value = false;
  console.log("REJECT SUPPLIER ERROR", error);
});
rejectSupplierDone((result) => {
  updating.value = false;
  refetchSupplier();
  console.log("REJECT SUPPLIER DONE");
});
const suppliers = computed(() => {
  return supplier_result.value?.supplier?.map((element) => {
    return {
      id: element.id,
      date: formatDate(element.created_at),
      name: element.userById?.first_name + " " + element.userById?.last_name,
      email: element.userById?.email,
      phone: element.userById?.phone_number,
      tnt: element.tin_number,
      status: element.userById?.status ?? "pending",
      reviewed_by: element.userById.reviewed_by?.first_name ?? "-",
    };
  });
});
const total_supplier = computed(() => {
  return supplier_result.value?.total?.supplier?.value;
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
        supplier_id: status.value.id.id,
        status: "verified",
        reason: response.reason,
        reviewer_id: adminId.value,
        input: {
          from: "hibirlink@gmail.com",
          to: status.value.id.email,
          subject: "Verification Alert",
          text: "Ur Account is Verified..now u can do what ever u like",
        },
      });
    }
    if (status.value.action == "suspend") {
      updateStatus({
        supplier_id: status.value.id.id,
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
        supplier_id: status.value.id.id,
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
      rejectSupplierMutation({
        supplier_id: status.value.id.id,
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
onSupplierError((error) => {
  console.log(error);
});
const updateOffset = (value) => {
  offset.value = value;
};
</script>
