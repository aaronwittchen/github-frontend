<template>
  <div class="app-header">
    <img src="@/assets/pink.png" alt="Logo" class="app-logo" />
    <h1 class="app-title">
      devlogs<span class="terminal-blinking-cursor">█</span>
    </h1>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
export default defineComponent({
  name: 'AppHeader',
});
</script>

<style scoped>
.app-header {
  display: flex;
  align-items: center;
  margin-bottom: 2rem;
}

.app-title {
  font-size: 1.8rem;
  font-weight: bold;
  color: #f8f8f2;
  margin: 0;
}

.terminal-blinking-cursor {
  animation: blink 1s step-end infinite;
}

@keyframes blink {
  from,
  to {
    opacity: 1;
  }
  50% {
    opacity: 0;
  }
}
</style>
