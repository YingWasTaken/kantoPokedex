<template>
    <header class="header">
         <router-link to="/" class="header__title">
            <img class="header__title-logo" src="../../assets/white-icon.png" alt="Pokeball Logo"/>
            <h1 class="header__title-text">Pokedex</h1>
        </router-link>
    </header>
</template>

<script>
export default {
    name: 'Header',
};
</script>

<style scoped lang="scss">
.header {
    background-color: rgb(255, 56, 56);
    color: white;
    padding: 1rem;
    align-items: center;
    justify-content: center;
    display: flex;

    text-decoration: none;

    z-index: 100;
    position: sticky;
    top: 0;

    &__title {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        text-decoration: none;
        color: white;

        &-logo {
            width: 2rem;
            height: 2rem;
        }

        &-text {
            font-size: 1.5rem;
            font-weight: bold;
        }
    }

}
</style>