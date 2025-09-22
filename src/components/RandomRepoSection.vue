<template>
  <div class="space-y-6">
    <div class="repo-card">
      <div class="repo-header flex justify-between items-center">
        <h2 class="repo-title flex items-center">
          <svg
            class="mr-2 w-5 h-5 text-[#A89984]"
            viewBox="0 0 16 16"
            fill="currentColor"
          >
            <path
              fill-rule="evenodd"
              d="M2 2.5A2.5 2.5 0 014.5 0h8.75a.75.75 0 01.75.75v12.5a.75.75 0 01-.75.75h-2.5a.75.75 0 110-1.5h1.75v-2h-8a1 1 0 00-.714 1.7.75.75 0 01-1.072 1.05A2.495 2.495 0 012 11.5v-9zm10.5-1V9h-8c-.356 0-.694.074-1 .208V2.5a1 1 0 011-1h8zM5 12.25v3.25a.25.25 0 00.4.2l1.45-1.087a.25.25 0 01.3 0L8.6 15.7a.25.25 0 00.4-.2v-3.25a.25.25 0 00-.25-.25h-3.5a.25.25 0 00-.25.25z"
            ></path>
          </svg>
          <a :href="repo.htmlUrl" target="_blank" class="hover:underline">
            {{ repo.name || 'Unnamed Repository' }}
          </a>
          &nbsp;by&nbsp;
          <div class="flex items-center">
            <a :href="repo.htmlUrl.substring(0, repo.htmlUrl.lastIndexOf('/'))" target="_blank" class="hover:underline">
              {{ repo.owner || 'Unknown' }}
            </a>
            <button 
              @click.stop="$emit('search-owner', repo.owner)" 
              class="ml-2 text-[#A89984] hover:text-white"
              title="Search this user"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </button>
          </div>
        </h2>
        <button
          @click="$emit('close')"
          class="text-[#A89984] hover:text-white"
          title="Close"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
      <div class="p-4 bg-[#232323] flex-1">
        <div class="flex items-start space-x-4">
          <div class="flex-1">
            <div v-if="repo.description" class="repo-description">
              {{ repo.description }}
            </div>
            <div class="repo-meta">
              <span class="repo-stat">
                <svg
                  class="repo-stat-icon text-yellow-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                  />
                </svg>
                {{ repo.stars.toLocaleString() }}
              </span>
              <span class="flex items-center">
                <svg
                  class="w-4 h-4 mr-1 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                  />
                </svg>
                {{ repo.forks.toLocaleString() }}
              </span>
              <span v-if="repo.language" class="flex items-center">
                <span
                  class="w-3 h-3 rounded-full mr-1"
                  :style="{
                    backgroundColor: getLanguageColor(repo.language),
                  }"
                ></span>
                {{ repo.language }}
              </span>
              <span class="flex items-center">
                <svg
                  class="w-4 h-4 mr-1 text-red-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                {{ repo.openIssues.toLocaleString() }} issues
              </span>
            </div>
            <div
              v-if="repo.lastCommitDate || repo.updatedAt"
              class="text-xs text-gray-500 mt-2"
            >
              Last commit
              {{ formatDate(repo.lastCommitDate || repo.updatedAt) }}
            </div>
          </div>
          <a
            :href="repo.htmlUrl"
            target="_blank"
            class="px-4 py-2 bg-[#FFB86C] text-[#232323] rounded hover:bg-[#ffc785] transition-colors text-sm font-medium whitespace-nowrap"
          >
            View on GitHub
          </a>
        </div>
      </div>
    </div>

    <!-- README Section -->
    <div class="border border-[#FFB86C] rounded-lg overflow-hidden flex flex-col flex-1">
      <div class="bg-[#2a2a2a] p-4 border-b border-[#FFB86C] flex-shrink-0">
        <h2 class="text-lg font-bold text-[#FFB86C] flex items-center">
          <svg
            class="w-5 h-5 mr-2 text-[#A89984]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            ></path>
          </svg>
          README
        </h2>
      </div>
      <div class="flex-1 overflow-hidden bg-[#232323]">
        <ReadmeViewer
          :owner="repo.htmlUrl.split('/')[3]"
          :repo="repo.name"
          class="h-full"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import ReadmeViewer from './ReadmeViewer.vue';
import type { Repository } from '../types';
import { getLanguageColor } from '../utils/languages';
import type { PropType } from 'vue';

export default defineComponent({
  name: 'RandomRepoSection',
  components: {
    ReadmeViewer,
  },
  props: {
    repo: {
      type: Object as PropType<Repository>,
      required: true,
    },
  },
  emits: ['close', 'search-owner'],
  methods: {
    getLanguageColor,
    formatDate(dateString: string): string {
      if (!dateString) return 'N/A';
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      }).format(date);
    },
  },
});
</script>
