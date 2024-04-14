import graphql from "@rollup/plugin-graphql";

export default defineNuxtConfig({
  vite: {
    plugins: [graphql()],
  },
  build: {
    transpile: ["graphql", "@apollo/client", "@vue/apollo-composable"],
  },
  app: {
    head: {
      charset: "utf-16",
      viewport: "width=500, initial-scale=1",
      meta: [
        // <meta name="description" content="My amazing site">
        {
          name: "description",
          content:
            "Create a wider and strong network among the community through revolutionizing the way peoples think, live, communicate, share, sell, buy, get services, provide services and democratizing the quality of living. Provide a wider strong network which helps to link everything, connect fair services with customers, provide quality products with fair price.",
        },
      ],
      link: [{ rel: "icon", href: "/logo.svg" }],
    },
  },

  ssr: false,

  css: [
    "~/assets/css/tailwind.css",
    "@vueup/vue-quill/dist/vue-quill.snow.css",
  ],

  modules: [
    "nuxt-icon",
    "@vueuse/nuxt",
    "@pinia-plugin-persistedstate/nuxt",
    "@pinia/nuxt",
    "@nuxt/image-edge",
    [
      "nuxt-swiper",
      {
        // Swiper options
      },
    ],
  ],
  runtimeConfig: {
    firebaseApiKey: "",
    firebaseAuthDomain: "",
    firebaseProjectId: "",
    storagePacket: "",
    firebaseMessageSenderId: "",
    firebaseAppId: "",

    graphqlEndpoint: "",
    restEndpoint: "",

    public: {
      firebaseApiKey: "",
      firebaseAuthDomain: "",
      firebaseProjectId: "",
      storagePacket: "",
      firebaseMessageSenderId: "",
      firebaseAppId: "",
      graphqlEndpoint: "",
      restEndpoint: "",
    },
  },
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },

  // image: {
  //   // Options
  // }
});
