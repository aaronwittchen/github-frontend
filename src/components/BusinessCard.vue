<template>
  <div class="flex flex-col items-center w-full max-w-2xl mx-auto">
    <!-- Card -->
    <div ref="cardRef" class="business-card w-full">
      <!-- Header: Avatar + Name -->
      <div class="business-card-header">
        <img :src="user?.avatarUrl" alt="Avatar" class="business-avatar" />
        <div class="flex-1">
          <h2 class="business-name">
            <a :href="user?.htmlUrl" target="_blank" class="hover:underline">
              {{ user?.name || user?.username }}
            </a>
          </h2>
          <a :href="user?.htmlUrl" target="_blank" class="business-username">
            @{{ user?.username }}
          </a>

          <!-- Additional User Info -->
          <div class="mt-2 space-y-1 text-sm text-gray-400">
            <div v-if="user?.location" class="flex items-center">
              <svg
                class="w-4 h-4 mr-1"
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
              {{ user.location }}
            </div>
            <div v-if="user?.blog" class="flex items-center">
              <svg
                class="w-4 h-4 mr-1"
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
              <a :href="user.blog" target="_blank" class="hover:underline">{{
                user.blog
              }}</a>
            </div>
            <div v-if="user?.createdAt" class="flex items-center">
              <svg
                class="w-4 h-4 mr-1"
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
              Joined {{ formatDate(user.createdAt) }}
            </div>
          </div>
        </div>
      </div>

      <!-- Bio -->
      <p v-if="user?.bio" class="business-bio mt-4">
        {{ user.bio }}
      </p>

      <!-- Stats -->
      <div class="stats-grid mt-6">
        <div>
          <p class="stat-value">
            <AnimatedCounter
              :value="user?.publicRepos || 0"
              text-class="stat-value"
            />
          </p>
          <p class="stat-label">Repos</p>
        </div>
        <div>
          <p class="stat-value">
            <AnimatedCounter
              :value="user?.followers || 0"
              text-class="stat-value"
            />
          </p>
          <p class="stat-label">Followers</p>
        </div>
        <div>
          <p class="stat-value">
            <AnimatedCounter
              :value="user?.following || 0"
              text-class="stat-value"
            />
          </p>
          <p class="stat-label">Following</p>
        </div>
      </div>

      <!-- Top Repository -->
      <div v-if="topRepository" class="mt-6 border-t border-gray-700 pt-4">
        <h3 class="text-lg font-semibold mb-2 flex items-center">
          <svg
            class="w-5 h-5 mr-2 text-yellow-400"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
            />
          </svg>
          Top Repository
        </h3>
        <div
          class="bg-gray-800 rounded-lg p-4 hover:bg-gray-750 transition-colors"
        >
          <div class="flex justify-between items-start">
            <div>
              <a
                :href="topRepository.htmlUrl"
                target="_blank"
                class="text-lg font-semibold hover:underline"
              >
                {{ topRepository.name }}
              </a>
              <p class="mt-1 text-sm text-gray-400">
                {{ topRepository.description }}
              </p>
              <div
                class="flex items-center mt-2 text-xs text-gray-400 space-x-4"
              >
                <span class="flex items-center">
                  <span
                    class="w-3 h-3 rounded-full mr-1"
                    :style="{
                      backgroundColor: getLanguageColor(topRepository.language),
                    }"
                  ></span>
                  {{ topRepository.language }}
                </span>
                <span class="flex items-center">
                  <svg
                    class="w-4 h-4 mr-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                    />
                  </svg>
                  {{ topRepository.stars.toLocaleString() }}
                </span>
                <span class="flex items-center">
                  <svg
                    class="w-4 h-4 mr-1"
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
                  {{ topRepository.forks.toLocaleString() }}
                </span>
                <span v-if="topRepository.updatedAt" class="flex items-center">
                  <svg
                    class="w-4 h-4 mr-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  Updated {{ formatRelativeTime(topRepository.updatedAt) }}
                </span>
              </div>
            </div>
            <a
              :href="`${topRepository.htmlUrl}/stargazers`"
              target="_blank"
              class="text-yellow-400 hover:text-yellow-300"
            >
              <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path
                  d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>

    <!-- Download Button -->
    <button class="download-btn mt-6" @click="downloadCard">
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

    // Get the top repository (most stars)
    const topRepository = computed(() => {
      if (!props.user?.topRepositories?.length) return null;
      return props.user.topRepositories[0];
    });

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
        day: 'numeric',
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

    return {
      cardRef,
      downloadCard,
      formatDate,
      formatRelativeTime,
      topRepository,
      getLanguageColor,
    };
  },
});
</script>
