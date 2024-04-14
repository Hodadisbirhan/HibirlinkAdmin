<template>
  <div>
    <div class="w-full flex gap-2">
      <div
        class="w-[20%] flex flex-col gap-2 pt-1 sticky top-0 h-[calc(100vh-3.5rem)] overflow-y-auto bg-light200/40 px-2 border-r"
      >
        <p class="font-bold text-lg">Customers</p>
        <div class="flex w-full items-center justify-center relative">
          <div class="relative w-full">
            <Icon
              name="ic:twotone-search"
              class="w-5 h-5 text-primary absolute top-3 left-2"
            />
            <input
              type="search"
              placeholder="Search"
              class="pl-8 w-full placeholder:text-sm border-[1px] border-primary focus:border-[1px] rounded-md focus:ring-0 outline-none ring-0"
              v-model="searchString"
            />
          </div>
        </div>
        <div class="flex gap-3 items-center ml-1 py-2">
          <div class="flex items-center gap-2">
            <input
              class="h-3 w-3 focus:ring-0"
              type="radio"
              name="status"
              id="all"
              value="all"
              v-model="withDelivery"
            />
            <label class="text-xs" for="all">All</label>
          </div>
          <div class="flex items-center gap-2">
            <input
              class="h-3 w-3 focus:ring-0"
              type="radio"
              name="status"
              id="self"
              value="false"
              v-model="withDelivery"
            />
            <label class="text-xs" for="self">Self</label>
          </div>
          <div class="flex items-center gap-2">
            <input
              class="h-3 w-3 focus:ring-0"
              type="radio"
              name="status"
              id="delivery"
              value="true"
              v-model="withDelivery"
            />
            <label class="text-xs" for="delivery">Delivery</label>
          </div>
        </div>

        <div class="flex flex-col gap-1">
          <div class="flex flex-col gap-6">
            <div v-if="onFetchCustomerLoading">Loading</div>
            <div v-if="allCustomers.length === 0 && !onFetchCustomerLoading">
              No customers found!
            </div>
            <div
              v-else-if="!onFetchCustomerLoading"
              class="flex flex-col gap-4"
            >
              <div
                class="flex gap-4 overflow-auto items-center rounded-md font-semibold transition-colors duration-300 ease-in-out px-2 py-1 hover:cursor-pointer"
                v-for="customers in allCustomers"
                :key="customers.customer_id"
                :class="[
                  customers.customer_id === currentOrderID
                    ? 'border-2 border-primary bg-primary text-light200'
                    : 'hover:bg-primaryvar5',
                ]"
                @click="() => updateCustomerID(customers.customer_id)"
              >
                <svg
                  :class="[
                    customers.customer_id === currentOrderID
                      ? '  fill-light200'
                      : 'fill-primary',
                  ]"
                  class="w-6 h-6"
                  viewBox="0 0 575.616 575.616"
                >
                  <g>
                    <g>
                      <path
                        d="M429.248,141.439C429.248,63.33,365.985,0,287.808,0c-78.109,0-141.439,63.33-141.439,141.439
			                   c0,78.11,63.33,141.439,141.439,141.439C365.988,282.878,429.248,219.549,429.248,141.439z M181.727,144.499
			                   c0,0-4.079-40.12,24.82-70.72c20.34,20.389,81.261,70.72,187.342,70.72c0,58.498-47.586,106.081-106.081,106.081
			                   S181.727,202.994,181.727,144.499z"
                      />
                      <path
                        d="M45.049,391.68v62.559v80.919c0,22.365,18.136,40.459,40.459,40.459h404.6c22.365,0,40.459-18.097,40.459-40.459v-80.919
			                   V391.68c0-44.688-36.193-80.919-80.919-80.919H377.91c-5.07,0-11.46,3.422-14.271,7.639l-70.735,99.982
			                   c-2.812,4.22-7.372,4.22-10.184,0l-70.738-99.986c-2.812-4.22-9.202-7.638-14.272-7.638h-71.742
			                   C81.319,310.758,45.049,346.991,45.049,391.68z"
                      />
                    </g>
                  </g>
                </svg>
                <div class="flex flex-col gap-[0.15rem]">
                  <p class="font-semibold">
                    To {{ customers.user.first_name }}
                    {{ customers.user.last_name }}
                  </p>
                  <p
                    class="text-xs"
                    :class="[
                      customers.customer_id === currentOrderID
                        ? '  text-light200'
                        : 'text-dark300/70',
                    ]"
                  >
                    Email: {{ customers.user.email }}
                  </p>
                  <p
                    class="text-xs"
                    :class="[
                      customers.customer_id === currentOrderID
                        ? '  text-light200'
                        : 'text-dark300/70',
                    ]"
                  >
                    Phone: {{ customers.user.phone_number }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-if="!currentOrderID" class="w-[80%] py-2">
        <p>Click one to See Detail</p>
      </div>

      <div v-else class="w-[80%] py-2">
        <div class="flex flex-col gap-5">
          <p
            class="font-bold text-lg"
            v-if="currentOrderID && !onFetchOrderDetailLoading"
          >
            {{ orders[0]?.user?.first_name ?? "No " }}
            {{ orders[0]?.user?.last_name ?? " Result Found" }}
          </p>
          <p class="font-bold text-lg" v-else>Customer Name</p>
        </div>

        <div class="flex gap-5 items-center w-full">
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
                class="pl-8 w-full placeholder:text-sm rounded-md border-[1px] border-primary focus:border-[1px] focus:ring-0 outline-none ring-0"
                v-model="searchString2"
              />
            </div>
          </div>

          <v-select
            class="w-[150px]"
            label="Order Status"
            :items="[
              'all',
              'completed',
              'delivered',
              'pending',
              'unpaid',
              'picked',
            ]"
            name="OrderStatus"
            v-model="orderStatus"
          />
        </div>

        <div v-if="currentOrderID && !onFetchOrderDetailLoading && !tableData">
          <h-empty content="No Result Found" content-class="mt-5"></h-empty>
        </div>
        <div
          v-if="currentOrderID && !onFetchOrderDetailLoading"
          class="mb-[3rem] py-3"
        >
          <div
            class="w-full mx-auto bg-light400 border-light200 rounded-md overflow-x-auto border mb-4"
            v-for="order in tableData"
            :key="order.order_id"
          >
            <div
              class="flex flex-col gap-0"
              v-if="order?.order_detail?.length > 0"
            >
              <!--  -->
              <div class="flex flex-wrap gap-3 bg-light200">
                <div
                  class="flex gap-4 py-2 px-4 rounded-md bg-gray-light bg-opacity-10 items-center"
                >
                  <Icon
                    name="material-symbols:calendar-month-sharp"
                    class="w-6 h-6 text-dark300/50"
                  ></Icon>
                  <div class="flex flex-col">
                    <p class="font-semibold">{{ formatDate(order.date) }}</p>
                    <p class="text-xs text-gray">Date Of Order</p>
                  </div>
                </div>
                <div
                  class="flex gap-4 py-2 px-4 rounded-md bg-gray-light bg-opacity-10 items-center"
                >
                  <Icon
                    name="material-symbols:supervised-user-circle-off-outline-rounded"
                    class="w-6 h-6 text-dark300/50"
                  ></Icon>
                  <div class="flex flex-col">
                    <p class="font-semibold">{{ order.transaction_key }}</p>
                    <p class="text-xs text-gray">
                      Order ID: {{ order.order_id }}
                    </p>
                  </div>
                </div>
                <div
                  v-if="order?.with_delivery"
                  class="flex gap-4 py-2 px-4 rounded-md bg-gray-light bg-opacity-10 items-center"
                >
                  <Icon
                    name="material-symbols:bluetooth-drive"
                    class="w-6 h-6 text-dark300/50"
                  ></Icon>
                  <div class="flex flex-col">
                    <p class="font-semibold">
                      {{ order.driver_name }}
                    </p>
                    <p class="text-xs text-gray">Driver Name</p>
                  </div>
                </div>

                <div
                  v-if="order?.with_delivery"
                  class="flex gap-4 py-2 px-4 rounded-md bg-gray-light bg-opacity-10 items-center"
                >
                  <Icon
                    name="material-symbols:phone-in-talk"
                    class="w-6 h-6 text-neutral200"
                  ></Icon>
                  <div class="flex flex-col">
                    <p class="font-semibold">
                      {{ order.driver_phone }}
                    </p>
                    <p class="text-xs text-gray">Driver phone number</p>
                  </div>
                </div>

                <div
                  class="flex gap-4 py-2 px-4 rounded-md bg-gray-light bg-opacity-10 items-center"
                >
                  <Icon
                    name="material-symbols:local-shipping-sharp"
                    class="w-6 h-6 text-dark300/50"
                  ></Icon>
                  <div class="flex flex-col">
                    <p class="font-semibold">{{ order.shipping_fee }} ETB</p>
                    <p class="text-xs text-gray">Shipping Fee</p>
                  </div>
                </div>
              </div>

              <!--  -->
              <div class="w-full -mt-2">
                <v-table
                  :body="order.order_detail"
                  :headers="headers"
                  header-class="px-7 py-2 bg-light200 text-dark300"
                  body-class="px-7 py-2 "
                  @click:row="showDetailRow"
                >
                  <template #Id="{ item }"> {{ item.id }} </template>

                  <template #ProductName="{ item }">
                    {{ item.product_name }}
                  </template>
                  <template #Seller="{ item }">
                    {{ item.seller }}
                  </template>

                  <template #StoreName="{ item }">
                    {{ item.store_name }}
                  </template>
                  <template #Quantity="{ item }">
                    {{ item.quantity }}
                  </template>

                  <template #SpecialDiscountRate="{ item }">
                    {{ item.special_discount_rate }}
                  </template>

                  <template #Price="{ item }">
                    {{ item.price }}
                  </template>
                  <template #Status="{ item }">
                    {{ item.status }}
                  </template>
                </v-table>
              </div>
            </div>
          </div>
        </div>
        <div v-else class="w-[80%] py-2">
          <h-loading
            class="w-full"
            :show-loading="onFetchOrderDetailLoading && is_refreshed"
          ></h-loading>
        </div>
        <div class="mb-[3rem]">
          <v-pagination
            :offset="offset"
            :total-data="total_order"
            :items-per-page="limit"
            @update:offset="updateOffset"
          />
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import fetchAllCustomers from "@/apollo/query/order/allCustomersWithOrder.gql";
import fetchOrderDetail from "@/apollo/query/order/orderDetail.gql";

const enable_query = ref(false);
const orderStatus = ref<string>("all");
const is_refreshed = ref(true);
const total_order = ref(0);
const limit = ref(3);
const offset = ref(0);

const orders = ref<
  Array<{
    shipping_fee: number;
    status: string;
    with_delivery: boolean;
    user: {
      first_name: string;
      last_name: string;
    };
    created_at: string;
    transaction_key: string;
    id: number;
    driver: {
      user: {
        first_name: string;
        last_name: string;
        phone_number: string;
      };
    };
    order_details: {
      quantity: number;
      status: string | null;
      unit_price: number;
      discount: number;
      special_discount_rate: number | null;
      physical_product: {
        id: number;
        title: string;
        store: {
          name: string;
          supplier: {
            info: {
              first_name: string;
              last_name: string;
              email: string;
              phone_number: string;
            };
          };
        };
      };
    }[];
  }>
>([]);
const searchService = (searchKey: string) => {
  console.log(searchKey);
};
definePageMeta({
  layout: "custom",
});

const headers: Array<string> = [
  "Id",
  "ProductName",
  "Seller",
  "StoreName",
  "Quantity",
  "SpecialDiscountRate",
  "Price",
  "Status",
];

const tableData = computed(() => {
  if (orders.value.length) {
    return orders.value.map((value) => {
      return {
        shipping_fee: value.shipping_fee,
        status: value?.status,
        date: value?.created_at,
        transaction_key: value?.transaction_key,
        order_id: value?.id,
        driver_name:
          value?.driver?.user?.first_name + value?.driver?.user?.last_name,
        driver_phone: value?.driver?.user.phone_number,
        order_detail: value?.order_details?.map((item) => {
          return {
            id: item.physical_product.id,
            product_name: item.physical_product.title,
            seller:
              item.physical_product.store.supplier.info.first_name +
              item.physical_product.store.supplier.info.last_name,
            store_name: item.physical_product.store.name,
            quantity: item.quantity,
            special_discount_rate: item.special_discount_rate
              ? item.special_discount_rate
              : "-",
            price: item.discount
              ? item.unit_price - (item.unit_price - item.discount)
              : item.unit_price,
            status: item.status ? item.status : "-",
          };
        }),
      };
    });
  } else return null;
});

const currentOrderID = ref<string | null>(null);
const searchString = ref<string>("");
const searchString2 = ref<string>("");
const withDelivery = ref("all");
const variable = computed(() => {
  return {
    where: {
      ...(withDelivery.value != "all"
        ? { with_delivery: { _eq: withDelivery.value } }
        : {}),
      ...(searchString.value
        ? {
            user: {
              _or: [
                { first_name: { _iregex: searchString.value } },
                { last_name: { _iregex: searchString.value } },
                { email: { _iregex: searchString.value } },
                { phone_number: { _iregex: searchString.value } },
              ],
            },
          }
        : {}),
    },
  };
});

const variable2 = computed(() => {
  return {
    limit: limit.value,
    offset: offset.value,

    order_detail_exp: {
      ...(orderStatus.value != "all"
        ? {
            status: { _eq: orderStatus.value },
          }
        : {}),
      ...(searchString2.value
        ? {
            _or: [
              {
                physical_product: {
                  title: { _iregex: searchString2.value },
                },
              },
              {
                physical_product: {
                  store: {
                    name: {
                      _iregex: searchString2.value,
                    },
                  },
                },
              },
              {
                physical_product: {
                  store: {
                    supplier: {
                      userById: {
                        _or: [
                          {
                            first_name: { _iregex: searchString2.value },
                          },
                          { last_name: { _iregex: searchString2.value } },
                        ],
                      },
                    },
                  },
                },
              },
            ],
          }
        : {}),
    },

    where: {
      customer_id: {
        _eq: currentOrderID.value,
      },
      _and: [
        withDelivery.value != "all"
          ? {
              with_delivery: { _eq: withDelivery.value },
            }
          : {},
      ],
    },
  };
});

watch(
  [searchString2, orderStatus, withDelivery, currentOrderID],
  ([s2, os, wd, cod]) => {
    console.log("djksjdks");
    console.log(cod, "dskjdks");
    offset.value = 0;
  }
);

const {
  onResult: onFetchCustomerResult,
  onError: onFetchCustomerError,
  loading: onFetchCustomerLoading,
} = useCustomQuery(fetchAllCustomers, variable);

const {
  onResult: onFetchOrderDetailResult,
  onError: onFetchOrderDetailError,
  loading: onFetchOrderDetailLoading,
} = useCustomQuery(fetchOrderDetail, variable2, 500, enable_query);
onFetchOrderDetailResult((result) => {
  is_refreshed.value = false;
  orders.value = result.data.product_order;
  total_order.value = result.data?.total?.order?.value;
  // enable_query.value = false;
});
onFetchOrderDetailError((error) => {
  // enable_query.value = false;
});

const allCustomers = ref<
  Array<{
    customer_id: string;
    user: {
      first_name: string;
      last_name: string;
      email: string;
      phone_number: string;
    };
  }>
>([]);

onFetchCustomerResult((data) => {
  allCustomers.value = data.data.product_order;
});

onFetchCustomerError((error) => {
  console.log(error);
});

const updateCustomerID = (customer_id: string) => {
  enable_query.value = true;
  currentOrderID.value = customer_id;
};

const updateOffset = (value: any) => {
  offset.value = value;
};

const showDetailRow = (value: any) => {
  console.log(value);
};
</script>
