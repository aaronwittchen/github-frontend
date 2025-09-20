<template>
  <div class="flex flex-col items-center">
    <!-- Card -->
    <div
      ref="cardRef"
      class="business-card"
    >
      <!-- Header: Avatar + Name -->
      <div class="business-card-header">
        <img
          :src="user?.avatarUrl"
          alt="Avatar"
          class="business-avatar"
        >
        <div>
          <h2 class="business-name">
            {{ user?.name || user?.username }}
          </h2>
          <a
            :href="user?.githubUrl"
            target="_blank"
            class="business-username"
          >
            @{{ user?.username }}
          </a>
        </div>
      </div>

      <!-- Bio -->
      <p
        v-if="user?.bio"
        class="business-bio"
      >
        {{ user.bio }}
      </p>

      <!-- Stats -->
      <div class="stats-grid">
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

      <!-- Languages -->
      <div v-if="user?.languages?.length" class="languages-container">
        <h4 class="languages-title">
          Languages
        </h4>
        <div class="languages-list">
          <span
            v-for="lang in user.languages"
            :key="lang.name"
            class="language-tag"
          >
            {{ lang.name }}
          </span>
        </div>
      </div>

      <!-- Last commit -->
      <div
        v-if="user?.lastCommit"
        class="last-commit"
      >
        Last commit: {{ formatDate(user.lastCommit.date) }}
      </div>
    </div>

    <!-- Download Button -->
    <button
      class="download-btn"
      @click="downloadCard"
    >
      Download as PNG
    </button>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import AnimatedCounter from './AnimatedCounter.vue';
import html2canvas from 'html2canvas';

export default defineComponent({
  name: 'BusinessCard',
  components: {
    AnimatedCounter
  },
  props: {
    user: { type: Object, required: true },
  },
  setup() {
    const cardRef = ref<HTMLElement | null>(null);

    const downloadCard = async () => {
      if (!cardRef.value) return;
      const canvas = await html2canvas(cardRef.value, {
        backgroundColor: '#18181b', // match app background
        scale: 2, // crisp export
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

    return { cardRef, downloadCard, formatDate };
  },
});
</script>
