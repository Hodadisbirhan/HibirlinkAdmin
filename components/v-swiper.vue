<template>
  <div class="w-[300px] h-[250px] rounded-lg overflow-hidden">
    <Swiper
      class="w-full h-full"
      :modules="[SwiperAutoplay, SwiperEffectCreative]"
      :slides-per-view="1"
      :loop="true"
      :effect="'creative'"
      :creative-effect="{
        prev: {
          shadow: false,
          translate: ['-20%', 0, -1],
        },
        next: {
          translate: ['100%', 0, 0],
        },
      }"
    >
      <SwiperSlide
        v-for="(slide, index) in images"
        :key="index"
        class="w-full h-full"
      >
        <img
          :src="slide"
          alt=""
          srcset=""
          class="w-full h-full object-center object-cover"
        />
      </SwiperSlide>
    </Swiper>
  </div>
</template>
<script setup>
const props = defineProps({ images: Object });
</script>
