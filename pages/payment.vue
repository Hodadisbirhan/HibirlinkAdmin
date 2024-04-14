<template>
  <div
    class="w-full mx-auto px-8 flex-col flex gap-5 my-7 overflow-x-auto mb-[2rem]"
  >
    <div v-if="loading && firstTime" class="w-full py-2">
      <h-loading class="w-full" :show-loading="loading"></h-loading>
    </div>

    <div v-else class="w-full flex gap-5 flex-wrap">
      <!--  -->
      <div class="flex w-full items-center justify-center my-1 relative">
        <div class="relative w-full">
          <Icon
            name="ic:twotone-search"
            class="w-5 h-5 text-primary absolute top-3 left-2"
          />
          <input
            type="search"
            placeholder="Search By ..."
            class="pl-8 w-full placeholder:text-sm border-[1px] rounded-md border-primary focus:border-[1px] focus:ring-0 outline-none ring-0"
            v-model="searchString"
          />
        </div>
      </div>
      <!--  -->

      <div
        v-if="storeData?.length <= 0 && !loading"
        class="w-full flex flex-row justify-center items-center text-lg font-semibold text-primaryvar2"
      >
        No Result is found
      </div>

      <NuxtLink
        class="w-[20rem] px-5 py-3 text-dark300/60 relative rounded-md drop-shadow-sm bg-light150/30 flex flex-col justify-center items-center gap-2 hover:cursor-pointer border-2 border-primary/20 hover:border-primaryvar1"
        v-for="store_data in storeData"
        :key="store_data.id"
        :to="{
          name: 'storeDetail-storeId',
          params: { storeId: store_data.id },
        }"
      >
        <div class="flex flex-col w-full items-center justify-center">
          <Icon name="uil:store" class="w-[4rem] text-primaryvar3 h-[4rem]" />
        </div>
        <h2 class="text-lg font-bold text-primaryvar4 capitalize">
          {{ store_data.name }}
        </h2>
        <span
          >Supplier: {{ store_data.supplier.userById.first_name }}
          {{ store_data.supplier.userById.last_name }}</span
        >
        <span
          >Account Number: {{ store_data.bank_account.account_number }}</span
        >
        <span>Bank Type : {{ store_data.bank_account.bank_type }}</span>

        <span
          v-if="store_data?.delivered_product"
          class="text-sm font-semibold py-1 px-2 bg-primaryvar8 text-primary rounded-md flex justify-center items-center"
          >New Delivered {{ store_data?.delivered_product }} product Type</span
        >
      </NuxtLink>
    </div>

    <hr class="h-[0.1rem] w-full bg-slate" />
  </div>
</template>

<script lang="ts" setup>
import fetchAllStores from "@/apollo/query/payment/fetchStores.gql";
const searchString = ref<string>("");
const firstTime = ref(true);

interface StoreInterface {
  id: number;
  name: string;
  delivered_product: any;
  bank_account: {
    account_number: string;
    bank_type: string;
  };
  supplier: {
    userById: {
      first_name: string;
      last_name: string;
    };
  };
}

const variable = computed(() => {
  return {
    where: {
      delivered_product: { _gt: 0 },
      ...(searchString.value
        ? {
            _or: [
              { name: { _iregex: searchString.value } },
              {
                supplier: {
                  userById: {
                    _or: [
                      { first_name: { _iregex: searchString.value } },
                      { last_name: { _iregex: searchString.value } },
                    ],
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
  onResult: onFetchAllStoresResult,
  onError: onFetchAllStoresError,
  loading,
} = useCustomQuery(fetchAllStores, variable);

const storeData = ref<Array<StoreInterface>>([]);
onFetchAllStoresResult((result) => {
  storeData.value = result.data.store;
  console.log(storeData.value);
  firstTime.value = false;
});

onFetchAllStoresError((error) => {
  console.log(error);
  firstTime.value = false;
});

const headers: Array<{ text: string; value: string }> = [
  {
    text: "order id",
    value: "order_id",
  },
  {
    text: "transaction key",
    value: "transaction_key",
  },
  {
    text: "quantity",
    value: "quantity",
  },
  {
    text: "total price",
    value: "total_price",
  },
  {
    text: "account number",
    value: "account_number",
  },

  {
    text: "status",
    value: "status",
  },
];

const data = [
  {
    order_id: "TXF123XZ",
    transaction_key: "92B314ED6AA8C",
    quantity: 34,
    total_price: "6,547 ETB",
    status: "Completed",
    account_number: "100096814465",
  },
  {
    order_id: "TXF123XZ",
    transaction_key: "92B314ED6AA8C",
    quantity: 34,
    total_price: "6,547 ETB",
    status: "Completed",
    account_number: "100096814465",
  },
  {
    order_id: "TXF123XZ",
    transaction_key: "92B314ED6AA8C",
    quantity: 34,
    total_price: "6,547 ETB",
    status: "Completed",
    account_number: "100096814465",
  },
  {
    order_id: "TXF123XZ",
    transaction_key: "92B314ED6AA8C",
    quantity: 34,
    total_price: "6,547 ETB",
    status: "Completed",
    account_number: "100096814465",
  },
  {
    order_id: "TXF123XZ",
    transaction_key: "92B314ED6AA8C",
    quantity: 34,
    total_price: "6,547 ETB",
    status: "Completed",
    account_number: "100096814465",
  },
  {
    order_id: "TXF123XZ",
    transaction_key: "92B314ED6AA8C",
    quantity: 34,
    total_price: "6,547 ETB",
    status: "Completed",
    account_number: "100096814465",
  },
];

const showDetailRow = (value: any) => {
  console.log(value);
};

definePageMeta({
  layout: "custom",
});
</script>
