<template>
  <div class="relative">
    <confirm-action
      v-if="showConfirmationModal"
      :reason="have_reason"
      @confirmation="confirmationAction"
    />
    <v-loading :show-loading="updating" loading-text="Updating. . ." />
    <div class="sticky top-0 bg-light400 pb-1 z-40 my-4">
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
      <div class="flex items-center justify-center my-3 w-full mb-2">
        <div
          class="flex items-center justify-start flex-wrap gap-4 w-full lg:w-full px-5"
        >
          <v-select
            class="w-[150px]"
            label="Category"
            :items="categoryListItems"
            name="category"
            v-model="productCategory"
          />
          <v-select
            v-if="showSubCategory"
            class="w-[150px]"
            label="SubCategory"
            :items="subCategoryListItems"
            name="sub_category"
            v-model="productSubCategory"
          />
          <v-select
            class="w-[150px]"
            label="Status"
            :items="['All', 'pending', 'verified']"
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
          <v-select
            class="w-[150px]"
            label="Product Status"
            :items="['All', 'New', 'Slightly used', 'Used']"
            name="ProductStatus"
            v-model="productStatus"
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
        <div class="max-w-xs truncate">
          {{ item.title }}
        </div>
      </template>

      <template #price="{ item }">
        <div>
          {{ item.price }}
        </div>
      </template>
      <template #store="{ item }">
        <div>
          {{ item.store }}
        </div>
      </template>
      <template #product_status="{ item }">
        <div>
          {{ item.product_status }}
        </div>
      </template>
      <template #category="{ item }">
        <div>
          {{ item.category }}
        </div>
      </template>
      <template #subCategory="{ item }">
        <div>{{ item.subCategory }}</div>
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
      v-if="products?.length <= 0 && !productLoading"
    >
      No Result Found
    </div>
    <v-pagination
      :items-per-page="limit"
      :total-data="total_products"
      @update:offset="updateOffset"
    />
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
                selectedProduct.sub_category.language.translation_contents[0]
                  .name
              }}
              /
              {{
                selectedProduct.sub_category.category.language
                  .translation_contents[0].name
              }}
            </p>
            <p class="w-full text-sm">
              {{ productDescription }}
            </p>
          </div>
        </div>
        <div class="flex flex-wrap gap-8">
          <p class="font-semibold">
            <span class="text-blue-500">Product Status</span> :
            {{ selectedProduct.product_status }}
          </p>
          <p class="font-semibold">
            <span class="text-blue-500">Product Release Status</span> :
            {{ selectedProduct.release_status }}
          </p>
          <p class="font-semibold">
            <span class="text-blue-500">Issued Date</span> :
            {{ selectedProduct.created_at }}
          </p>
          <p class="font-semibold">
            <span class="text-blue-500">Product Discount</span> :
            {{
              selectedProduct.product_discount
                ? selectedProduct.product_discount.rate
                : "-"
            }}
          </p>
          <p class="font-semibold">
            <span class="text-blue-500">Product Price</span> :{{
              selectedProduct.unit_price
            }}
          </p>
          <p class="font-semibold">
            <span class="text-blue-500">Product Available</span> :
            {{ selectedProduct.is_avaliable ? "Available" : "Unavailable" }}
          </p>
          <p class="font-semibold">
            <span class="text-blue-500">Available Quantity</span> :
            {{ selectedProduct.quantity }}
          </p>
          <p class="font-semibold">
            <span class="text-blue-500">Reviewed By</span> :
            {{ selectedProduct.reviewer?.first_name ?? "-" }}
          </p>
          <p class="font-semibold">
            <span class="text-blue-500">Store :- </span> :
            {{ selectedProduct.store.name }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { EllipsisHorizontalIcon, XMarkIcon } from "@heroicons/vue/24/solid";
import fetchProducts from "@/apollo/query/products/physical/fetchProducts.gql";
import fetchCategory from "@/apollo/query/products/physical/fetchCategory.gql";
import updateProductStatus from "@/apollo/mutation/product/physical/updateProductStatus.gql";
import rejectProduct from "@/apollo/mutation/product/physical/rejectProduct.gql";
import { useField } from "vee-validate";
import { useAuth } from "@/store/auth";
const store = useAuth();
const adminId = computed(() => {
  return store.$state.uid;
});

const { value: subCategoryValue } = useField("subCategory");
const showSubCategory = ref(true);
const issueDate = ref();
const productStatus = ref();
const productReleaseStatus = ref();
const searchString = ref();
const productCategory = ref();
const productSubCategory = ref();
const limit = ref(10);
const offset = ref(0);
const itemId = ref([]);
const selectedProduct = ref();
const categoryListItems = ref([{ id: -1, name: "All" }]);
const have_reason = ref(false);
const updating = ref(false);
const subCategoryListItems = ref([{ id: -1, name: "All" }]);

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
const variable = computed(() => {
  return {
    offset: offset.value,
    limit: limit.value,
    where: {
      ...(productStatus.value?.length > 0 && productStatus.value != "All"
        ? { status: { _eq: new String(productStatus.value).toLowerCase() } }
        : {}),
      ...(productCategory.value && productCategory.value.id != -1
        ? {
            physical_product_sub_category: {
              physical_product_category: {
                id: { _eq: productCategory.value.id },
              },
            },
          }
        : {}),
      ...(productSubCategory.value && productSubCategory.value.id != -1
        ? {
            physical_product_sub_category: {
              id: { _eq: productSubCategory.value.id },
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
                store: {
                  name: { _iregex: searchString.value.trim() },
                },
              },

              {
                status: {
                  _iregex: searchString.value.trim(),
                },
              },

              {
                physical_product_sub_category: {
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
              {
                physical_product_sub_category: {
                  physical_product_category: {
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
      email: element.store.supplier.userById.email,
      date: element.created_at,
      title: element.title,
      store: element.store.name,
      price: element.unit_price,
      product_status: element.product_status,
      category:
        element.sub_category.category.language.translation_contents[0].name,
      subCategory: element.sub_category.language.translation_contents[0].name,
      release_status: element.release_status,
    };
  });
});
const total_products = computed(() => {
  return product_result.value?.total?.product?.value;
});
definePageMeta({
  layout: "custom",
});

watch(
  [
    issueDate,
    productStatus,
    productReleaseStatus,
    productCategory,
    productSubCategory,
    searchString,
  ],
  ([date, status, releaseStatus, pc, psc, ss]) => {
    offset.value = 0;
  }
);

watch(category_result, (newValue) => {
  if (newValue?.category)
    newValue.category.map((cat) => {
      categoryListItems.value.push({
        id: cat.id,
        name: cat.language.en[0].name,
      });
      cat.sub_categories.map((sub_cat) => {
        subCategoryListItems.value.push({
          id: sub_cat.id,
          name: sub_cat.language.en[0].name,
        });
      });
    });
});
watch(productCategory, (newValue) => {
  subCategoryValue.value = undefined;
  showSubCategory.value = false;
  setTimeout(() => {
    showSubCategory.value = true;
  }, 5);
  subCategoryListItems.value =
    newValue?.id != -1 ? [{ id: -1, name: "All" }] : [];
  category_result.value.category
    .find((cat) => cat.id == newValue.id)
    ?.sub_categories.map((subCat) => {
      subCategoryListItems.value.push({
        id: subCat.id,
        name: subCat.language.en[0].name,
      });
    });
});

const header = [
  "date",
  "product_name",
  "price",
  "store",
  "product_status",
  "category",
  "subCategory",
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
  console.log(selectedProduct.value);
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
