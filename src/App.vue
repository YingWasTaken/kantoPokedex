<template>
  <Header />
  <router-view />
</template>

<script>
import Header from './components/Header/Header.vue';
import Pokedex from './components/Pokedex/Pokedex.vue';
import PokemonView from './components/PokemonView/PokemonView.vue';

export default {
    name: 'App',
    components: {
        Header,
        Pokedex,
        PokemonView
    },
};
</script>

<style scoped lang="scss"></style>