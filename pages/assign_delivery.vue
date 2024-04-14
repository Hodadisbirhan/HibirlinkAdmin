<script setup lang="ts">
import order from "~/apollo/query/order/orderDetail.gql";
import fetch_delivery from "~/apollo/query/delivery/fetchAllDelivery.gql";
import assignedDelivery_gql from "~/apollo/mutation/order/assignedDelivery.gql";
const excluded_id = ref(null);
const show_dialog_for_assign: any = ref(false);
const enable_query_delivery = ref(false);
const delivery_id: any = ref(null);
const selected_order_id = ref("");
const show_dialog_for_detail = ref(false);
const order_id: any = ref(null);
const assigned_order_loading = ref(false);
const message = ref("");
const success = ref(false);
const search = ref("");
const offset = ref(0);
const limit = ref(10);
const show_notification = ref(false);
const status = ref("all");
const headers = [
  "order_id",
  "transaction_key",
  "customer_fname",
  "customer_lname",
  "customer_email",
  "customer_phone_number",
  "address",
  "delivery",
  "created_at",
  "status",
  "action",
];

const variable = computed(() => {
  return {
    limit: limit.value,
    offset: offset.value,
    where: {
      transaction_key: { _is_null: false },
      with_delivery: { _eq: true },
      ...(status.value != "all" && status.value != "All"
        ? { status: { _eq: status.value } }
        : {}),
      ...(search.value
        ? {
            _or: [
              { transaction_key: { _iregex: search.value } },
              {
                user: {
                  _or: [
                    { first_name: { _iregex: search.value } },
                    { last_name: { _iregex: search.value } },
                    { email: { _iregex: search.value } },
                  ],
                },
              },
            ],
          }
        : {}),
    },
  };
});

watch([status, search], ([stat, sear]) => {
  offset.value = 0;
});

const delivery_variable = computed(() => {
  return {
    where: {
      ...(excluded_id.value ? { id: { _neq: excluded_id.value } } : {}),
    },
  };
});

const {
  result: allWithDeliveryOrders,
  error: withDeliveryOrderError,
  refetch: refetch_Order,
  loading: order_loading,
  onResult: onDeliveryResult,
  onError: onDeliveryError,
} = useCustomQuery(order, variable, 500);

const {
  result: delivery,
  error: deliveryError,
  loading: delivery_loading,
  refetch: deliveryRefetch,
} = useCustomQuery(fetch_delivery, delivery_variable, 0, enable_query_delivery);

// for mutation
const {
  mutate: assign_order,
  onDone: onAssignedOrderDone,
  onError: onAssignedOrderError,
} = useCustomMutation(assignedDelivery_gql);

const with_delivery_order_result = computed(() => {
  return allWithDeliveryOrders?.value?.product_order;
});

const total_order = computed(() => {
  return allWithDeliveryOrders.value?.total?.order?.value;
});

const detail_single_order = computed(() => {
  return with_delivery_order_result.value?.find((element: any) => {
    console.log(element);
    return element.id == selected_order_id.value;
  });
});

const delivery_result = computed(() => {
  return delivery?.value?.delivery_delivery_provider?.filter((element: any) => {
    return element?.user?.email != element?.user?.id;
  });
});

const handleOption = (value) => {
  console.log(value);

  if (value?.action === "assign" || value?.action === "reassigned") {
    if (value?.action === "assign") {
      order_id.value = value?.id;
    } else {
      order_id.value = value?.id?.id;
      excluded_id.value = value?.id?.delivery_id;
    }

    enable_query_delivery.value = true;
    show_dialog_for_assign.value = true;
  } else {
    selected_order_id.value = value?.id;

    show_dialog_for_detail.value = true;
  }
};

const selectDeliveryHandler = (value: any) => {
  assigned_order_loading.value = true;

  assign_order({
    order_id: order_id.value,
    set: { delivery_id: value },
  });
};

onDeliveryResult((result) => {
  enable_query_delivery.value = false;
});

onDeliveryError((error) => {
  enable_query_delivery.value = false;
});

onAssignedOrderDone((result) => {
  assigned_order_loading.value = false;
  show_dialog_for_assign.value = false;
  success.value = true;
  message.value = "Assigned Successfully";
  refetch_Order();
  show_notification.value = true;
});

onAssignedOrderError((error) => {
  assigned_order_loading.value = false;
  success.value = false;
  message.value = error?.message;
  show_notification.value = true;
});

const clickRowHandler = (value) => {
  selected_order_id.value = value;
  show_dialog_for_detail.value = true;
};

const updateOffset = (value: any) => {
  offset.value = value;
};

definePageMeta({
  layout: "custom",
});
</script>

<template>
  <div>
    <h-notification
      :success="success"
      :message="message"
      v-model="show_notification"
    />
    <div>
      <h-dialog
        title="Assigned order to delivery"
        v-model="show_dialog_for_assign"
        contentClass="lg:w-[60%] md:w-[70%] sm:w-[80%] "
      >
        <template #content>
          <div v-if="delivery_loading">
            <v-loading loadingText="Wait" :showLoading="delivery_loading" />
          </div>
          <div v-if="deliveryError">
            <a class="text-sm text-red" href="#"> Error please Try Again</a>
          </div>
          <div class="flex justify-between">
            <strong>Deliverys</strong>
          </div>

          <v-loading
            loadingText="Wait"
            :showLoading="delivery_loading || assigned_order_loading"
          />
          <ul
            class="flex flex-col gap-5 py-2 px-4 max-h-[calc(100vh-8rem)] overflow-y-auto"
          >
            <li
              v-if="delivery_result?.length <= 0 && !delivery_loading"
              class="text-lg font-semibold text-primary flex items-center justify-center"
            >
              No Driver Aveliable
            </li>
            <li
              v-for="single_delivery in delivery_result"
              :key="single_delivery?.id"
              @click="selectDeliveryHandler(single_delivery?.id)"
              class="flex flex-col gap-1 py-2 bg-light200/30 hover:bg-primaryvar8 hover:text-primaryvar3 px-3 rounded-md cursor-pointer"
            >
              <span class="text-sm font-bold"
                >{{ single_delivery?.name }}
              </span>

              <span class="text-xs font-semibold text-dark300/60">{{
                single_delivery?.user?.email
              }}</span>
            </li>
          </ul>
        </template>
      </h-dialog>
    </div>

    <div>
      <v-loading loadingText="Loading..." :showLoading="order_loading" />
    </div>
    <div class="text-darkblue text-2xl font-bold py-3">Order with Delivery</div>
    <div class="flex flex-row gap-3 pt-3">
      <h-text-field
        name="search"
        type="search"
        placeholder="search Order"
        leading-icon="uil:search"
        class=""
        v-model="search"
      />
      <v-select
        class="w-[150px] h-[2rem] border-primary"
        label="Status"
        :items="[
          'All',
          'pending',
          'completed',
          'delivered',
          'waiting',
          'reject_by_driver',
          'ontheway',
        ]"
        name="status"
        v-model="status"
      />
    </div>

    <div v-if="with_delivery_order_result">
      <v-table
        :body="with_delivery_order_result"
        :headers="headers"
        headerClass="bg-primary/30 py-2 px-3 "
        bodyClass="px-3 border-b  border-light200/20  "
        trClass="hover:bg-light200"
        @click:row="clickRowHandler"
      >
        <template #order_id="{ item }">
          <div>{{ item?.id }}</div>
        </template>
        <template #transaction_key="{ item }">
          <div>{{ item?.transaction_key }}</div>
        </template>

        <template #address="{ item }">
          <div>
            {{
              item?.shipping_address?.sub_city?.region_city?.name?.to[0]?.name
            }},{{ item?.shipping_address?.sub_city?.name?.to[0]?.name }}
          </div>
        </template>
        <template #customer_fname="{ item }">
          <div>{{ item?.user?.first_name }}</div>
        </template>

        <template #customer_lname="{ item }">
          {{ item?.user?.last_name }}
        </template>

        <template #customer_email="{ item }">
          <div>{{ item?.user?.email }}</div>
        </template>
        <template #customer_phone_number="{ item }">
          <div>{{ item?.shipping_address?.phone_number1 }}</div>
        </template>
        <template #status="{ item }">
          <span class="bg-light200 px-2 py-1 rounded-full">{{
            item?.status
          }}</span>
        </template>
        <template #created_at="{ item }">
          {{ formatDate(item?.created_at) }}
        </template>
        <template #delivery="{ item }">
          {{ item?.delivery_provider?.name }}
        </template>

        <template #action="{ item }">
          <div>
            <span v-if="item?.status == 'pending' && item?.delivery_id == null">
              {{ item?.delivery_id }}
              <div @click.stop="() => {}">
                <v-menu
                  @optionClicked="handleOption"
                  :menu="{
                    id: item?.id,
                    actions: ['assign', 'view detail'],
                  }"
                  leading_icon="uil:ellipsis-h"
                />
              </div>
            </span>
            <div
              @click.stop="() => {}"
              v-else-if="item?.status == 'pending' && item?.delivery_id != null"
            >
              <v-menu
                :menu="{
                  id: { id: item?.id, delivery_id: item?.delivery_id },
                  actions: ['reassigned', 'view detail'],
                }"
                @optionClicked="handleOption"
                leading_icon="uil:ellipsis-h"
              />
            </div>
            <div v-else>
              <v-menu
                @optionClicked="handleOption"
                :menu="{
                  id: item?.id,
                  actions: ['view detail'],
                }"
                leading_icon="uil:ellipsis-h"
              />
            </div>
          </div>
        </template>
      </v-table>
    </div>

    <h-dialog
      :title="`order- ${selected_order_id}`"
      v-model="show_dialog_for_detail"
      contentClass="lg:w-[60%] md:w-[70%]  sm:w-[80%] overflow-y-auto max-h-[calc(100vh-4rem)] "
    >
      <template #content>
        <div class="w-full max-h-[calc(80vh)] overflow-y-auto">
          <div class="w-full bg-light400 h-[80vh]">
            <div
              class="flex flex-row justify-between flex-wrap bg-light300/50 items-center mb-3 rounded-lg py-1 px-2"
            >
              <div
                class="flex flex-col gap-1"
                v-if="detail_single_order.delivery_provider"
              >
                <h1 class="text-lg font-bold text-dark300">Delivery Info</h1>
                <span class="text-sm font-semibold"
                  ><Icon name="uil:car" class="w--4 h-4 text-dark300/30" />
                  {{ detail_single_order?.delivery_provider.name }}</span
                >
                <span class="text-sm font-semibold"
                  ><Icon name="uil:phone" class="w--4 h-4 text-dark300/30" />
                  {{
                    detail_single_order?.delivery_provider?.user?.phone_number
                  }}</span
                >
              </div>

              <div
                class="flex flex-col gap-1"
                v-if="detail_single_order.driver"
              >
                <h1 class="text-lg font-bold text-dark300">Driver Info</h1>
                <span class="text-sm font-semibold"
                  ><Icon name="uil:user" class="w--4 h-4 text-dark300/30" />
                  {{ detail_single_order?.driver?.user.first_name }}
                  {{ detail_single_order?.driver?.user.last_name }}</span
                >
                <span class="text-sm font-semibold"
                  ><Icon name="uil:phone" class="w--4 h-4 text-dark300/30" />
                  {{ detail_single_order?.driver?.user?.phone_number }}</span
                >
              </div>

              <span
                class="px-3 rounded-xl bg-light200 h-fit justify-self-end text-primary"
                >{{ detail_single_order.status }}</span
              >
            </div>

            <v-table
              :headers="[
                'id',
                'product_name',
                'quantity',
                'store',
                'unit_price',
                'discount',
                'special_discount(%)',
                'product_status',
                'supplier',
                'supplier_phone',
              ]"
              header-class="bg-light200 text-dark300/70 py-2 px-3 "
              :body="detail_single_order?.order_details"
              bodyClass="px-3 py-1"
            >
              <template #id="{ item }">
                <div>{{ item?.id }}</div>
              </template>
              <template #product_name="{ item }">
                <div>{{ item?.physical_product?.title }}</div>
              </template>
              <template #quantity="{ item }">
                <div>{{ item?.quantity }}</div>
              </template>
              <template #unit_price="{ item }">
                <div>{{ item?.unit_price }}</div>
              </template>

              <template #discount="{ item }">
                <div>{{ item?.discount }}</div>
              </template>
              <template #special_discount(%)="{ item }">
                <div>{{ item?.special_discount_rate }}</div>
              </template>

              <template #product_status="{ item }">
                <div>{{ item?.physical_product?.status }}</div>
              </template>
              <template #supplier="{ item }">
                <div>
                  {{
                    item?.physical_product?.store?.supplier?.info?.first_name
                  }}
                  {{ item?.physical_product?.store?.supplier?.info?.last_name }}
                </div>
              </template>
              <template #supplier_phone="{ item }">
                <div>
                  {{
                    item?.physical_product?.store?.supplier?.info?.phone_number
                  }}
                </div></template
              >
              <template #store="{ item }">
                <div>
                  {{ item?.physical_product?.store?.name }}
                </div></template
              >
            </v-table>
          </div>
        </div>
      </template>
    </h-dialog>
    <div class="w-full flex justify-end items-center gap-2" v-if="total_order">
      <span class="text-sm font-semibold text-dark300/60">Items per table</span>

      <v-select
        class="w-[150px] h-[2rem] border-primary"
        label="10"
        :items="['5', '10', '20', '25', '50', '100']"
        name="limit"
        v-model="limit"
      />
    </div>
    <v-pagination
      :offset="offset"
      :items-per-page="limit"
      :total-data="total_order"
      @update:offset="updateOffset"
    />
  </div>
</template>
