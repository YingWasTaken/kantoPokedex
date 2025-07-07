import { createRouter, createWebHistory } from 'vue-router';
import Pokedex from '../components/Pokedex/Pokedex.vue';
import PokemonView from '../components/PokemonView/PokemonView.vue';

const routes = [
  { path: '/', name: 'Home', component: Pokedex },
  { path: '/pokemon/:name', name: 'Pokemon', component: PokemonView, props: true },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
