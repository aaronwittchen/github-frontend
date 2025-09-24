<template>
  <div class="app-container">
    <div class="content-container">
      <AppHeader />
      <TerminalBox 
        :project-count="projectCount" 
        :random-repo="randomRepo"
        :selected-language="languageFilter" 
      />
      <ControlsSection
        v-model:username="username"
        v-model:selected-range="selectedRange"
        @update:language="languageFilter = $event"
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
        @search-owner="searchOwner"
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
  },
  data() {
    return {
      username: '',
      user: null as User | null,
      randomRepo: null as (Repository & { htmlUrl: string }) | null,
      preFetchedRepos: [] as (Repository & { htmlUrl: string })[],
      isPreFetching: false,
      loading: false,
      error: '',
      selectedRange: { label: '51-500', min: 51, max: 500 },
      starRanges: starRanges,
      // Prefetch and cancellation control
      prefetchVersion: 0,
      currentPrefetchController: null as AbortController | null,
      reserveSize: 1,
      // Legacy queue (kept for user summary throttling if needed)
      lastFetchTime: 0,
      minRequestInterval: 2000,
      fetchQueue: [] as Array<() => Promise<void>>,
      isProcessingQueue: false,
      languageFilter: '' as string | null,
    };
  },
  computed: {
    projectCount(): number {
      return this.user?.topRepositories?.length || 0;
    },
  },
  mounted() {
    // On initial load, prefetch one repo in the background (do not display)
    this.ensureReserve();
  },
  watch: {
    // When star range changes, discard old reserve and cancel in-flight fetches
    selectedRange: {
      handler() {
        this.discardReserveAndCancel();
        this.ensureReserve();
      },
      deep: false,
    },
    // When language filter changes, discard old reserve and cancel in-flight fetches
    languageFilter() {
      this.discardReserveAndCancel();
      this.ensureReserve();
    },
  },
  methods: {
    async processQueue() {
      if (this.isProcessingQueue || this.fetchQueue.length === 0) return;
      
      this.isProcessingQueue = true;
      const now = Date.now();
      const timeSinceLastFetch = now - this.lastFetchTime;
      const delay = Math.max(0, this.minRequestInterval - timeSinceLastFetch);
      
      // Wait for the required delay
      await new Promise(resolve => setTimeout(resolve, delay));
      
      const nextRequest = this.fetchQueue.shift();
      if (nextRequest) {
        try {
          await nextRequest();
        } catch (error) {
          console.error('Error in queued request:', error);
        } finally {
          this.lastFetchTime = Date.now();
        }
      }
      
      this.isProcessingQueue = false;
      
      // Process next item in queue if any
      if (this.fetchQueue.length > 0) {
        this.processQueue();
      }
    },
    
    enqueueRequest(request: () => Promise<void>): Promise<void> {
      return new Promise((resolve, reject) => {
        const wrappedRequest = async () => {
          try {
            await request();
            resolve();
          } catch (error) {
            reject(error);
          }
        };
        
        this.fetchQueue.push(wrappedRequest);
        this.processQueue();
      });
    },
    
    searchOwner(owner: string) {
      this.username = owner;
      this.getSummary();
    },
    
    ensureReserve() {
      if (this.preFetchedRepos.length >= this.reserveSize || this.isPreFetching) return;
      this.preFetchNextRepo();
    },
    discardReserveAndCancel() {
      this.preFetchedRepos = [];
      this.randomRepo = null; // do not auto-display on star change
      this.prefetchVersion += 1;
      if (this.currentPrefetchController) {
        try { this.currentPrefetchController.abort(); } catch {}
      }
      this.currentPrefetchController = null;
    },
    async preFetchNextRepo() {
      if (this.isPreFetching) return;
      this.isPreFetching = true;
      const versionAtStart = this.prefetchVersion;
      const controller = new AbortController();
      this.currentPrefetchController = controller;
      try {
        const params = {
          minStars: this.selectedRange?.min,
          maxStars: this.selectedRange?.max,
          language: this.languageFilter || undefined,
        };
        const repo = await githubApi.getRandomRepository(params, { signal: controller.signal });
        // Ignore if a newer prefetch cycle has started
        if (versionAtStart !== this.prefetchVersion) return;
        this.preFetchedRepos.push(repo);
      } catch (error: any) {
        // Ignore cancellations; log other errors
        if (!(error && (error.name === 'CanceledError' || error.code === 'ERR_CANCELED'))) {
          console.error('Error pre-fetching repository:', error);
        }
      } finally {
        if (this.currentPrefetchController === controller) {
          this.currentPrefetchController = null;
        }
        this.isPreFetching = false;
      }
    },
    async getRandomRepo() {
      try {
        this.loading = true;
        this.error = '';
        this.randomRepo = null;
        this.user = null; // Clear user data when getting a random repo

        // If we have a reserved repo, show it instantly and replenish in background
        if (this.preFetchedRepos.length > 0) {
          this.randomRepo = this.preFetchedRepos.shift() || null;
          this.ensureReserve();
          return;
        }

        // Otherwise fetch immediately (will display when ready), then start reserve
        const immediateController = new AbortController();
        const params = {
          minStars: this.selectedRange?.min,
          maxStars: this.selectedRange?.max,
          language: this.languageFilter || undefined,
        };
        const repo = await githubApi.getRandomRepository(params, { signal: immediateController.signal });
        this.randomRepo = repo;
        this.ensureReserve();
      } catch (error: unknown) {
        console.error('Error fetching random repository:', error);
        const errorMessage = error instanceof Error ? error.message : String(error);
        const statusCode = (error as any)?.response?.status;
        
        if (errorMessage.includes('ThrottlerException') || statusCode === 429) {
          this.error = 'Rate limit exceeded. Please wait a moment before trying again.';
        } else {
          this.error = 'Failed to fetch a random repository. Please try again.';
        }
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
      this.user = null; // Clear user data when starting a new search

      try {
        this.user = await githubApi.getUserSummary(this.username, { limit: 12 });
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
