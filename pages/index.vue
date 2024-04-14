<template>
  <div class="p-4">
    <div>
      <h1 class="font-bold text-xl mb-4">Dashboard</h1>

      <div class="grid lg:grid-cols-4 grid-cols-2 gap-6">
        <div
          class="py-4 pl-4 flex gap-4 items-center bg-white border shadow-sm rounded-md">
          <div
            class="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
            <ShoppingCartIcon class="fill-white lg:h-5 lg:w-5 h-5 w-5" />
          </div>
          <div>
            <p class="text-gray text-xs">Total Orders</p>
            <p class="text-sm font-semibold text-black">
              {{ total_order?.total?.order?.value }}
            </p>
          </div>
        </div>
        <div
          class="py-4 pl-4 flex gap-4 items-center bg-white border shadow-sm rounded-md">
          <div
            class="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
            <RectangleStackIcon class="fill-white lg:h-5 lg:w-5 h-5 w-5" />
          </div>
          <div>
            <p class="text-gray text-xs">Total Products</p>
            <p class="text-sm font-semibold text-black">
              {{ all_data?.pp?.total?.value + all_data?.vp?.total?.value }}
            </p>
          </div>
        </div>
        <div
          class="py-4 pl-4 flex gap-4 items-center bg-white border shadow-sm rounded-md">
          <div
            class="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
            <SparklesIcon class="fill-white lg:h-5 lg:w-5 h-5 w-5" />
          </div>
          <div>
            <p class="text-gray text-xs">Total Services</p>
            <p class="text-sm font-semibold text-black">
              {{ all_data?.rs?.total?.value + all_data?.vs?.total?.value }}
            </p>
          </div>
        </div>
      </div>
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8 w-full">
        <div class="bg-white rounded-md px-4 w-full h-[340px]">
          <h1 class="font-bold text-lg py-3">Sales Statistics</h1>
          <VueApexCharts
            class="w-full"
            height="250"
            type="line"
            :options="ROOption"
            :series="ROSeriesD"></VueApexCharts>
        </div>
        <div class="bg-white rounded-md px-4 w-full h-[340px]">
          <h1 class="font-bold text-lg py-3">Supplier to Customer</h1>
          <VueApexCharts
            class="w-full"
            height="250"
            type="bar"
            :options="SCOption"
            :series="total_bar"></VueApexCharts>
        </div>
        <div
          class="bg-white rounded-md px-4 w-full min-h-[340px] flex flex-col items-center justify-start">
          <h1 class="font-bold text-lg py-3 w-full">Services and Products</h1>
          <VueApexCharts
            class="w-full"
            height="250"
            type="donut"
            :options="PSOption"
            :series="PSSeries"></VueApexCharts>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import {
  CurrencyDollarIcon,
  ShoppingCartIcon,
  RectangleStackIcon,
  SparklesIcon,
  ArrowTrendingUpIcon,
} from "@heroicons/vue/24/solid";
import VueApexCharts from "vue3-apexcharts";
import total_order_gql from "~/apollo/query/order/total_order.gql";
import data from "~/apollo/query/dashboard.gql";

definePageMeta({
  layout: "custom",
});
const ROOption = {
  chart: {
    id: "vuechart-example",
    toolbar: {
      show: false, //Disable toolbar
    },
    zoom: {
      enabled: false,
    },
  },
  xaxis: {
    categories: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
  },
};

let supplier_in_each_month = [0, 0, 0, 0, 0, 0];

const customer_in_each_month = [0, 0, 0, 0, 0, 0];

let category = {
  "Jan-Mar": ["January", "February", "March"],
  "Mar-Apr": ["MArch", "April"],
  "Apr-Jul": ["April", "May", "June"],
  "Jul-Sep": ["June", "July", "August", "September"],
  "Sep-Nov": ["September", "October", "November"],
  "Nov-Jan": ["November", "December", "January"],
};

const month_index = {
  "Jan-Mar": 0,
  "Mar-Apr": 1,
  "Apr-Jul": 2,
  "Jul-Sep": 3,
  "Sep-Nov": 4,
  "Nov-Jan": 5,
};

const order_month = {
  January: 0,
  February: 1,
  March: 2,
  April: 3,
  May: 4,
  June: 5,
  July: 6,
  August: 7,
  September: 8,
  October: 9,
  November: 10,
  December: 11,
};

const monthInitialValue = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

const { result: total_order } = useCustomQuery(total_order_gql);

const now_date = new Date();
now_date.setFullYear(now_date.getFullYear() - 1);

const { result: all_data } = useCustomQuery(data, {
  year: now_date,
});

const SCOption = {
  dataLabels: {
    enabled: true,
    formatter: function (val) {
      if (val > 1000) return (val / 1000).toFixed(1) + "k";
      else return val;
    },
  },
  chart: {
    id: "vuechart-example",
    toolbar: {
      show: false, //Disable toolbar
    },
    zoom: {
      enabled: false,
    },
  },
  xaxis: {
    categories: [
      "Jan-Mar",
      "Mar-Apr",
      "Apr-Jul",
      "Jul-Sep",
      "Sep-Nov",
      "Nov-Jan",
    ],
  },
};

const SCSeries = [
  {
    name: "Supplier",
    data: [10, 30, 50, 70, 30, 40],
  },
  {
    name: "Customer",
    data: [20, 30, 40, 60, 40, 80],
  },
];

const PSOption = {
  plotOptions: {
    pie: {
      donut: {
        size: "50%",
      },
    },
  },
  labels: [
    "Physical Product",
    "Physical Service",
    "Virtual Product",
    "Virtual Service",
  ],
};
const PSSeries = computed(() => {
  if (all_data?.value) {
    return [
      all_data.value?.pp?.total?.value,
      all_data.value?.rs?.total?.value,
      all_data.value?.vp?.total?.value,
      all_data.value?.vs?.total?.value,
    ];
  }
  return [0, 0, 0, 0];
});

const sale_statics = computed(() => {
  return all_data.value?.sale_statics;
});

const ROSeriesD = computed(() => {
  if (sale_statics.value) {
    sale_statics.value?.forEach((element) => {
      let month = formatDate(element?.created_at)?.split(" ")[0];
      console.log(month);
      monthInitialValue[order_month[`${month}`]] += 1;
    });
  }
  return [{ name: "order", data: monthInitialValue }];
});

const total_bar = computed(() => {
  all_data.value?.supplier?.map((element) => {
    let date = formatDate(element.created_at).split(" ")[0];

    let match_supplier = Object.keys(category).filter((key) => {
      return category[key].includes(date);
    });

    match_supplier.forEach((i_month) => {
      supplier_in_each_month[month_index[i_month]] += 1;
    });
  });

  all_data.value?.customer?.map((element) => {
    let date = formatDate(element.created_at).split(" ")[0];

    let match_customer = Object.keys(category).filter((key) => {
      return category[key].includes(date);
    });

    match_customer.forEach((i_month) => {
      customer_in_each_month[month_index[i_month]] += 1;
    });
  });

  return [
    { name: "Customer", data: customer_in_each_month },
    { name: "Supplier", data: supplier_in_each_month },
  ];
});
</script>
