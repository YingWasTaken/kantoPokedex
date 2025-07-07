<template>
  <div class="pokemon-page" :style="{ '--type-color': typeColor }">
    <div class="pokemon-top-section">
      <div class="pokemon-header">
        <button @click="$router.push('/')" class="back-button">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15 18L9 12L15 6" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
        <h1 class="pokemon-name">{{ capitalizedName }}</h1>
        <span class="pokemon-number">#{{ pokemon.id.toString().padStart(3, '0') }}</span>
      </div>

      <div class="pokemon-navigation">
        <button @click="goToPreviousPokemon" class="nav-arrow" :disabled="pokemon.id <= 1">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15 18L9 12L15 6" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
        
        <div class="pokemon-image-container">
          <img :src="pokemon.image" :alt="pokemon.name" class="pokemon-image" />
        </div>
        
        <button @click="goToNextPokemon" class="nav-arrow" :disabled="pokemon.id >= 151">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 18L15 12L9 6" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
      </div>

      <div class="pokemon-types">
        <span 
          v-for="type in pokemon.types" 
          :key="type" 
          class="type-badge"
          :style="{ backgroundColor: getTypeColor(type) }"
        >
          {{ type }}
        </span>
      </div>
    </div>

    <div class="pokemon-details-card">
      <div class="about-section">
        <h3 class="section-title">About</h3>
        <div class="about-grid">
          <div class="about-item">
            <span class="about-label">Height</span>
            <span class="about-value">{{ pokemon.height }} m</span>
          </div>
          <div class="about-item">
            <span class="about-label">Weight</span>
            <span class="about-value">{{ pokemon.weight }} kg</span>
          </div>
          <div class="about-item">
            <span class="about-label">Abilities</span>
            <span class="about-value">{{ pokemon.abilities.join(', ') }}</span>
          </div>
        </div>
      </div>

      <div class="pokedex-entry">
        <p>{{ pokemon.description }}</p>
      </div>

      <div class="stats-section">
        <h3 class="section-title">Base Stats</h3>
        <div class="stats-grid">
          <div v-for="stat in pokemon.stats" :key="stat.name" class="stat-item">
            <span class="stat-name">{{ stat.name }}</span>
            <span class="stat-value">{{ stat.value }}</span>
            <div class="stat-bar">
              <div 
                class="stat-bar-fill" 
                :style="{ 
                  width: `${Math.min(100, stat.value / 2)}%`,
                  backgroundColor: typeColor
                }"
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['name'],
  data() {
    return {
      pokemon: {
        id: 0,
        name: '',
        image: '',
        types: [],
        height: 0,
        weight: 0,
        abilities: [],
        description: '',
        stats: []
      },
      typeColors: {
        normal: '#A8A878',
        fire: '#F08030',
        water: '#6890F0',
        electric: '#F8D030',
        grass: '#78C850',
        ice: '#98D8D8',
        fighting: '#C03028',
        poison: '#A040A0',
        ground: '#E0C068',
        flying: '#A890F0',
        psychic: '#F85888',
        bug: '#A8B820',
        rock: '#B8A038',
        ghost: '#705898',
        dragon: '#7038F8',
        dark: '#705848',
        steel: '#B8B8D0',
        fairy: '#EE99AC'
      }
    };
  },
  computed: {
    typeColor() {
      return this.typeColors[this.pokemon.types[0]] || '#777';
    },
    capitalizedName() {
      return this.pokemon.name.charAt(0).toUpperCase() + this.pokemon.name.slice(1);
    }
  },
  async created() {
    await this.fetchPokemon();
  },
  methods: {
    getTypeColor(type) {
      return this.typeColors[type] || '#777';
    },
    async fetchPokemon() {
      try {
        const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${this.name}`);
        const data = await res.json();
        
        const speciesRes = await fetch(data.species.url);
        const speciesData = await speciesRes.json();

        this.pokemon = {
          id: data.id,
          name: data.name,
          image: data.sprites.other['official-artwork'].front_default || data.sprites.front_default,
          types: data.types.map(t => t.type.name),
          height: data.height / 10,
          weight: data.weight / 10,
          abilities: data.abilities.map(a => a.ability.name.replace('-', ' ')),
          description: speciesData.flavor_text_entries.find(
            entry => entry.language.name === 'en'
          ).flavor_text.replace(/\n|\f/g, ' '),
          stats: [
            { name: 'HP', value: data.stats[0].base_stat },
            { name: 'Attack', value: data.stats[1].base_stat },
            { name: 'Defense', value: data.stats[2].base_stat },
            { name: 'Sp. Atk', value: data.stats[3].base_stat },
            { name: 'Sp. Def', value: data.stats[4].base_stat },
            { name: 'Speed', value: data.stats[5].base_stat }
          ]
        };
      } catch (error) {
        console.error('Error fetching Pokémon:', error);
      }
    },
    goToPreviousPokemon() {
      if (this.pokemon.id > 1) {
        this.$router.push(`/pokemon/${this.pokemon.id - 1}`);
      }
    },
    goToNextPokemon() {
      if (this.pokemon.id < 151) {
        this.$router.push(`/pokemon/${this.pokemon.id + 1}`);
      }
    }
  },
  watch: {
    name() {
      this.fetchPokemon();
    }
  }
};
</script>

<style scoped>
.pokemon-page {
  --type-color: #777;
  min-height: 100vh;
  background-color: #f5f5f5;
  position: relative;
}

.pokemon-top-section {
  background-color: var(--type-color);
  padding: 1.5rem 1rem 2rem;
  color: white;
  position: relative;

  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      margin: 0rem 1.5rem 0rem;
}

.pokemon-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
}

.back-button {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.pokemon-name {
  font-size: 1.8rem;
  font-weight: bold;
  margin: 0;
  text-transform: capitalize;
}

.pokemon-number {
  font-size: 1.2rem;
  opacity: 0.8;
}

.pokemon-navigation {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  margin: 1rem 0;
}

.nav-arrow {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  border-radius: 50%;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background-color 0.2s;
}

.nav-arrow:hover {
  background: rgba(255, 255, 255, 0.3);
}

.nav-arrow:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pokemon-image-container {
  width: 200px;
  height: 200px;
  position: relative;
  z-index: 2;
}

.pokemon-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2));
}

.pokemon-types {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 1rem;
}

.type-badge {
  padding: 0.4rem 1rem;
  border-radius: 20px;
  font-weight: bold;
  text-transform: capitalize;
  color: white;
  font-size: 0.9rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.pokemon-details-card {
  background: white;
  border-radius: 10px;
  margin: -1rem 1.5rem 2rem;
  padding: 1.5rem;
  position: relative;
  z-index: 1;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border: 5px solid var(--type-color);
}

.about-section {
  margin-bottom: 1.5rem;
}

.section-title {
  color: var(--type-color);
  font-size: 1.2rem;
  margin-bottom: 1rem;
  text-align: center;
}

.about-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  text-align: center;
}

.about-item {
  display: flex;
  flex-direction: column;
}

.about-label {
  font-size: 0.8rem;
  color: #666;
  margin-bottom: 0.3rem;
}

.about-value {
  font-weight: bold;
  color: #333;
}

.pokedex-entry {
  background: #f9f9f9;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1.5rem;
  font-size: 0.9rem;
  line-height: 1.5;
  color: #555;
}

.stats-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.8rem;
}

.stat-item {
  display: grid;
  grid-template-columns: 80px 40px 1fr;
  align-items: center;
  gap: 0.5rem;
}

.stat-name {
  font-size: 0.9rem;
  color: #666;
  text-transform: capitalize;
}

.stat-value {
  font-weight: bold;
  color: #333;
  text-align: right;
}

.stat-bar {
  height: 8px;
  background: #eee;
  border-radius: 4px;
  overflow: hidden;
}

.stat-bar-fill {
  height: 100%;
  border-radius: 4px;
}

@media (max-width: 480px) {
  .pokemon-name {
    font-size: 1.5rem;
  }
  
  .pokemon-image-container {
    width: 160px;
    height: 160px;
  }
  
  .about-grid {
    grid-template-columns: 1fr;
  }
}
</style>