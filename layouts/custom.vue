<template>
  <main
    class="min-w-full min-h-screen max-h-screen bg-green1000 flex transition-all ease-in-out duration-300 gap-x-4"
  >
    <nav
      class="bg-white shadow-md flex min-h-full lg:w-60 overflow-y-auto overflow-x-hidden bg-opacity-50 flex-col items-start justify-between pt-8 pb-4 4xl:gap-20 2xl:gap-16 gap-12"
    >
      <div
        class="flex items-center justify-center w-full flex-col sm:px-4 px-2 gap-4"
      >
        <svg
          width="13"
          height="35"
          viewBox="0 0 13 35"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M2.12598 2H3.36696C7.25362 2 10.3961 5.16633 10.3668 9.05288L10.188 32.7112"
            stroke="#56B855"
            stroke-width="3.7"
            stroke-linecap="round"
          />
          <path
            d="M2.12598 14.8125L2 32.8125"
            stroke="#56B855"
            stroke-width="3.7"
            stroke-linecap="round"
          />
        </svg>
      </div>
      <ul
        class="flex-1 text-sm flex flex-col lg:gap-4 gap-5 text-gray-500 transition-colors ease-in-out duration-300"
      >
        <h3
          class="lg:px-6 sm:px-3 px-2 font-bold sm:text-base text-sm text-gray"
        >
          Menu
        </h3>
        <NuxtLink
          to="/"
          class="relative w-full sm:px-4 px-2 cursor-pointer flex items-center lg:justify-start justify-center h-[1.7rem] font-semibold text-gray hover:text-primary transition-all ease-in-out duration-300"
        >
          <ChartBarIcon
            class="peer lg:h-5 lg:w-5 lg:mr-2 h-6 w-6 transition-all ease-in-out duration-200"
          />
          <p
            class="fixed left-16 sm:left-20 md:left-24 bg-primary drop-shadow-lg text-white px-2 py-1 lg:p-0 scale-0 peer-hover:scale-100 transition-all ease-in-out duration-200 rounded-md z-10 w-fit lg:static lg:text-current lg:scale-100 lg:drop-shadow-none lg:bg-transparent lg:flex text-sm"
          >
            Dashboard
          </p>
        </NuxtLink>
        <NuxtLink
          to="/supplier"
          class="relative w-full sm:px-4 px-2 cursor-pointer flex items-center lg:justify-start justify-center h-[1.7rem] font-semibold text-gray hover:text-primary transition-all ease-in-out duration-300"
        >
          <UserGroupIcon
            class="peer lg:h-5 lg:w-5 lg:mr-2 h-6 w-6 transition-all ease-in-out duration-200"
          />
          <p
            class="fixed left-16 sm:left-20 md:left-24 bg-primary drop-shadow-lg text-white px-2 py-1 lg:p-0 text-sm scale-0 peer-hover:scale-100 transition-all ease-in-out duration-200 rounded-md z-10 w-fit lg:static lg:text-current lg:scale-100 lg:drop-shadow-none lg:bg-transparent lg:flex"
          >
            Suppliers
          </p>
        </NuxtLink>
        <NuxtLink
          to="/store"
          class="relative w-full sm:px-4 px-2 cursor-pointer flex items-center lg:justify-start justify-center h-[1.7rem] font-semibold text-gray hover:text-primary transition-all ease-in-out duration-300"
        >
          <BuildingStorefrontIcon
            class="peer lg:h-5 lg:w-5 lg:mr-2 h-6 w-6 transition-all ease-in-out duration-200"
          />
          <p
            class="fixed left-16 sm:left-20 md:left-24 bg-primary drop-shadow-lg text-white px-2 py-1 lg:p-0 text-sm scale-0 peer-hover:scale-100 transition-all ease-in-out duration-200 rounded-md z-10 w-fit lg:static lg:text-current lg:scale-100 lg:drop-shadow-none lg:bg-transparent lg:flex"
          >
            Store
          </p>
        </NuxtLink>
        <NuxtLink
          to="/products"
          class="relative w-full sm:px-4 px-2 cursor-pointer flex items-center lg:justify-start justify-center h-[1.7rem] font-semibold text-gray hover:text-primary transition-all ease-in-out duration-300"
        >
          <RectangleStackIcon
            class="peer lg:h-5 lg:w-5 lg:mr-2 h-6 w-6 transition-all ease-in-out duration-200"
          />
          <p
            class="fixed left-16 sm:left-20 md:left-24 bg-primary drop-shadow-lg text-white px-2 py-1 lg:p-0 text-sm scale-0 peer-hover:scale-100 transition-all ease-in-out duration-200 rounded-md z-10 w-fit lg:static lg:text-current lg:scale-100 lg:drop-shadow-none lg:bg-transparent lg:flex"
          >
            Products
          </p>
        </NuxtLink>
        <NuxtLink
          to="/services"
          class="relative w-full sm:px-4 px-2 cursor-pointer flex items-center lg:justify-start justify-center h-[1.7rem] font-semibold text-gray hover:text-primary transition-all ease-in-out duration-300"
        >
          <SparklesIcon
            class="peer lg:h-5 lg:w-5 lg:mr-2 h-6 w-6 transition-all ease-in-out duration-200"
          />
          <p
            class="fixed left-16 sm:left-20 md:left-24 bg-primary drop-shadow-lg text-white px-2 py-1 lg:p-0 text-sm scale-0 peer-hover:scale-100 transition-all ease-in-out duration-200 rounded-md z-10 w-fit lg:static lg:text-current lg:scale-100 lg:drop-shadow-none lg:bg-transparent lg:flex"
          >
            Services
          </p>
        </NuxtLink>
        <NuxtLink
          to="/category"
          class="relative w-full sm:px-4 px-2 cursor-pointer flex items-center lg:justify-start justify-center h-[1.7rem] font-semibold text-gray hover:text-primary transition-all ease-in-out duration-300"
        >
          <CpuChipIcon
            class="peer lg:h-5 lg:w-5 lg:mr-2 h-6 w-6 transition-all ease-in-out duration-200"
          />
          <p
            class="fixed left-16 sm:left-20 md:left-24 bg-primary drop-shadow-lg text-white px-2 py-1 lg:p-0 text-sm scale-0 peer-hover:scale-100 transition-all ease-in-out duration-200 rounded-md z-10 w-fit lg:static lg:text-current lg:scale-100 lg:drop-shadow-none lg:bg-transparent lg:flex"
          >
            Category
          </p>
        </NuxtLink>
        <NuxtLink
          to="/location"
          class="relative w-full sm:px-4 px-2 cursor-pointer flex items-center lg:justify-start justify-center h-[1.7rem] font-semibold text-gray hover:text-primary transition-all ease-in-out duration-300"
        >
          <ArrowPathRoundedSquareIcon
            class="peer lg:h-5 lg:w-5 lg:mr-2 h-6 w-6 transition-all ease-in-out duration-200"
          />
          <p
            class="fixed left-16 sm:left-20 md:left-24 bg-primary drop-shadow-lg text-white px-2 py-1 lg:p-0 text-sm scale-0 peer-hover:scale-100 transition-all ease-in-out duration-200 rounded-md z-10 w-fit lg:static lg:text-current lg:scale-100 lg:drop-shadow-none lg:bg-transparent lg:flex"
          >
            Location
          </p>
        </NuxtLink>
        <NuxtLink
          to="/delivery"
          class="relative w-full sm:px-4 px-2 cursor-pointer flex items-center lg:justify-start justify-center h-[1.7rem] font-semibold text-gray hover:text-primary transition-all ease-in-out duration-300"
        >
          <RectangleGroupIcon
            class="peer lg:h-5 lg:w-5 lg:mr-2 h-6 w-6 transition-all ease-in-out duration-200"
          />
          <p
            class="fixed left-16 sm:left-20 md:left-24 bg-primary drop-shadow-lg text-white px-2 py-1 lg:p-0 text-sm scale-0 peer-hover:scale-100 transition-all ease-in-out duration-200 rounded-md z-10 w-fit lg:static lg:text-current lg:scale-100 lg:drop-shadow-none lg:bg-transparent lg:flex"
          >
            Delivery
          </p>
        </NuxtLink>
        <NuxtLink
          to="/orders"
          class="relative w-full sm:px-4 px-2 cursor-pointer flex items-center lg:justify-start justify-center h-[1.7rem] font-semibold text-gray hover:text-primary transition-all ease-in-out duration-300"
        >
          <BriefcaseIcon
            class="peer lg:h-5 lg:w-5 lg:mr-2 h-6 w-6 transition-all ease-in-out duration-200"
          />
          <p
            class="fixed left-16 sm:left-20 md:left-24 bg-primary drop-shadow-lg text-white px-2 py-1 lg:p-0 text-sm scale-0 peer-hover:scale-100 transition-all ease-in-out duration-200 rounded-md z-10 w-fit lg:static lg:text-current lg:scale-100 lg:drop-shadow-none lg:bg-transparent lg:flex"
          >
            Order
          </p>
        </NuxtLink>
        <NuxtLink
          to="/assign_delivery"
          class="relative w-full sm:px-4 px-2 cursor-pointer flex items-center lg:justify-start justify-center h-[1.7rem] font-semibold text-gray hover:text-primary transition-all ease-in-out duration-300"
        >
          <CurrencyDollarIcon
            class="peer lg:h-5 lg:w-5 lg:mr-2 h-6 w-6 transition-all ease-in-out duration-200"
          />
          <p
            class="fixed left-16 sm:left-20 md:left-24 bg-primary drop-shadow-lg text-white px-2 py-1 lg:p-0 text-sm scale-0 peer-hover:scale-100 transition-all ease-in-out duration-200 rounded-md z-10 w-fit lg:static lg:text-current lg:scale-100 lg:drop-shadow-none lg:bg-transparent lg:flex"
          >
            Assigne Order
          </p>
        </NuxtLink>
        <NuxtLink
          to="/payment"
          class="relative w-full sm:px-4 px-2 cursor-pointer flex items-center lg:justify-start justify-center h-[1.7rem] font-semibold text-gray hover:text-primary transition-all ease-in-out duration-300"
        >
          <CurrencyDollarIcon
            class="peer lg:h-5 lg:w-5 lg:mr-2 h-6 w-6 transition-all ease-in-out duration-200"
          />
          <p
            class="fixed left-16 sm:left-20 md:left-24 bg-primary drop-shadow-lg text-white px-2 py-1 lg:p-0 text-sm scale-0 peer-hover:scale-100 transition-all ease-in-out duration-200 rounded-md z-10 w-fit lg:static lg:text-current lg:scale-100 lg:drop-shadow-none lg:bg-transparent lg:flex"
          >
            Payment
          </p>
        </NuxtLink>

        <div
          @click="logout"
          class="relative w-full mt-7 py-3 bg-light200 border border-primary rounded-md hover:bg-red gap-3 sm:px-4 px-2 cursor-pointer flex items-center lg:justify-start justify-center h-[1.7rem] font-semibold text-gray hover:text-primary transition-all ease-in-out duration-300"
        >
          <Icon name="gg:log-out" class="w-6 h-6" />
          <p
            class="fixed left-16 sm:left-20 md:left-24 bg-primary drop-shadow-lg text-white px-2 py-1 lg:p-0 text-sm scale-0 peer-hover:scale-100 transition-all ease-in-out duration-200 rounded-md z-10 w-fit lg:static lg:text-current lg:scale-100 lg:drop-shadow-none lg:bg-transparent lg:flex"
          >
            Logout
          </p>
        </div>
      </ul>
      <!-- 
      <div
        class="flex gap-6 text-gray-500 transition-colors ease-in-out duration-300"
      >
        <NuxtLink
          class="relative w-full sm:px-4 px-2 cursor-pointer flex items-center lg:justify-start justify-center h-[1.7rem] font-semibold text-gray hover:text-primary transition-all ease-in-out duration-300"
        >
          <CogIcon
            class="peer lg:h-5 lg:w-5 lg:mr-2 h-6 w-6 transition-all ease-in-out duration-200"
          />
          <p
            class="fixed left-16 sm:left-20 md:left-24 bg-primary drop-shadow-lg text-white px-2 py-1 lg:p-0 text-sm scale-0 peer-hover:scale-100 transition-all ease-in-out duration-200 rounded-md z-10 w-fit lg:static lg:text-current lg:scale-100 lg:drop-shadow-none lg:bg-transparent lg:flex"
          >
            Settings
          </p>
        </NuxtLink>
      </div> -->
    </nav>
    <section class="w-full h-screen overflow-hidden py-3 mr-5">
      <nav
        class="h-11 sticky top-0 w-full flex bg-white/50 shadow-sm items-center pr-10"
      >
        <div class="flex items-center justify-between w-full">
          <div class="px-4">
            <p class="text-gray text-lg capitalize font-bold">
              Welcome: {{ name }}
            </p>
          </div>
          <div
            class="gap-6 flex items-center text-sm px-2 py-1 rounded-xl bg-primaryvar2/40 justify-center text-gray font-bold"
          >
            {{ email }}
          </div>
        </div>
      </nav>
      <section class="h-full overflow-y-scroll">
        <slot />
      </section>
    </section>
  </main>
</template>

<style scoped>
.router-link-active {
  @apply text-primary;
}
.router-link-active::before {
  content: "";
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  background: #5678ff;
  height: 100%;
  width: 4px;
  transition: all 0.5s ease;
}
</style>

<script setup lang="ts">
import {
  ChartBarIcon,
  UserGroupIcon,
  RectangleStackIcon,
  SparklesIcon,
  CogIcon,
  CurrencyDollarIcon,
  CpuChipIcon,
  RectangleGroupIcon,
  BriefcaseIcon,
  BuildingStorefrontIcon,
  ArrowPathRoundedSquareIcon,
} from "@heroicons/vue/24/solid";
import { BellAlertIcon } from "@heroicons/vue/24/outline";
import { useAuth } from "~~/store/auth";
import { storeToRefs } from "pinia";
import logoutQl from "@/apollo/mutation/logout.gql";
const showMobileDrawer = ref<boolean>(false);
const {
  mutate: logOut,
  onError: onLogoutError,
  onDone: onLogoutResult,
} = useCustomMutation(logoutQl);

onLogoutResult((result) => {
  const { setToken, setUID, setName, setRole, setEmail } = useAuth();
  setToken("");
  setUID("");
  setName("");
  setRole("");
  setEmail("");
  window.location.href = "http://localhost:3000";
});

onLogoutError((error) => {
  console.log("Log out Error: " + error);
});

const logout = async () => {
  const { uid } = useAuth();

  logOut({ uid });
};
const { name, email } = useAuth();
</script>
