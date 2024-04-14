<template>
  <div class="w-full flex gap-2">
    <h-loading loading-text="Updateing..." :show-loading="loading" />
    <h-notification
      :success="success"
      :message="message"
      v-model="show_notification"
    />
    <h-dialog
      title=""
      class="w-full mx-auto"
      parentClass="md:max-w-[50%]"
      contentClass="w-full"
      v-model="show_dialog"
      @formSubmit="pay"
    >
      <template #content>
        <div class="flex flex-col gap-2 min-w-[20rem]">
          <h-text-field
            type="text"
            label="Transaction key"
            labelClass="text-primary font-bold"
            rules="required"
            v-model="transaction_key_to_supplier"
            name="transaction_key"
            placeholder="Add The Transaction Key"
            class="w-full rounded-md"
            id="t_key"
          />
          <div class="w-full flex justify-end">
            <button
              type="submit"
              class="text-light200 bg-primary py-3 px-6 rounded-md text-sm font-bold"
            >
              Add
            </button>
          </div>
        </div>
      </template>
    </h-dialog>

    <div
      class="w-[20%] flex flex-col gap-2 pt-2 sticky top-0 h-[calc(100vh-3.5rem)] overflow-y-auto bg-light200/40 px-3 border-r text-dark300/70"
    >
      <p class="font-bold text-lg">Customers</p>
      <div class="flex w-full items-center justify-center my-1 relative">
        <div class="relative w-full">
          <Icon
            name="ic:twotone-search"
            class="w-5 h-5 text-primary absolute top-3 left-2"
          />
          <input
            type="search"
            placeholder="Search"
            class="pl-8 w-full placeholder:text-sm rounded-md border-[1px] border-primary focus:border-[1px] focus:ring-0 outline-none ring-0"
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
            :value="false"
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
            :value="true"
            v-model="withDelivery"
          />
          <label class="text-xs" for="delivery">Delivery</label>
        </div>
      </div>

      <div class="flex flex-col gap-1">
        <div class="flex flex-col gap-2">
          <div v-if="onFetchCustomerLoading">Loading</div>
          <div v-if="allCustomers.length === 0 && !onFetchCustomerLoading">
            No customers found!
          </div>
          <div
            v-else-if="!onFetchCustomerLoading"
            class="flex gap-2 overflow-auto items-center hover:bg-gray-light hover:bg-opacity-30 rounded-md transition-colors duration-300 ease-in-out px-2 py-1 hover:cursor-pointer"
            v-for="customers in allCustomers"
            :key="customers.customer_id"
            :class="[
              customers.customer_id === currentOrderID
                ? 'border-2 border-primary'
                : '',
            ]"
            @click="() => updateCustomerID(customers.customer_id)"
          >
            <svg class="w-6 h-6 fill-blue-400" viewBox="0 0 575.616 575.616">
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
              <p class="text-xs">Email: {{ customers.user.email }}</p>
              <p class="text-xs">Phone: {{ customers.user.phone_number }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="!currentOrderID" class="w-[80%] py-2">
      <p>Click one to See Detail</p>
    </div>

    <div v-else class="w-[80%] py-2">
      <!-- <div class="flex flex-col gap-5">
        <p
          class="font-bold text-lg"
          v-if="currentOrderID && !onOrderDetailForPaymentLoading"
        >
          {{ order?.user?.first_name }}
          {{ order?.user?.last_name }}
          skjdkdj
        </p>
      </div> -->

      <div class="flex gap-5 items-center w-full">
        <!-- <v-select
          class="w-[150px]"
          label="Order Status"
          :items="[
            'all',
            'waiting',
            'completed',
            'delivered',
            'pending',
            'picked',
            'ontheway',
          ]"
          name="OrderStatus"
          v-model="orderStatus"
        /> -->

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
        <!--  -->
      </div>
      <div
        v-if="delivered_order?.length <= 0 && !onOrderDetailForPaymentLoading"
        class="w-full flex flex-row justify-center items-center text-lg font-semibold text-primaryvar2"
      >
        No Result is found
      </div>
      <div
        v-if="
          currentOrderID && !onOrderDetailForPaymentLoading && delivered_order
        "
        class="w-full mx-auto bg-light200 rounded-md px-2 overflow-x-auto my-2 mb-[3rem]"
      >
        <div
          class="flex flex-col gap-4"
          v-for="order in delivered_order"
          :key="order.id"
        >
          <!--  -->
          <div class="flex flex-wrap gap-3 mt-3">
            <div
              class="flex gap-4 py-2 px-4 rounded-md bg-gray-light bg-opacity-10 items-center"
            >
              <Icon
                name="material-symbols:calendar-month-sharp"
                class="w-6 h-6 text-dark300/60"
              ></Icon>
              <div class="flex flex-col">
                <p class="font-semibold">{{ formatDate(order?.created_at) }}</p>
                <p class="text-xs text-gray">Date Of Order</p>
              </div>
            </div>
            <div
              class="flex gap-4 py-2 px-4 rounded-md bg-gray-light bg-opacity-10 items-center"
            >
              <Icon
                name="material-symbols:supervised-user-circle-off-outline-rounded"
                class="w-6 h-6 text-dark300/60"
              ></Icon>
              <div class="flex flex-col">
                <p class="font-semibold">
                  {{ order?.order_details[0]?.physical_product?.store?.name }}
                </p>

                <p class="text-xs text-gray">Store name</p>
              </div>
            </div>

            <div
              class="flex gap-4 py-2 px-4 rounded-md bg-gray-light bg-opacity-10 items-center"
            >
              <Icon
                name="material-symbols:bluetooth-drive"
                class="w-6 h-6 text-dark300/60"
              ></Icon>
              <div class="flex flex-col">
                <p class="font-semibold">
                  {{
                    order?.order_details[0]?.physical_product?.store?.supplier
                      ?.info?.first_name
                  }},{{
                    order?.order_details[0]?.physical_product?.store?.supplier
                      ?.info.last_name
                  }}
                </p>
                <p class="text-xs text-gray">Supplier Name</p>
              </div>
            </div>

            <div
              class="flex gap-4 py-2 px-4 rounded-md bg-gray-light bg-opacity-10 items-center"
            >
              <Icon
                name="material-symbols:workspace-premium-outline"
                class="w-6 h-6 text-dark300/60"
              ></Icon>
              <div class="flex flex-col">
                <p class="font-semibold capitalize">
                  {{
                    order?.order_details[0]?.physical_product?.store
                      ?.bank_account?.first_name
                  }}
                  {{
                    order?.order_details[0]?.physical_product?.store
                      ?.bank_account?.last_name
                  }}
                </p>
                <p class="text-xs text-gray capitalize">
                  Acc number{{
                    order?.order_details[0]?.physical_product?.store
                      ?.bank_account?.account_number
                  }}
                </p>
                <p class="text-xs text-gray capitalize">
                  Bank Type:
                  {{
                    order?.order_details[0]?.physical_product?.store
                      ?.bank_account?.bank_type
                  }}
                </p>
                <p class="text-xs text-gray">Bank Account</p>
              </div>
            </div>

            <div
              class="flex gap-4 py-2 px-4 rounded-md bg-gray-light bg-opacity-10 items-center"
            >
              <Icon
                name="material-symbols:workspace-premium-outline"
                class="w-6 h-6 text-dark300/60"
              ></Icon>
              <div class="flex flex-col">
                <p class="font-semibold capitalize">
                  {{ order?.delivery_provider?.first_name }}
                  {{ order?.delivery_provider?.last_name }}
                </p>
                <p class="text-xs text-gray capitalize">
                  {{ order?.delivery_provider?.user?.phone_number }}
                </p>
                <p class="text-xs text-gray">Delivery Provider</p>
              </div>
            </div>

            <div
              class="flex gap-4 py-2 px-4 rounded-md bg-gray-light bg-opacity-10 items-center"
            >
              <Icon
                name="material-symbols:phone-in-talk"
                class="w-6 h-6 text-dark300/60"
              ></Icon>
              <div class="flex flex-col">
                <p class="font-semibold">
                  {{ order.driver?.first_name }} {{ order.driver?.last_name }}
                </p>
                <p class="text-xs text-gray">Driver name</p>
              </div>
            </div>

            <div
              class="flex gap-4 py-2 px-4 rounded-md bg-gray-light bg-opacity-10 items-center"
            >
              <Icon
                name="material-symbols:workspace-premium-outline"
                class="w-6 h-6 text-dark300/60"
              ></Icon>
              <div
                class="flex flex-col"
                v-if="order?.shipping_address?.sub_city"
              >
                <p class="font-semibold capitalize">
                  {{
                    order?.shipping_address?.sub_city?.region_city?.name.to[1]
                      .name
                  }}/ {{ order?.shipping_address?.sub_city.name?.to[1]?.name }}/
                  {{ order?.shipping_address?.state_provinence }}/
                  {{ order?.shipping_address?.zip_code }}
                </p>
                <p class="text-xs text-gray">Shipping Address</p>
              </div>
            </div>
            <div
              class="flex gap-4 py-2 px-4 rounded-md bg-gray-light bg-opacity-10 items-center"
            >
              <Icon
                name="material-symbols:local-shipping-sharp"
                class="w-6 h-6 text-dark300/60"
              ></Icon>
              <div class="flex flex-col">
                <p class="font-semibold">{{ order.shipping_fee }} ETB</p>
                <p class="text-xs text-gray">Shipping Fee</p>
              </div>
            </div>
            <div class="text-sm font-semibold">
              Total Price
              <span class="text-sm font-semibold text-primaryvar3">
                {{ total_price(order?.order_details) }} ETB
              </span>
            </div>
          </div>

          <button
            @click="
              paymentHandler(
                order?.order_details?.map((element) => {
                  return element?.id;
                })
              )
            "
            class="ml-auto text-right bg-primary bg-opacity-80 text-light100 px-2 py-1 rounded-md"
          >
            Make Payment
          </button>

          <!--  -->
          <div class="w-full">
            <v-table
              :body="order.order_details"
              :headers="headers"
              header-class="px-7 py-2"
              body-class="px-7 py-2"
              @click:row="showDetailRow"
            >
              <template #Id="{ item }"> {{ item.id }} </template>

              <template #ProductName="{ item }">
                {{ item?.physical_product?.title }}
              </template>

              <template #Quantity="{ item }">
                {{ item?.quantity }}
              </template>

              <template #SpecialDiscountRate="{ item }">
                {{ item?.special_discount_rate }}
              </template>

              <template #unit_price="{ item }">
                {{ item?.unit_price }}
              </template>
              <template #discount="{ item }">
                {{ item?.discount }}
              </template>

              <template #Status="{ item }">
                {{ item.status }}
              </template>
            </v-table>
          </div>
        </div>
      </div>

      <div v-else class="w-[80%] py-2">
        <h-loading
          class="w-full"
          :show-loading="onOrderDetailForPaymentLoading && is_refreshed"
        ></h-loading>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import fetchAllCustomers from "@/apollo/query/order/allCustomersWithOrder.gql";
import orderDetailForPayment from "@/apollo/query/order/orderDetailForPayment.gql";
import update_order_gql from "~/apollo/mutation/order/update_order.gql";
const enable_query = ref(false);
const orderStatus = ref<string>("all");
const is_refreshed = ref(true);
const transaction_key_to_supplier: any = ref(null);
const show_dialog = ref(false);
const order_ids = ref([]);
const loading = ref(false);
const success = ref(false);
const show_notification = ref(false);
const message = ref("");
const route = useRoute();
const storeID = computed(() => {
  return route.params.storeId;
});

const orders = ref<
  Array<{
    product_order: {
      shipping_fee: number;
      status: string;
      user: {
        first_name: string;
        last_name: string;
      };
      created_at: string;
      id: number;
      driver: {
        user: {
          first_name: string;
          last_name: string;
          phone_number: string;
        };
      };
      delivery_provider: {
        user: {
          first_name: string;
          last_name: string;
          phone_number: string;
          email: string;
        };
      };

      shipping_address: {
        description: string;
        email: string;
        state_provinence: string;
        zip_code: string;
        sub_city: {
          name: {
            to: {
              name: string;
              language_type: string;
            }[];
          };
          region_city: {
            name: {
              to: {
                name: string;
                language_type: string;
              }[];
            };
          };
        };
      };
    };

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

        bank_account: {
          account_number: string;
          bank_type: string;
          first_name: string;
          last_name: string;
        };
      };
    };
  }>
>([]);
definePageMeta({
  layout: "custom",
});

const {
  mutate: update_order,
  onDone: onUpdateOrderDone,
  onError: onUpdateOrderError,
} = useCustomMutation(update_order_gql);

const headers: Array<string> = [
  "Id",
  "ProductName",
  "Quantity",
  "SpecialDiscountRate",
  "unit_price",
  "discount",
  "Status",
];

const total_price = (value: any) => {
  console.log(value);
  return value?.reduce((total: any, element: any) => {
    if (element?.special_discount_rate)
      total +=
        element?.quantity *
        ((element?.unit_price - element?.discount) *
          (1 - element?.special_discount_rate / 100));
    else total += element?.quantity * (element?.unit_price - element?.discount);

    return total;
  }, 0);
};

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
      ...(storeID.value
        ? {
            order_details: {
              physical_product: { store: { id: { _eq: storeID.value } } },
            },
          }
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
    order_where: {
      ...(withDelivery.value != "all"
        ? { with_delivery: { _eq: withDelivery.value } }
        : {}),
      customer_id: { _eq: currentOrderID.value },
      order_details: {
        status: { _eq: "delivered" },
        physical_product: {
          store: {
            id: { _eq: storeID.value },
          },
        },
      },
    },

    where: {
      ...(withDelivery.value != "all"
        ? { product_order: { with_delivery: { _eq: withDelivery.value } } }
        : {}),
      physical_product: {
        ...(searchString2.value
          ? { title: { _iregex: searchString2.value } }
          : {}),
        store: {
          id: { _eq: storeID.value },
        },
      },
      status: { _eq: "delivered" },
    },
  };
});
watch(withDelivery, (newValue) => {
  enable_query.value = true;
});

const {
  onResult: onFetchCustomerResult,
  onError: onFetchCustomerError,
  loading: onFetchCustomerLoading,
} = useCustomQuery(fetchAllCustomers, variable, 500);

const {
  onResult: onOrderDetailForPaymentResult,
  onError: onOrderDetailForPaymentError,
  result: order_result,
  loading: onOrderDetailForPaymentLoading,
  refetch: order_reftech,
} = useCustomQuery(orderDetailForPayment, variable2, 500, enable_query);
onOrderDetailForPaymentResult((result) => {
  is_refreshed.value = false;
  orders.value = result.data.order_detail;

  enable_query.value = false;
});

const delivered_order = computed(() => {
  console.log(order_result?.value);
  return order_result.value?.product_order;
});

onOrderDetailForPaymentError((error) => {
  enable_query.value = false;

  console.log({ error });
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
  currentOrderID.value = customer_id;
  enable_query.value = true;
};

const showDetailRow = (value: any) => {
  console.log(value);
};

onUpdateOrderDone((result) => {
  // when successfully updated
  success.value = true;
  message.value = "updated successfully";
  show_notification.value = true;
  loading.value = false;
  enable_query.value = true;
  show_dialog.value = false;
  order_reftech();
});

onUpdateOrderError((error) => {
  success.value = false;
  message.value = error.message + " please try again";
  show_notification.value = true;
  loading.value = false;
  show_dialog.value = false;
  // when error happend
});

watch(searchString2, (newValue) => {
  enable_query.value = true;
});

const paymentHandler = (value: any) => {
  console.log("pay this: ", value);
  transaction_key_to_supplier.value = "";
  order_ids.value = value;
  show_dialog.value = true;
};

const pay = () => {
  loading.value = true;

  const updateOrderSetInput = {
    where: { id: { _in: order_ids.value } },
    set: {
      to_supplier_transaction_key: transaction_key_to_supplier.value,
      status: "completed",
    },
  };

  update_order(updateOrderSetInput);
};
</script>
