<template>
  <div class="w-full mb-8">
    <div class="flex flex-col sm:flex-row justify-between gap-4 w-full">
      <!-- LEFT SIDE: input + summary -->
      <div class="flex flex-col sm:flex-row gap-2 sm:w-auto">
        <input
          :value="username"
          @input="$emit('update:username', $event.target.value)"
          type="text"
          placeholder="Enter GitHub username"
          class="form-input"
        />
        <button @click="$emit('getSummary')" class="btn-primary">
          Get Summary
        </button>
      </div>

      <!-- RIGHT SIDE: select + lucky -->
      <div class="flex gap-2 w-full sm:w-auto">
        <select
          :value="selectedRange"
          @change="
            $emit(
              'update:selectedRange',
              starRanges.find((range) => range.label === $event.target.value)
            )
          "
          class="select-input"
        >
          <option
            v-for="range in starRanges"
            :key="range.label"
            :value="range.label"
          >
            {{ range.label }} stars
          </option>
        </select>
        <button @click="$emit('getRandomRepo')" class="btn-lucky">
          I'm Feeling Lucky
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import type { StarRange } from '../types';

export default defineComponent({
  name: 'ControlsSection',
  props: {
    username: {
      type: String,
      required: true,
    },
    selectedRange: {
      type: Object as () => StarRange,
      required: true,
    },
    starRanges: {
      type: Array as () => StarRange[],
      required: true,
    },
  },
  emits: [
    'update:username',
    'update:selectedRange',
    'getSummary',
    'getRandomRepo',
  ],
});
</script>
