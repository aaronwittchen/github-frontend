<template>
  <div class="w-full mb-8">
    <div class="flex flex-col sm:flex-row justify-between gap-4 w-full">
      <!-- LEFT SIDE: input + summary -->
      <div class="flex flex-col sm:flex-row gap-2 sm:w-auto">
        <input
          type="text"
          placeholder="Enter GitHub username"
          class="form-input"
          :value="username"
          @input="handleUsernameInput"
        />
        <button 
          class="btn-primary"
          @click="$emit('getSummary')"
        >
          Get Summary
        </button>
      </div>

      <!-- RIGHT SIDE: select + lucky -->
      <div class="flex gap-2 w-full sm:w-auto">
        <select
          class="select-input"
          :value="selectedRange?.label"
          @change="handleRangeChange($event)"
        >
          <option
            v-for="range in starRanges"
            :key="range.label"
            :value="range.label"
          >
            {{ range.label }} stars
          </option>
        </select>
        <button 
          class="btn-lucky"
          @click="$emit('getRandomRepo')"
        >
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
      type: Object as () => StarRange | null,
      required: true,
    },
    starRanges: {
      type: Array as () => StarRange[],
      required: true,
      validator: (value: StarRange[]) => {
        return value.every(range => 
          range && 
          typeof range === 'object' && 
          'label' in range && 
          'min' in range && 
          'max' in range
        );
      }
    },
  },
  emits: [
    'update:username',
    'update:selectedRange',
    'getSummary',
    'getRandomRepo',
  ],
  methods: {
    handleUsernameInput(event: Event): void {
      const target = event.target as HTMLInputElement;
      if (target) {
        this.$emit('update:username', target.value);
      }
    },
    handleRangeChange(event: Event): void {
      const target = event.target as HTMLSelectElement;
      if (target) {
        const selectedLabel = target.value;
        const selectedRange = this.starRanges.find(range => range.label === selectedLabel);
        if (selectedRange) {
          this.$emit('update:selectedRange', selectedRange);
        }
      }
    }
  },
});
</script>
