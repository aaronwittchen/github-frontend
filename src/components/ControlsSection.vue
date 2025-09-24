<template>
  <div class="w-full mb-8">
    <!-- Input and Get Summary button - stacked on mobile, side by side on larger screens -->
    <div class="w-full mb-4">
      <div class="flex flex-col sm:flex-row gap-2 w-full">
        <input
          type="text"
          placeholder="Enter GitHub username"
          class="form-input w-full h-12 sm:h-14 sm:flex-1"
          :value="username"
          @input="handleUsernameInput"
        />
        <button 
          class="btn-primary whitespace-nowrap h-12 sm:h-14 w-full sm:w-auto px-4 text-sm sm:text-base"
          @click="$emit('getSummary')"
        >
          Get Summary
        </button>
      </div>
    </div>

    <!-- Filters and Lucky button in their own row on small screens -->
    <div class="flex flex-col sm:flex-row gap-2 w-full">
      <!-- Language Dropdown - full width on mobile, flexible on larger screens -->
      <select
        class="select-input w-full sm:flex-1 sm:min-w-[160px]"
        :value="languageFilterLabel"
        @change="handleLanguageChange($event)"
      >
        <option value="Any">Any language</option>
        <optgroup label="Most Searched">
          <option
            v-for="lang in mostSearchedLanguages"
            :key="lang"
            :value="lang"
          >
            {{ lang }}
          </option>
        </optgroup>
        <optgroup label="Others">
          <option
            v-for="lang in otherLanguages"
            :key="lang"
            :value="lang"
          >
            {{ lang }}
          </option>
        </optgroup>
      </select>

      <!-- Star Range - full width on mobile, auto width on larger screens -->
      <select
        class="select-input w-full sm:w-auto"
        :value="selectedRangeLabel"
        @change="handleRangeChange($event)"
      >
        <option value="Any">Any stars</option>
        <option
          v-for="range in starRanges"
          :key="range.label"
          :value="range.label"
        >
          {{ range.label }} stars
        </option>
      </select>

      <!-- Country - full width on mobile, flexible on larger screens -->
      <select
        class="select-input w-full sm:flex-1 sm:min-w-[140px]"
        :value="countryFilterLabel"
        @change="handleCountryChange($event)"
      >
        <option value="Any">Any country</option>
        <option v-for="country in countryList" :key="country" :value="country">
          {{ country }}
        </option>
      </select>

      <!-- Lucky Button - full width on mobile, auto width on larger screens -->
      <button 
        class="btn-lucky w-full sm:w-auto whitespace-nowrap"
        @click="$emit('getRandomRepo')"
      >
        I'm Feeling Lucky
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import type { StarRange } from '../types';
import { languageColors } from '../utils/languages';

const mostSearchedLanguages: string[] = [
  'C', 'C++', 'C#', 'Java', 'Python', 'Go', 'Rust',
  'Ruby', 'PHP', 'Kotlin', 'Swift', 'Dart',
  'TypeScript', 'JavaScript',
  'HTML', 'CSS', 'Vue', 'React', 'Angular', 'Svelte'
];

const countryList: string[] = [
  'Australia', 'Austria', 'Belgium', 'Brazil', 'Canada', 
  'China', 'Denmark', 'Finland', 'France', 'Germany',
  'India', 'Indonesia', 'Ireland', 'Israel', 'Italy',
  'Japan', 'Mexico', 'Netherlands', 'New Zealand', 'Norway',
  'Poland', 'Russia', 'Singapore', 'South Africa', 'South Korea',
  'Spain', 'Sweden', 'Switzerland', 'Turkey', 'United Kingdom', 'United States'
];

export default defineComponent({
  name: 'ControlsSection',
  props: {
    username: {
      type: String,
      required: true,
    },
    selectedRange: {
      type: Object as () => { label: string; min: number; max: number } | null,
      required: true,
    },
    starRanges: {
      type: Array as () => Array<{ label: string; min: number; max: number }>,
      required: true,
    },
    country: {
      type: String,
      default: '',
    },
  },
  emits: [
    'update:username',
    'update:selectedRange',
    'update:language',
    'update:country',
    'getSummary',
    'getRandomRepo',
  ],
  data() {
    return {
      languageFilter: '',
      countryFilter: this.country || '',
      countryList,
    };
  },
  watch: {
    country(newVal) {
      this.countryFilter = newVal || '';
    },
  },
  computed: {
    mostSearchedLanguages(): string[] {
      return mostSearchedLanguages.filter(lang => lang in languageColors);
    },
    otherLanguages(): string[] {
      return Object.keys(languageColors)
        .filter(lang => !mostSearchedLanguages.includes(lang))
        .sort((a, b) => a.localeCompare(b));
    },
    languageFilterLabel(): string {
      return this.languageFilter || 'Any';
    },
    selectedRangeLabel(): string {
      return this.selectedRange?.label || 'Any';
    },
    countryFilterLabel(): string {
      return this.countryFilter || 'Any';
    },
  },
  methods: {
    handleUsernameInput(event: Event): void {
      const target = event.target as HTMLInputElement;
      if (target) {
        this.$emit('update:username', target.value);
      }
    },
    handleLanguageChange(event: Event): void {
      const target = event.target as HTMLSelectElement;
      if (!target) return;
      const value = target.value;
      if (value === 'Any') {
        this.languageFilter = '';
        this.$emit('update:language', null);
      } else {
        this.languageFilter = value;
        this.$emit('update:language', value);
      }
    },
    handleRangeChange(event: Event): void {
      const target = event.target as HTMLSelectElement;
      if (target) {
        const selectedLabel = target.value;
        if (selectedLabel === 'Any') {
          this.$emit('update:selectedRange', null);
        } else {
          const selectedRange = this.starRanges.find(range => range.label === selectedLabel);
          if (selectedRange) {
            this.$emit('update:selectedRange', selectedRange);
          }
        }
      }
    },
    handleCountryChange(event: Event): void {
      const target = event.target as HTMLSelectElement;
      if (!target) return;
      const value = target.value;
      if (value === 'Any') {
        this.countryFilter = '';
        this.$emit('update:country', null);
      } else {
        this.countryFilter = value;
        this.$emit('update:country', value);
      }
    },
  },
});
</script>
