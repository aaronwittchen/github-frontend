<template>
  <div class="app-container">
    <div class="content-container">
      <AppHeader />
      <TerminalBox 
        :project-count="projectCount" 
        :random-repo="randomRepo" 
      />
      <ControlsSection
        v-model:username="username"
        v-model:selected-range="selectedRange"
        :star-ranges="starRanges"
        @get-summary="getSummary"
        @get-random-repo="getRandomRepo"
      />

      <!-- Loading State -->
      <div v-if="loading" class="text-center py-12">
        <div class="loading-spinner"></div>
        <p class="mt-4 text-[#A89984] text-sm">Loading user data...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="error-message">
        {{ error }}
      </div>

      <!-- Random Repo Section -->
      <RandomRepoSection 
        v-if="randomRepo" 
        :repo="randomRepo" 
        @close="randomRepo = null"
      />

      <!-- User Profile -->
      <div v-else-if="user" class="space-y-12">
        <!-- Business Card -->
        <BusinessCard :user="user" />

        <!-- Big Card -->
        <!-- <BigCard :user="user" /> -->

        <!-- Contribution Graph -->
        <ContributionGraph :user="user" />

        <!-- Language Statistics -->
        <LanguageStats
          v-if="user.languages && user.languages.length > 0"
          :languages="user.languages"
        />

        <!-- Repositories -->
        <div
          v-if="user.topRepositories && user.topRepositories.length > 0"
          class="mt-8"
        >
          <h3 class="text-2xl font-bold mb-6 text-center">Top Repositories</h3>
          <div
            class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-[#A89984] text-sm"
          >
            <RepositoryCard
              v-for="repo in user.topRepositories"
              :key="repo.name"
              :repo="repo"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { githubApi } from './services/api';
import AppHeader from './components/AppHeader.vue';
import TerminalBox from './components/TerminalBox.vue';
import ControlsSection from './components/ControlsSection.vue';
import RandomRepoSection from './components/RandomRepoSection.vue';
import RepositoryCard from './components/RepositoryCard.vue';
import LanguageStats from './components/LanguageStats.vue';
import BusinessCard from './components/BusinessCard.vue';
import ContributionGraph from './components/ContributionGraph.vue';
import ReadmeViewer from './components/ReadmeViewer.vue';
import { starRanges } from './constants/starRanges';
import type { Repository, User } from './types';

export default defineComponent({
  name: 'GithubSummary',
  components: {
    AppHeader,
    TerminalBox,
    ControlsSection,
    RandomRepoSection,
    RepositoryCard,
    LanguageStats,
    BusinessCard,
    ContributionGraph,
    ReadmeViewer,
  },
  data() {
    return {
      username: '',
      user: null as User | null,
      randomRepo: null as (Repository & { htmlUrl: string }) | null,
      loading: false,
      error: '',
      selectedRange: { label: '51-500', min: 51, max: 500 },
      starRanges: starRanges, // Add starRanges to data to fix TypeScript error
    };
  },
  computed: {
    projectCount(): number {
      return this.user?.topRepositories?.length || 0;
    },
  },
  methods: {
    async getRandomRepo() {
      try {
        this.loading = true;
        this.error = '';
        this.randomRepo = null; 
        const params = {
          minStars: this.selectedRange.min,
          maxStars: this.selectedRange.max,
        };
        const repo = await githubApi.getRandomRepository(params);
        this.randomRepo = repo;
      } catch (error) {
        console.error('Error fetching random repository:', error);
        this.error = 'Failed to fetch a random repository. Please try again.';
      } finally {
        this.loading = false;
      }
    },
    async getSummary() {
      if (!this.username.trim()) {
        this.error = 'Please enter a GitHub username';
        return;
      }

      this.loading = true;
      this.error = '';
      this.randomRepo = null;

      try {
        this.user = await githubApi.getUserSummary(this.username);
      } catch (err) {
        this.error =
          err instanceof Error ? err.message : 'Failed to fetch user data';
        console.error(err);
      } finally {
        this.loading = false;
      }
    },
  },
});
</script>
