<script setup>
import NavHeader from './components/NavHeader.vue'
import FooterComponent from './components/FooterComponent.vue'
</script>

<template>
  <div class="app">
    <nav-header></nav-header>
    <router-view></router-view>
    <footer-component></footer-component>
  </div>
</template>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.app {
  font-family: 'Microsoft YaHei', sans-serif;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}
</style>
