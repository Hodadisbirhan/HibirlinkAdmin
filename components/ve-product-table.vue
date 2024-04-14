<template>
  <div class="min-h-screen relative w-full pb-14 text-sm">
    <div
      v-if="showId"
      class="fixed left-0 top-0 h-screen transition-colors duration-1000 ease-in-out w-full bg-black/20 z-40 flex items-center justify-center"
    >
      <div
        class="bg-slate-50 shadow-md rounded-lg relative text-gray py-10 px-8"
      >
        <XMarkIcon
          class="fill-red absolute top-4 right-3 w-8 h-8 cursor-pointer"
          @click="showId = false"
        />
        <div class="flex md:flex-row flex-col-reverse gap-4 pb-4 pt-3">
          <img
            :src="supplier[idImagesIndex].idFrontImage"
            alt=""
            srcset=""
            class="w-[300px] h-[200px] object-cover"
          />
          <img
            :src="supplier[idImagesIndex].idBackImage"
            alt=""
            srcset=""
            class="w-[300px] h-[200px] object-cover"
          />
        </div>
        <p class="font-semibold">
          <span class="text-blue-500">Name</span> :
          {{ supplier[idImagesIndex].firstName }}
          {{ supplier[idImagesIndex].lastName }}
        </p>
        <p class="font-semibold">
          <span class="text-blue-500">Email</span> :
          {{ supplier[idImagesIndex].email }}
        </p>
        <p class="font-semibold">
          <span class="text-blue-500">Issued Date</span> :
          {{ supplier[idImagesIndex].date }}
        </p>
        <p class="font-semibold capitalize">
          <span class="text-blue-500">Supplier Status</span> :
          {{ supplier[idImagesIndex].status }}
        </p>
      </div>
    </div>
    <div class="flex flex-col items-center sticky top-16 bg-green1000 z-30 py-2">
      <div class="flex w-full items-center justify-center gap-3">
        <div
          class="flex flex-2 items-center justify-center relative w-full lg:w-[90%] px-5"
        >
          <input
            type="text"
            v-model="searchString"
            @keyup="newString"
            class="peer outline-none focus:ring-0 py-2 focus:shadow-sm focus:border-blue-300 shadow-blue-400 border-none focus:border-none w-full px-14"
            placeholder="Search with product name. . ."
          />
          <MagnifyingGlassIcon
            class="peer-focus:fill-green400 fill-gray w-6 h-6 absolute left-8"
          />
        </div>
        <v-select
          class="w-[150px]"
          label="Status"
          :items="['All', 'Pending', 'verified', 'Suspended']"
          name="status"
          v-model="statusFilter"
        />
        <v-select
          class="w-[150px]"
          label="Time"
          :items="['All', 'This Week', 'This month', 'This Year']"
          name="time"
          v-model="timeFilter"
        />
      </div>
    </div>
    <div class="w-full overflow-x-scroll">
      <table class="min-w-[1200px] h-full w-full mb-6">
        <thead class="">
          <tr class="text-green400">
            <th class="text-start pl-3">No</th>
            <th class="text-start">Date</th>
            <th class="text-start">Name</th>
            <th class="text-start">Email</th>
            <th class="text-start">Phone Number</th>
            <th class="text-start">Status</th>
            <th class="text-start">Action</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(info, index) in supplier"
            :key="index"
            class="border-b border-b-slate-400/20 even:bg-blue-50 text-gray hover:bg-blue-50 cursor-pointer"
            @click="showID(index)"
          >
            <td class="pr-8 py-3 pl-3">{{ index + 1 }}</td>
            <td class="pr-8 py-2">{{ info.date }}</td>
            <td class="pr-8 py-2">{{ info.firstName }} {{ info.lastName }}</td>
            <td class="pr-8 py-2">{{ info.email }}</td>
            <td class="pr-8 py-2">{{ info.phoneNumber }}</td>
            <td class="pr-8 py-2">
              <span
                :class="
                  info.status == 'pending'
                    ? 'text-gray bg-gray/10'
                    : info.status == 'verified'
                    ? 'text-green400 bg-green400/10'
                    : 'text-red bg-red/10'
                "
                class="px-3 rounded-full"
                >{{ info.status }}</span
              >
            </td>
            <td @click.stop="null">
              <dropdown
                v-if="info.status == 'pending'"
                :leading_icon="EllipsisHorizontalIcon"
                :items="[{ name: 'Verify' }, { name: 'Reject' }]"
              />
              <dropdown
                v-if="info.status == 'verified'"
                :leading_icon="EllipsisHorizontalIcon"
                :items="[{ name: 'Suspend' }, { name: 'Reject' }]"
              />
              <dropdown
                v-if="info.status == 'suspended'"
                :leading_icon="EllipsisHorizontalIcon"
                :items="[{ name: 'Release' }, { name: 'Reject' }]"
              />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
<script setup lang="ts">
import {
  EllipsisHorizontalIcon,
  MagnifyingGlassIcon,
  XMarkIcon,
} from "@heroicons/vue/24/solid";
interface item {
  name: string;
}
interface supplierData {
  id: number;
  name: string;
  firstName: string;
  lastName: string;
  email: string;
  date: string;
  phoneNumber: string;
  status: string;
  idFrontImage: string;
  idBackImage: string;
}
interface suppliers {
  supplier: Array<supplierData>;
}

const props = defineProps<suppliers>();
const emits = defineEmits(["searchString"]);
const statusFilter = ref("All");
const timeFilter = ref("All");
const searchString = ref("");
const newString = (value: any) => {
  emits("searchString", {
    searchKey: searchString.value,
    status: statusFilter.value,
    time: timeFilter.value,
  });
};

watch(timeFilter, (value) => {
  newString("");
});
watch(statusFilter, (value) => {
  newString("");
});

const idImagesIndex = ref(0);
const showId = ref(false);
const showID = (index: number) => {
  idImagesIndex.value = index;
  showId.value = true;
};
</script>
