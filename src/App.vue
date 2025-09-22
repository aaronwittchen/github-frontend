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
      lastFetchTime: 0,
      minRequestInterval: 2000, // Minimum time between requests in milliseconds (2 seconds)
      fetchQueue: [] as Array<() => Promise<void>>,
      isProcessingQueue: false,
    };
  },
  computed: {
    projectCount(): number {
      return this.user?.topRepositories?.length || 0;
    },
  },
  mounted() {
    // Pre-fetch 2 repos when component is mounted
    this.preFetchNextRepo();
    this.preFetchNextRepo();
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
    
    async preFetchNextRepo() {
      if (this.isPreFetching || this.preFetchedRepos.length >= 2) return;
      
      this.isPreFetching = true;
      try {
        await this.enqueueRequest(async () => {
          const params = {
            minStars: this.selectedRange.min,
            maxStars: this.selectedRange.max,
          };
          const repo = await githubApi.getRandomRepository(params);
          this.preFetchedRepos.push(repo);
        });
      } catch (error) {
        console.error('Error pre-fetching repository:', error);
      } finally {
        this.isPreFetching = false;
      }
    },
    async getRandomRepo() {
      try {
        this.loading = true;
        this.error = '';
        this.randomRepo = null;
        this.user = null; // Clear user data when getting a random repo

        // If we have pre-fetched repos, use one of them
        if (this.preFetchedRepos.length > 0) {
          this.randomRepo = this.preFetchedRepos.shift() || null;
          // Start pre-fetching the next repo in the background
          this.preFetchNextRepo();
          return;
        }

        // No pre-fetched repos, fetch one immediately
        await this.enqueueRequest(async () => {
          const params = {
            minStars: this.selectedRange.min,
            maxStars: this.selectedRange.max,
          };
          const repo = await githubApi.getRandomRepository(params);
          this.randomRepo = repo;
          
          // Pre-fetch the next repo in the background
          this.preFetchNextRepo();
        });
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
      this.user = null; // Clear user data when starting a new search

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
