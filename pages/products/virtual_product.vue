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
            class="pl-10 w-full border-[1px] border-primary rounded-md focus:border-[1px] focus:ring-0 outline-none ring-0"
            v-model="searchString"
          />
        </div>
      </div>
      <div class="flex items-center justify-center w-full my-3 mb-2">
        <div class="flex items-center flex-wrap gap-4 w-full lg:w-[90%] px-5">
          <v-select
            class="w-[150px]"
            label="Category"
            :items="categoryListItems"
            name="category"
            v-model="productCategory"
          />
          <v-select
            class="w-[150px]"
            label="Status"
            :items="['All', 'Pending', 'verified', 'suspended']"
            name="status"
            v-model="productReleaseStatus"
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
      v-if="products"
      class="pb-20"
      :headers="header"
      :loading="productLoading"
      :body="products"
      :item-i-d="itemId"
      header-class="py-2 px-2"
      @click:row="showDetail"
    >
      <template #date="{ item }">
        <div>
          {{ item.date }}
        </div>
      </template>
      <template #product_name="{ item }">
        <div>
          {{ item.title }}
        </div>
      </template>

      <template #price="{ item }">
        <div>
          {{ item.price }}
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
              ? 'text-primary px-4 bg-primary/10'
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
      v-if="products?.length <= 0 && !productLoading"
    >
      No Result Found
    </div>
    <v-pagination :items-per-page="limit" :total-data="total_products" @update:offset="updateOffset" />
    <div
      v-if="showProductDetail"
      class="fixed left-0 top-0 overflow-x-scroll overflow-y-scroll h-full transition-colors duration-1000 ease-in-out w-full bg-black/20 z-40 flex items-center justify-center"
    >
      <div
        class="bg-slate-50 shadow-md rounded-lg relative lg:max-w-[90%] text-gray py-10 px-8"
      >
        <XMarkIcon
          class="fill-red absolute top-4 right-3 w-8 h-8 cursor-pointer"
          @click="showProductDetail = false"
        />
        <div class="my-4 flex gap-4 w-[90%]">
          <v-swiper :images="imageCollection" />
          <div class="w-full">
            <h1 class="text-green400 font-bold text-xl">
              {{ selectedProduct.title }}
            </h1>
            <p>
              {{
                selectedProduct.category.language.translation_contents[0].name
              }}
            </p>
            <p class="w-full text-sm">
              {{ productDescription }}
            </p>
          </div>
        </div>
        <div class="flex flex-wrap gap-8">
          <p class="font-semibold">
            <span class="text-blue-500">Product Release Status</span> :
            {{ selectedProduct.release_status }}
          </p>
          <p class="font-semibold">
            <span class="text-blue-500">Issued Date</span> :
            {{ selectedProduct.created_at }}
          </p>

          <p class="font-semibold">
            <span class="text-blue-500">Product Price</span> :
            {{ selectedProduct.unit_price }}
          </p>
          <p class="font-semibold">
            <span class="text-blue-500">Product Demo LINK</span> :
            {{ selectedProduct.demo_link }}
          </p>
          <p class="font-semibold">
            <span class="text-blue-500">Reviewed By</span> :
            {{ selectedProduct.reviewer?.first_name ?? "-" }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { EllipsisHorizontalIcon, XMarkIcon } from "@heroicons/vue/24/solid";
import fetchProducts from "@/apollo/query/products/virtual/fetchProducts.gql";
import fetchCategory from "@/apollo/query/products/virtual/fetchCategory.gql";
import updateProductStatus from "@/apollo/mutation/product/virtual/updateProductStatus.gql";
import rejectProduct from "@/apollo/mutation/product/virtual/rejectProduct.gql";
import { useAuth } from "@/store/auth";
const store = useAuth();
const adminId = computed(() => {
  return store.$state.uid;
});
definePageMeta({
  layout: "custom",
});

const issueDate = ref();
const productReleaseStatus = ref();
const searchString = ref();
const productCategory = ref();

const limit = ref(20);
const offset = ref(0);
const itemId = ref([]);
const selectedProduct = ref();
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
  [issueDate, productReleaseStatus, productCategory, searchString],
  ([date, releaseStatus, pc, ss]) => {
    offset.value = 0;
  }
);
const variable = computed(() => {
  return {
    offset: offset.value,
    limit: limit.value,
    where: {
      ...(productCategory.value && productCategory.value.id != -1
        ? {
            virtual_product_category: {
              id: { _eq: productCategory.value.id },
            },
          }
        : {}),

      ...(productReleaseStatus.value?.length > 0 &&
      productReleaseStatus.value != "All"
        ? {
            release_status: {
              _eq: productReleaseStatus.value + "".toLowerCase(),
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
                virtual_product_category: {
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
  result: product_result,
  onError: onProductError,
  refetch: refetchProduct,
  loading: productLoading,
} = useCustomQuery(fetchProducts, variable, 500);

const { result: category_result, onError: onCategoryError } =
  useCustomQuery(fetchCategory);

watch(category_result, (newValue) => {
  if (newValue?.category)
    newValue.category.map((cat) => {
      console.log(cat);
      categoryListItems.value.push({
        id: cat.id,
        name: cat.language.en[0].name,
      });
    });
});
onProductError((error) => {
  console.log(error);
});

const {
  mutate: updateStatus,
  onError: updateStatusError,
  onDone: updateStatusDone,
} = useCustomMutation(updateProductStatus);
const {
  mutate: rejectProductMutation,
  onError: rejectProductError,
  onDone: rejectProductDone,
} = useCustomMutation(rejectProduct);

updateStatusError((error) => {
  updating.value = false;
  console.log("UPDATE STATUS ERROR", error);
});
updateStatusDone((result) => {
  updating.value = false;
  refetchProduct();
  console.log("UPDATE STATUS DONE");
});
rejectProductError((error) => {
  updating.value = false;
  console.log("REJECT PRODUCT ERROR", error);
});
rejectProductDone((result) => {
  updating.value = false;
  refetchProduct();
  console.log("REJECT PRODUCT DONE");
});

const products = computed(() => {
  return product_result.value?.products?.map((element) => {
    itemId.value.push(element.id);
    return {
      id: element.id,
      email: element.supplier.userById.email,
      date: element.created_at,
      title: element.title,
      price: element.unit_price,
      category: element.category.language.translation_contents[0].name,
      release_status: element.release_status,
    };
  });
});
const total_products = computed(() => {
  return product_result.value?.total?.product?.value;
});

const header = [
  "date",
  "product_name",
  "price",
  "category",
  "release_status",
  "action",
];
const imageCollection = ref([]);
const productDescription = ref("");
const showProductDetail = ref(false);
const showDetail = (value) => {
  console.log(value);
  selectedProduct.value = product_result.value.products.find(
    (prod) => prod.id == value
  );
  if (selectedProduct.value) {
    imageCollection.value = [];
    productDescription.value = "";
    imageCollection.value.push(selectedProduct.value.cover_image);
    selectedProduct.value?.images?.map((images) => {
      imageCollection.value.push(images.url);
    });
    selectedProduct.value?.description?.ops?.map((text) => {
      productDescription.value += text.insert + " ";
    });
  }
  showProductDetail.value = true;
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
      rejectProductMutation({
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
