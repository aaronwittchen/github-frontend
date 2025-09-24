<template>
  <a
    :href="repo.htmlUrl"
    target="_blank"
    class="block bg-[#232323] hover:bg-[#2a2a2a] rounded-lg p-4 border border-[#FFB86C] transition-all hover:shadow-lg hover:shadow-[#FFB86C]/20 font-mono"
  >
    <!-- Title and status row -->
    <div class="flex justify-between items-center mb-2">
      <div class="flex items-center gap-2">
        <span class="text-[#FFB86C]">&lt;&gt;</span>
        <span
          :class="statusClass"
          class="border px-2 py-0.5 text-xs text-[#A89984]"
        >
          {{ isRecentlyUpdated(repo.updatedAt) ? 'in progress' : 'active' }}
        </span>
      </div>
      <div class="flex items-center text-[#FFB86C] text-sm">
        <span>★</span>
        <span class="ml-1">{{ repo.stars }}</span>
      </div>
    </div>

    <!-- Repository name -->
    <h4 class="text-lg font-semibold text-[#FFB86C] mb-2">{{ repo.name }}</h4>

    <!-- Description -->
    <p v-if="repo.description" class="text-[#A89984] text-sm mb-4 line-clamp-2">
      {{ repo.description }}
    </p>

    <!-- Languages and Stats -->
    <div class="space-y-3 mb-3">
      <!-- Most used languages scale -->
      <div v-if="repo.languages && repo.languages.length > 0" class="space-y-2">
        <div class="w-full h-2 bg-[#2a2a2a] rounded overflow-hidden border border-[#3a3a3a]">
          <div
            v-for="(lang, idx) in repo.languages"
            :key="idx"
            class="h-full inline-block"
            :style="{
              width: `${Math.max(0, Math.min(100, lang.percentage))}%`,
              backgroundColor: getLanguageColor(lang.name)
            }"
            :title="`${lang.name}: ${lang.percentage.toFixed(1)}%`"
          ></div>
        </div>
        <div class="flex flex-wrap gap-2 text-[11px] text-[#A89984]">
          <span
            v-for="(lang, idx) in repo.languages.slice(0, 5)"
            :key="`label-${idx}`"
            class="inline-flex items-center gap-1"
          >
            <span class="w-2.5 h-2.5 rounded-full" :style="{ backgroundColor: getLanguageColor(lang.name) }"></span>
            <span>{{ lang.name }} ({{ lang.percentage.toFixed(1) }}%)</span>
          </span>
        </div>
      </div>
      <div v-else-if="repo.language" class="space-y-2">
        <div class="w-full h-2 bg-[#2a2a2a] rounded overflow-hidden border border-[#3a3a3a]">
          <div
            class="h-full"
            :style="{ width: '100%', backgroundColor: getLanguageColor(repo.language) }"
            :title="`${repo.language}: 100%`"
          ></div>
        </div>
        <div class="flex flex-wrap gap-2 text-[11px] text-[#A89984]">
          <span class="inline-flex items-center gap-1">
            <span class="w-2.5 h-2.5 rounded-full" :style="{ backgroundColor: getLanguageColor(repo.language) }"></span>
            <span>{{ repo.language }} (100%)</span>
          </span>
        </div>
      </div>
      <!-- Languages -->
      <div
        v-if="repo.languages && repo.languages.length > 0"
        class="flex flex-wrap items-center gap-2 text-xs"
      >
        <span class="text-[#A89984]">Languages:</span>
        <template
          v-for="(lang, index) in repo.languages.slice(0, 3)"
          :key="index"
        >
          <span class="px-2 py-0.5 border border-[#FFB86C] text-gray-300">{{
            lang.name
          }}</span>
        </template>
      </div>
      <div
        v-else-if="repo.language"
        class="flex flex-wrap items-center gap-2 text-xs"
      >
        <span class="text-[#A89984]">Language:</span>
        <span class="px-2 py-0.5 border border-[#FFB86C] text-gray-300">{{
          repo.language
        }}</span>
      </div>

      <!-- Stats -->
      <div class="flex flex-wrap items-center gap-4 text-xs text-[#A89984]">
        <div v-if="repo.forks !== undefined" class="flex items-center">
          <svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path
              fill-rule="evenodd"
              d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z"
              clip-rule="evenodd"
            />
          </svg>
          {{ repo.forks }} {{ repo.forks === 1 ? 'fork' : 'forks' }}
        </div>

        <div v-if="repo.openIssues !== undefined" class="flex items-center">
          <svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path
              fill-rule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h2a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
              clip-rule="evenodd"
            />
          </svg>
          {{ repo.openIssues }} {{ repo.openIssues === 1 ? 'issue' : 'issues' }}
        </div>
      </div>
    </div>

    <!-- Divider -->
    <div class="border-t border-dashed border-[#FFB86C] my-3"></div>

    <!-- GitHub link -->
    <div class="flex items-center justify-center gap-4 mb-3">
      <button
        @click.stop.prevent="copyToClipboard"
        class="flex items-center text-[#A89984] hover:text-[#FFB86C] transition-colors text-sm"
        :title="copyButtonText"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
        </svg>
        {{ copyButtonText }}
      </button>
      <a
        :href="repo.htmlUrl"
        target="_blank"
        class="flex items-center text-[#FFB86C] hover:text-white transition-colors text-sm"
      >
        <span class="underline">Code</span>
      </a>
    </div>

    <!-- Updated date -->
    <div class="border-t border-dashed border-[#FFB86C] pt-3 text-center">
      <p class="text-sm text-[#A89984]">
        Updated: {{ formatDate(repo.updatedAt) }}
      </p>
    </div>
  </a>
</template>

<script lang="ts">
import { defineComponent, computed, ref } from 'vue';
import type { Repository } from '../types';
import { getLanguageColor } from '../utils/languages';

export default defineComponent({
  name: 'RepositoryCard',
  props: {
    repo: {
      type: Object as () => Repository,
      required: true,
    },
  },
  emits: [],
  setup(props) {
    const isRecentlyUpdated = (dateString: string) => {
      const date = new Date(dateString);
      const now = new Date();
      const diffTime = Math.abs(now.getTime() - date.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays <= 7;
    };

    const statusClass = computed(() =>
      isRecentlyUpdated(props.repo.updatedAt)
        ? 'border-[#FFB86C] text-[#FFB86C]'
        : 'border-[#A89984] text-[#A89984]'
    );

    const copyButtonText = ref('Share');

    const copyToClipboard = async () => {
      try {
        await navigator.clipboard.writeText(props.repo.htmlUrl);
        copyButtonText.value = 'Copied!';
        setTimeout(() => {
          copyButtonText.value = 'Share';
        }, 2000);
      } catch (err) {
        console.error('Failed to copy URL: ', err);
        copyButtonText.value = 'Error';
        setTimeout(() => {
          copyButtonText.value = 'Share';
        }, 2000);
      }
    };

    const formatDate = (dateString: string) => {
      if (!dateString) return '';
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('en-US', {
        timeZone: 'UTC',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }).format(date);
    };

  return { isRecentlyUpdated, formatDate, statusClass, getLanguageColor };
  },
});
</script>
