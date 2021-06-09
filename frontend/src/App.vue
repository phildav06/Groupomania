<template>
  <div class="flex flex-col min-h-screen">
    <header class="flex items-center border-b border-gray-400 bg-indigo-900">
      <div class="bg-white">
        <!--  logo ici -->
      </div>
      <router-link to="/message" class="p-4 mr-3 text-white text-2xl">
      </router-link>
      <h1 class="text-white font-black text-xl">{{ $route.name }}</h1>
    </header>
    <div class="flex items-center justify-center">
      <div class="w-10 z-10 pl-1 pointer-events-none flex items-center justify-center">
        <i class="fas fa-camera text-gray-400 text-lg"></i>
      </div>
      <input type="text" class="w-80 -ml-10 pl-10 pr-3 py-2 rounded-lg border-2 border-gray-200 outline-none focus:border-indigo-500" placeholder="De quoi voulez-vous parler ?">
    </div>

    <main class="flex-1 overflow-scroll">
      <router-view />
    </main>

    <footer class="grid grid-cols-4 border-t border-gray-400 bg-indigo-900">
      <router-link
        v-for="(route, i) in routes"
        :key="i"
        :to="route.path"
        class="p-4 text-center text-2xl text-white"
      >
        <i :class="route.iconClass"></i>
      </router-link>
    </footer>
  </div>
</template>

<script>
import { ref, onBeforeMount } from "vue";
import { useRouter } from "vue-router";
export default {
  setup() {
    const routes = ref([]);
    const router = useRouter();
    onBeforeMount(() => {
      routes.value = router.options.routes.filter((r) => r.mainMenu);
    });
    return {
      routes,
    };
  },
};
</script>