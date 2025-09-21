<template>
  <div class="terminal-box">
    <div class="terminal-prompt">
      <span class="terminal-prefix">Ξ</span>
      <span class="terminal-path">~/projects</span>
      <span class="terminal-separator">→</span>
      <span class="terminal-command">ls -la --sort=stars</span>
    </div>
    <div>
      <span class="terminal-info">[INFO]</span> Displaying
      <span>
        {{ randomRepo ? '1 project' : `${projectCount} projects` }} from GitHub
      </span>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import type { Repository } from '../types';

export default defineComponent({
  name: 'TerminalBox',
  props: {
    projectCount: {
      type: Number,
      required: true,
    },
    randomRepo: {
      type: Object as () => Repository | null,
      default: null,
    },
  },
});
</script>
