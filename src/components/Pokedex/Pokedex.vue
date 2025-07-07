<template>
  <div class="pokedex-container">
    <router-link
        class="pokemon-card"
        v-for="pokemon in pokemons"
        :key="pokemon.name"
        :to="`/pokemon/${pokemon.name}`"
        >
        <img :src="pokemon.image" :alt="pokemon.name" />
        <p class="pokemon-name">{{ pokemon.name }}</p>
    </router-link>
  </div>
</template>

<script>
export default {
  name: 'Pokedex',
  data() {
    return {
      pokemons: [],
    };
  },

  methods: {
    async fetchMethods() {
        await this.fetchPokemons();
    },
    async fetchPokemons() {
      const res = await fetch('https://pokeapi.co/api/v2/pokemon?limit=151');
      const data = await res.json();
      const pokemonData = await Promise.all(
        data.results.map(async (p) => {
          const pokeDetails = await fetch(p.url);
          const pokeJson = await pokeDetails.json();
          return {
            name: p.name,
            image: pokeJson.sprites.front_default,
          };
        })
      );
      this.pokemons = pokemonData;
    },
  },
    created() {
        this.fetchMethods();
  },
};
</script>

<style scoped lang="scss">
.pokedex-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 1rem;
  padding: 2rem;
  background: #fafafa;
}

.pokemon-card {
  background: white;
  border-radius: 16px;
  padding: 1.5rem 1rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
  text-align: center;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  border: 1px solid #e2e2e2;
   text-decoration: none;
}

.pokemon-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1);
  cursor: pointer;
}

.pokemon-card img {
  width: 96px;
  height: 96px;
  object-fit: contain;
  margin-bottom: 0.75rem;
}

.pokemon-name {
  font-weight: 600;
  font-size: 1rem;
  color: #333;
  text-transform: capitalize;
  margin: 0;
  text-decoration: none;
}
</style>
