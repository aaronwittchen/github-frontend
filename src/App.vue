<template>
  <div class="min-h-screen flex flex-col py-12 px-4 sm:px-8">
    <div class="w-full max-w-4xl mx-auto text-[#A89984] text-sm">
      <div class="flex items-center mb-6">
        <img src="@/assets/pink.png" alt="Logo" class="w-10 h-10 sm:w-12 sm:h-12 mr-3" />
        <h1 class="text-2xl sm:text-3xl font-bold font-mono text-[#e5e7eb] devlogs-text">
          devlogs<span class="terminal-blinking-cursor">█</span>
        </h1>
      </div>
      <!-- Terminal Box -->
      <div
        class="border border-[#FFB86C] rounded-lg bg-[#232323] p-4 font-mono text-sm text-[#A89984] mb-6"
      >
        <div class="flex items-center mb-2">
          <span class="text-[#ffb86c] mr-2">Ξ</span>
          <span class="text-[#ffb86c]">~/projects</span>
          <span class="mx-2 text-[#A89984]">→</span>
          <span class="text-[#A89984]">ls -la --sort=stars</span>
        </div>
        <div>
          <span class="text-[#55e06c]">[INFO]</span> Displaying
          <span class="text-[#A89984]"
            >{{ projectCount }} projects from GitHub</span
          >
        </div>
      </div>
      <div class="w-full mb-8">
        <div class="flex flex-col sm:flex-row gap-4 w-full">
          <input
            v-model="username"
            type="text"
            placeholder="Enter GitHub username"
            class="flex-grow px-4 py-2 rounded-lg bg-[#232323] text-[#A89984] border border-[#FFB86C] focus:outline-none focus:ring-2 focus:ring-[#FFB86C] font-mono text-sm w-full"
          />
          <div class="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <button
              @click="getSummary"
              class="px-6 py-2 bg-[#232323] border border-[#FFB86C] rounded-lg text-[#A89984] hover:bg-[#2a2a2a] transition-colors font-mono text-sm w-full sm:w-auto"
            >
              Get Summary
            </button>
            <div class="flex gap-2 w-full sm:w-auto">
              <select
                v-model="selectedRange"
                class="flex-grow sm:flex-grow-0 px-3 py-2 rounded-lg bg-[#232323] text-[#A89984] border border-[#FFB86C] focus:outline-none focus:ring-2 focus:ring-[#FFB86C] font-mono text-sm appearance-none w-full sm:w-auto"
              >
                <option
                  v-for="range in starRanges"
                  :key="range.label"
                  :value="range"
                >
                  {{ range.label }} stars
                </option>
              </select>
              <button
                @click="getRandomRepo"
                class="px-4 py-2 bg-[#232323] border border-[#FFB86C] rounded-lg text-[#A89984] hover:bg-[#2a2a2a] transition-colors font-mono text-sm whitespace-nowrap w-full sm:w-auto"
              >
                I'm Feeling Lucky
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="text-center py-12">
        <div
          class="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"
        ></div>
        <p class="mt-4 text-[#A89984] text-sm">Loading user data...</p>
      </div>

      <!-- Error State -->
      <div
        v-else-if="error"
        class="bg-[#232323] border border-[#FFB86C] rounded-lg text-[#FFB86C] px-6 py-4 mb-8 text-center font-mono text-sm"
      >
        {{ error }}
      </div>

      <!-- Random Repo Section -->
      <div v-if="randomRepo" class="space-y-12">
        <div class="border border-[#FFB86C] rounded-lg overflow-hidden">
          <div
            class="bg-[#2a2a2a] p-4 border-b border-[#FFB86C] flex justify-between items-center"
          >
            <h2 class="text-lg font-bold text-[#FFB86C]">
              <a
                :href="randomRepo.htmlUrl"
                target="_blank"
                class="hover:underline"
              >
                {{ randomRepo.name || 'Unnamed Repository' }}
              </a>
            </h2>
            <button
              @click="randomRepo = null"
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
          <div class="bg-[#232323] p-4">
            <div class="flex items-start space-x-4">
              <div class="flex-1">
                <div v-if="randomRepo.description" class="text-[#A89984] mb-3">
                  {{ randomRepo.description }}
                </div>
                <div class="flex flex-wrap gap-4 text-sm">
                  <span class="flex items-center">
                    <svg
                      class="w-4 h-4 mr-1 text-yellow-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                      />
                    </svg>
                    {{ randomRepo.stars.toLocaleString() }}
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
                    {{ randomRepo.forks.toLocaleString() }}
                  </span>
                  <span v-if="randomRepo.language" class="flex items-center">
                    <span
                      class="w-3 h-3 rounded-full mr-1"
                      :style="{
                        backgroundColor: getLanguageColor(randomRepo.language),
                      }"
                    ></span>
                    {{ randomRepo.language }}
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
                    {{ randomRepo.openIssues.toLocaleString() }} issues
                  </span>
                </div>
                <div
                  v-if="randomRepo.lastCommitDate || randomRepo.updatedAt"
                  class="text-xs text-gray-500 mt-2"
                >
                  Last commit
                  {{
                    formatDate(
                      randomRepo.lastCommitDate || randomRepo.updatedAt
                    )
                  }}
                </div>
              </div>
              <a
                :href="randomRepo.htmlUrl"
                target="_blank"
                class="px-4 py-2 bg-[#FFB86C] text-[#232323] rounded hover:bg-[#ffc785] transition-colors text-sm font-medium whitespace-nowrap"
              >
                View on GitHub
              </a>
            </div>
          </div>
        </div>
      </div>

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
            <a
              v-for="repo in user.topRepositories"
              :key="repo.name"
              :href="repo.htmlUrl"
              target="_blank"
              class="block bg-[#232323] hover:bg-[#2a2a2a] rounded-lg p-4 border border-[#FFB86C] transition-all hover:shadow-lg hover:shadow-[#FFB86C]/20 font-mono"
            >
              <!-- Title and status row -->
              <div class="flex justify-between items-center mb-2">
                <div class="flex items-center gap-2">
                  <span class="text-[#FFB86C]">&lt;&gt;</span>
                  <span
                    :class="
                      isRecentlyUpdated(repo.updatedAt)
                        ? 'text-yellow-400 border-yellow-400'
                        : 'text-[#55e06c] border-[#55e06c]'
                    "
                    class="border px-2 py-0.5 text-xs text-[#A89984]"
                  >
                    {{
                      isRecentlyUpdated(repo.updatedAt)
                        ? 'in progress'
                        : 'active'
                    }}
                  </span>
                </div>
                <div class="flex items-center text-[#FFB86C] text-sm">
                  <span>★</span>
                  <span class="ml-1">{{ repo.stars }}</span>
                </div>
              </div>

              <!-- Repository name -->
              <h4 class="text-lg font-semibold text-[#FFB86C] mb-2">
                {{ repo.name }}
              </h4>

              <!-- Description -->
              <p
                v-if="repo.description"
                class="text-[#A89984] text-sm mb-4 line-clamp-2"
              >
                {{ repo.description }}
              </p>

              <!-- Languages and Stats -->
              <div class="space-y-3 mb-3">
                <!-- Languages -->
                <div v-if="repo.languages && repo.languages.length > 0" class="flex flex-wrap items-center gap-2 text-xs">
                  <span class="text-[#A89984]">Languages:</span>
                  <template v-for="(lang, index) in repo.languages.slice(0, 3)" :key="index">
                    <span class="px-2 py-0.5 border border-[#FFB86C] text-gray-300">
                      {{ lang.name }}
                    </span>
                  </template>
                </div>
                <div v-else-if="repo.language" class="flex flex-wrap items-center gap-2 text-xs">
                  <span class="text-[#A89984]">Language:</span>
                  <span class="px-2 py-0.5 border border-[#FFB86C] text-gray-300">
                    {{ repo.language }}
                  </span>
                </div>

                <!-- Stats -->
                <div class="flex flex-wrap items-center gap-4 text-xs text-[#A89984]">
                  <!-- Forks -->
                  <div v-if="repo.forks !== undefined" class="flex items-center">
                    <svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fill-rule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clip-rule="evenodd"></path>
                    </svg>
                    {{ repo.forks }} {{ repo.forks === 1 ? 'fork' : 'forks' }}
                  </div>
                  
                  <!-- Issues -->
                  <div v-if="repo.openIssues !== undefined" class="flex items-center">
                    <svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h2a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path>
                    </svg>
                    {{ repo.openIssues }} {{ repo.openIssues === 1 ? 'issue' : 'issues' }}
                  </div>
                </div>
              </div>

              <!-- Divider -->
              <div class="border-t border-dashed border-[#FFB86C] my-3"></div>

              <!-- GitHub link -->
              <div class="flex items-center justify-center mb-3">
                <a
                  :href="repo.htmlUrl"
                  target="_blank"
                  class="flex items-center text-[#FFB86C] hover:text-white transition-colors text-sm"
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    class="mr-1"
                  >
                    <path
                      d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"
                    />
                  </svg>
                  <span class="underline">Code</span>
                </a>
              </div>

              <!-- Updated date -->
              <div
                class="border-t border-dashed border-[#FFB86C] pt-3 text-center"
              >
                <p class="text-sm text-[#A89984]">
                  Updated: {{ formatDate(repo.updatedAt) }}
                </p>
              </div>
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { githubApi } from './services/api';
import LanguageStats from './components/LanguageStats.vue';
import BusinessCard from './components/BusinessCard.vue';
import BigCard from './components/BigCard.vue';
import ContributionGraph from './components/ContributionGraph.vue';

interface Repository {
  name: string;
  description: string | null;
  htmlUrl: string;
  stars: number;
  forks: number;
  openIssues: number;
  language: string | null;
  languages?: Array<{
    name: string;
    percentage: number;
  }>;
  updatedAt: string;
  lastCommitDate?: string; // Date of the last commit
  createdAt?: string; // optional, since backend includes it
  isPrivate?: boolean; // optional, backend includes it
}

interface Commit {
  message: string;
  url: string;
  sha: string;
  date: string;
}

interface ContributionWeek {
  contributionDays: Array<{
    date: string;
    count: number;
  }>;
}

interface User {
  username: string;
  name: string | null;
  avatarUrl: string;
  bio: string | null;
  githubUrl: string;
  location?: string;
  company?: string;
  blog?: string;
  followers: number;
  following: number;
  publicRepos: number;
  topRepositories: Repository[];
  languages?: Array<{ name: string; percentage: number }>;
  lastCommit?: Commit;
  contributions?: {
    weeks: ContributionWeek[];
  };
}

export default defineComponent({
  name: 'GithubSummary',
  components: {
    LanguageStats,
    BusinessCard,
    BigCard,
    ContributionGraph,
  },
  data() {
    return {
      username: '',
      user: null as User | null,
      randomRepo: null as (Repository & { htmlUrl: string }) | null,
      loading: false,
      error: '',
      starRanges: [
        { label: '1-50', min: 1, max: 50 },
        { label: '51-500', min: 51, max: 500 },
        { label: '501-1000', min: 501, max: 1000 },
        { label: '1001-10000', min: 1001, max: 10000 },
        { label: '10001+', min: 10001, max: 1000000 },
      ] as Array<{ label: string; min: number; max: number }>,
      selectedRange: { label: '51-500', min: 51, max: 500 },
    };
  },
  computed: {
    projectCount(): number {
      return this.user?.topRepositories?.length || 0;
    },
  },
  methods: {
    getLanguageColor(language: string): string {
      const colors: Record<string, string> = {
        JavaScript: '#f1e05a',
        TypeScript: '#2b7489',
        Python: '#3572A5',
        Java: '#b07219',
        'C++': '#f34b7d',
        'C#': '#178600',
        PHP: '#4F5D95',
        Ruby: '#701516',
        Go: '#00ADD8',
        Rust: '#dea584',
        Swift: '#ffac45',
        Kotlin: '#F18E33',
        Dart: '#00B4AB',
        HTML: '#e34c26',
        CSS: '#563d7c',
        SCSS: '#c6538c',
        Shell: '#89e051',
        Dockerfile: '#384d54',
        Makefile: '#427819',
        Vue: '#2c3e50',
        React: '#61dafb',
        Angular: '#dd0031',
        Svelte: '#ff3e00',
        Elixir: '#6e4a7e',
        Clojure: '#db5855',
        Haskell: '#5e5086',
        OCaml: '#3be133',
        R: '#198CE7',
        Scala: '#c22d40',
        Perl: '#0298c3',
        Lua: '#000080',
        'Objective-C': '#438eff',
        PowerShell: '#012456',
        TeX: '#3D6117',
        'Vim script': '#199f4b',
        'Emacs Lisp': '#c065db',
        'Jupyter Notebook': '#DA5B0B',
        Markdown: '#083fa1',
        JSON: '#292929',
        YAML: '#cb171e',
        TOML: '#9c4121',
        GraphQL: '#e10098',
      };
      return colors[language] || '#cccccc';
    },
    async getRandomRepo() {
      try {
        this.loading = true;
        this.error = '';
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

    isRecentlyUpdated(dateString: string): boolean {
      const date = new Date(dateString);
      const now = new Date();
      const diffTime = Math.abs(now.getTime() - date.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays <= 7; // Updated in the last 7 days
    },
    formatDate(dateString: string) {
      if (!dateString) return '';
      // Create date in UTC to avoid timezone conversion issues
      const date = new Date(dateString);
      // Format as UTC to prevent timezone shifting
      return new Intl.DateTimeFormat('en-US', {
        timeZone: 'UTC',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }).format(date);
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
