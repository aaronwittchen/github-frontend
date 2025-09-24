<template>
  <div class="flex flex-col items-center w-full max-w-4xl mx-auto">
    <div ref="cardRef" class="business-card w-full">
      <!-- Header with Close Button -->
      <div class="repo-header flex justify-between items-center mb-6">
        <h2 class="text-2xl font-bold text-[#FFB86C] flex items-center">
  <svg 
    class="mr-3 w-6 h-6 text-[#A89984]"
    fill="currentColor"
    viewBox="0 0 24 24"
    aria-hidden="true"
  >
    <path fill-rule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.268 2.75 1.026A9.564 9.564 0 0112 7.077c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.027 2.747-1.027.546 1.377.202 2.398.1 2.651.64.699 1.028 1.595 1.028 2.688 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clip-rule="evenodd" />
  </svg>
  GitHub Profile
</h2>
      </div>

      <!-- Main Profile Section -->
      <div class="p-6 bg-[#232323] rounded-lg border border-[#3a3a3a] mb-6">
        <div class="flex items-start space-x-6">
          <div class="relative">
            <img
              :src="user?.avatarUrl"
              alt="Avatar"
              class="business-avatar ring-2 ring-[#A89984]"
            />
            <div
              v-if="user?.type === 'Organization'"
              class="absolute -bottom-1 -right-1 bg-[#FFB86C] text-[#232323] text-xs px-1.5 py-0.5 rounded-full font-medium"
            >
              ORG
            </div>
          </div>

          <div class="flex-1">
            <div class="flex items-center space-x-3 mb-2">
              <h2 class="business-name text-2xl text-[#FFB86C]">
                <a
                  :href="user?.htmlUrl"
                  target="_blank"
                  class="hover:underline"
                >
                  {{ user?.name || user?.username }}
                </a>
              </h2>
              <div
                v-if="user?.hireable"
                class="bg-green-600 text-white text-xs px-2 py-1 rounded-full"
              >
                Available for hire
              </div>
            </div>

            <a
              :href="user?.htmlUrl"
              target="_blank"
              class="business-username text-lg text-[#A89984] hover:text-white"
            >
              @{{ user?.username }}
            </a>

            <!-- Bio -->
            <p
              v-if="user?.bio"
              class="business-bio mt-3 text-base leading-relaxed text-[#A89984]"
            >
              {{ user.bio }}
            </p>

            <!-- Contact Info Grid -->
            <div class="mt-4 grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
              <div
                v-if="user?.location"
                class="flex items-center text-[#A89984]"
              >
                <svg
                  class="w-4 h-4 mr-2 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <span class="truncate">{{ user.location }}</span>
              </div>

              <div v-if="user?.email" class="flex items-center text-[#A89984]">
                <svg
                  class="w-4 h-4 mr-2 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <a
                  :href="`mailto:${user.email}`"
                  class="hover:underline hover:text-white truncate"
                  >{{ user.email }}</a
                >
              </div>

              <div v-if="user?.blog" class="flex items-center text-[#A89984]">
                <svg
                  class="w-4 h-4 mr-2 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
                  />
                </svg>
                <a
                  :href="user.blog"
                  target="_blank"
                  class="hover:underline hover:text-white truncate"
                  >{{ cleanUrl(user.blog) }}</a
                >
              </div>

              <div
                v-if="user?.twitterUsername"
                class="flex items-center text-[#A89984]"
              >
                <svg
                  class="w-4 h-4 mr-2 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"
                  />
                </svg>
                <a
                  :href="`https://twitter.com/${user.twitterUsername}`"
                  target="_blank"
                  class="hover:underline hover:text-white"
                >
                  @{{ user.twitterUsername }}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Stats Section -->
      <div class="border border-[#FFB86C] rounded-lg overflow-hidden mb-6">
        <div class="bg-[#2a2a2a] p-4 border-b border-[#FFB86C]">
          <h3 class="text-lg font-bold text-[#FFB86C] flex items-center">
            <svg
              class="w-5 h-5 mr-2 text-[#A89984]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
            Profile Statistics
          </h3>
        </div>
        <div class="p-6 bg-[#232323]">
          <div
            class="stats-grid grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6"
          >
            <div class="stat-item text-center">
              <div class="repo-stat text-2xl font-bold text-[#FFB86C]">
                <AnimatedCounter
                  :value="user?.publicRepos || 0"
                  text-class="stat-value"
                />
              </div>
              <div class="text-xs text-[#A89984] mt-1 uppercase tracking-wide">
                Public Repos
              </div>
            </div>

            <div class="stat-item text-center">
              <div class="repo-stat text-2xl font-bold text-[#FFB86C]">
                <AnimatedCounter
                  :value="user?.followers || 0"
                  text-class="stat-value"
                />
              </div>
              <div class="text-xs text-[#A89984] mt-1 uppercase tracking-wide">
                Followers
              </div>
            </div>

            <div class="stat-item text-center">
              <div class="repo-stat text-2xl font-bold text-[#FFB86C]">
                <AnimatedCounter
                  :value="user?.following || 0"
                  text-class="stat-value"
                />
              </div>
              <div class="text-xs text-[#A89984] mt-1 uppercase tracking-wide">
                Following
              </div>
            </div>

            <div class="stat-item text-center">
              <div
                class="repo-stat flex items-center justify-center text-2xl font-bold text-yellow-400"
              >
                <svg
                  class="w-5 h-5 mr-1"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                  />
                </svg>
                <AnimatedCounter
                  :value="getTotalStars()"
                  text-class="stat-value"
                />
              </div>
              <div class="text-xs text-[#A89984] mt-1 uppercase tracking-wide">
                Total Stars
              </div>
            </div>

            <div class="stat-item text-center">
              <div
                class="repo-stat flex items-center justify-center text-2xl font-bold text-gray-400"
              >
                <svg
                  class="w-5 h-5 mr-1"
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
                <AnimatedCounter
                  :value="getTotalForks()"
                  text-class="stat-value"
                />
              </div>
              <div class="text-xs text-[#A89984] mt-1 uppercase tracking-wide">
                Total Forks
              </div>
            </div>

            <div v-if="user?.createdAt" class="stat-item text-center">
              <div class="repo-stat text-2xl font-bold text-[#FFB86C]">
                {{ getYearsActive() }}
              </div>
              <div class="text-xs text-[#A89984] mt-1 uppercase tracking-wide">
                Years on GitHub
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Top Repositories Section -->
      <div
        v-if="user?.topRepositories?.length"
        class="border border-[#FFB86C] rounded-lg overflow-hidden"
      >
        <div class="bg-[#2a2a2a] p-4 border-b border-[#FFB86C]">
          <h3 class="text-lg font-bold text-[#FFB86C] flex items-center">
            <svg
              class="w-5 h-5 mr-2 text-[#A89984]"
              viewBox="0 0 16 16"
              fill="currentColor"
            >
              <path
                fill-rule="evenodd"
                d="M2 2.5A2.5 2.5 0 014.5 0h8.75a.75.75 0 01.75.75v12.5a.75.75 0 01-.75.75h-2.5a.75.75 0 110-1.5h1.75v-2h-8a1 1 0 00-.714 1.7.75.75 0 01-1.072 1.05A2.495 2.495 0 012 11.5v-9zm10.5-1V9h-8c-.356 0-.694.074-1 .208V2.5a1 1 0 011-1h8zM5 12.25v3.25a.25.25 0 00.4.2l1.45-1.087a.25.25 0 01.3 0L8.6 15.7a.25.25 0 00.4-.2v-3.25a.25.25 0 00-.25-.25h-3.5a.25.25 0 00-.25.25z"
              />
            </svg>
            Top Repositories
          </h3>
        </div>

        <div class="p-6 bg-[#232323]">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div
              v-for="repo in user.topRepositories.slice(0, 4)"
              :key="repo.name"
              class="p-4 bg-[#2a2a2a] rounded border border-[#3a3a3a] hover:border-[#A89984] transition-colors"
            >
              <div class="flex justify-between items-start mb-3">
                <a
                  :href="repo.htmlUrl"
                  target="_blank"
                  class="repo-title text-[#FFB86C] hover:underline font-medium"
                >
                  {{ repo.name }}
                </a>
                <div
                  class="repo-stat flex items-center text-xs text-yellow-400"
                >
                  <svg
                    class="w-3 h-3 mr-1"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                    />
                  </svg>
                  {{ repo.stars.toLocaleString() }}
                </div>
              </div>

              <p
                v-if="repo.description"
                class="repo-description text-sm text-[#A89984] mb-3"
              >
                {{ truncateText(repo.description, 80) }}
              </p>

              <div
                class="repo-meta flex items-center justify-between text-xs text-[#A89984]"
              >
                <div class="flex items-center space-x-3">
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
                      class="w-3 h-3 mr-1"
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
                </div>
                <span v-if="repo.updatedAt" class="text-gray-500">
                  {{ formatRelativeTime(repo.updatedAt) }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer Info -->
      <div
        v-if="user?.createdAt"
        class="mt-6 pt-4 border-t border-[#3a3a3a] text-center text-sm text-[#A89984]"
      >
        <div class="flex items-center justify-center">
          <svg
            class="w-4 h-4 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          GitHub member since {{ formatDate(user.createdAt) }}
        </div>
      </div>
    </div>

    <!-- Download Button -->
    <button
      class="mt-6 px-4 py-2 bg-[#FFB86C] text-[#232323] rounded hover:bg-[#ffc785] transition-colors text-sm font-medium"
      @click="downloadCard"
    >
      Download as PNG
    </button>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue';
import AnimatedCounter from './AnimatedCounter.vue';
import html2canvas from 'html2canvas';
import { getLanguageColor } from '../utils/languages';

export default defineComponent({
  name: 'BusinessCard',
  components: {
    AnimatedCounter,
  },
  props: {
    user: { type: Object, required: true },
  },
  setup(props) {
    const cardRef = ref<HTMLElement | null>(null);

    const downloadCard = async () => {
      if (!cardRef.value) return;
      const canvas = await html2canvas(cardRef.value, {
        backgroundColor: '#18181b',
        scale: 2,
      });
      const link = document.createElement('a');
      link.download = 'github-business-card.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
    };

    const formatDate = (dateString: string) => {
      if (!dateString) return '';
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'short',
      }).format(date);
    };

    const formatRelativeTime = (dateString: string) => {
      if (!dateString) return '';
      const date = new Date(dateString);
      const now = new Date();
      const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

      const minute = 60;
      const hour = minute * 60;
      const day = hour * 24;
      const month = day * 30;
      const year = day * 365;

      if (diffInSeconds < minute) return 'just now';
      if (diffInSeconds < hour)
        return `${Math.floor(diffInSeconds / minute)}m ago`;
      if (diffInSeconds < day)
        return `${Math.floor(diffInSeconds / hour)}h ago`;
      if (diffInSeconds < month)
        return `${Math.floor(diffInSeconds / day)}d ago`;
      if (diffInSeconds < year)
        return `${Math.floor(diffInSeconds / month)}mo ago`;
      return `${Math.floor(diffInSeconds / year)}y ago`;
    };

    const cleanUrl = (url: string) => {
      return url.replace(/^https?:\/\//, '').replace(/\/$/, '');
    };

    const truncateText = (text: string, maxLength: number) => {
      if (text.length <= maxLength) return text;
      return text.substring(0, maxLength).trim() + '...';
    };

    const getTotalStars = () => {
      if (!props.user?.topRepositories?.length) return 0;
      return props.user.topRepositories.reduce(
        (total: number, repo: any) => total + repo.stars,
        0,
      );
    };

    const getTotalForks = () => {
      if (!props.user?.topRepositories?.length) return 0;
      return props.user.topRepositories.reduce(
        (total: number, repo: any) => total + repo.forks,
        0,
      );
    };

    const getYearsActive = () => {
      if (!props.user?.createdAt) return 0;
      const joinDate = new Date(props.user.createdAt);
      const now = new Date();
      const yearsDiff = now.getFullYear() - joinDate.getFullYear();
      const monthsDiff = now.getMonth() - joinDate.getMonth();
      const daysDiff = now.getDate() - joinDate.getDate();

      if (monthsDiff < 0 || (monthsDiff === 0 && daysDiff < 0)) {
        return yearsDiff - 1;
      }
      return yearsDiff;
    };

    return {
      cardRef,
      downloadCard,
      formatDate,
      formatRelativeTime,
      cleanUrl,
      truncateText,
      getTotalStars,
      getTotalForks,
      getYearsActive,
      getLanguageColor,
    };
  },
});
</script>

<style scoped>
.business-card {
  @apply bg-[#18181b] rounded-lg p-6;
}

.business-avatar {
  @apply w-24 h-24 rounded-lg object-cover;
}

.business-name {
  @apply font-bold;
}

.business-username {
  @apply transition-colors;
}

.business-bio {
  @apply leading-relaxed;
}

.repo-header {
  @apply flex justify-between items-center;
}

.repo-title {
  @apply font-medium hover:underline;
}

.repo-description {
  @apply leading-relaxed;
}

.repo-meta {
  @apply flex items-center space-x-4 text-sm;
}

.repo-stat {
  @apply flex items-center;
}

.repo-stat-icon {
  @apply w-4 h-4 mr-1;
}

.stat-value {
  @apply text-2xl font-bold text-[#FFB86C];
}
</style>
