<template>
  <div class="flex flex-col items-center">
    <!-- Card -->
    <div
      ref="cardRef"
      class="w-[420px] bg-[#232323] border-2 border-[#FFB86C] rounded-xl p-6 font-mono text-gray-200 shadow-lg"
    >
      <!-- Header: Avatar + Name -->
      <div class="flex items-center gap-4 mb-6">
        <img
          :src="user?.avatarUrl"
          alt="Avatar"
          class="w-20 h-20 rounded-full border-2 border-[#FFB86C] object-cover"
        />
        <div>
          <h2 class="text-2xl font-bold text-[#FFB86C]">
            {{ user?.name || user?.username }}
          </h2>
          <a
            :href="user?.githubUrl"
            target="_blank"
            class="text-sm text-gray-400 hover:text-[#ffb86c] transition-colors"
          >
            @{{ user?.username }}
          </a>
        </div>
      </div>

      <!-- Bio -->
      <p v-if="user?.bio" class="mb-4 text-sm text-gray-300 leading-snug">
        {{ user.bio }}
      </p>

      <!-- Stats -->
      <div class="grid grid-cols-3 gap-3 mb-6 text-center">
        <div>
          <p class="text-lg font-bold text-[#ffb86c]">
            <AnimatedCounter 
              :value="user?.publicRepos || 0" 
              text-class="text-lg font-bold text-[#ffb86c]"
            />
          </p>
          <p class="text-xs text-gray-400">Repos</p>
        </div>
        <div>
          <p class="text-lg font-bold text-[#ffb86c]">
            <AnimatedCounter 
              :value="user?.followers || 0" 
              text-class="text-lg font-bold text-[#ffb86c]"
            />
          </p>
          <p class="text-xs text-gray-400">Followers</p>
        </div>
        <div>
          <p class="text-lg font-bold text-[#ffb86c]">
            <AnimatedCounter 
              :value="user?.following || 0" 
              text-class="text-lg font-bold text-[#ffb86c]"
            />
          </p>
          <p class="text-xs text-gray-400">Following</p>
        </div>
      </div>

      <!-- Languages -->
      <div v-if="user?.languages?.length" class="mb-6">
        <h4 class="text-sm font-semibold mb-2 text-[#dfac6b]">Languages</h4>
        <div class="flex flex-wrap gap-2">
          <span
            v-for="lang in user.languages"
            :key="lang.name"
            class="px-2 py-0.5 text-xs border border-[#FFB86C] text-gray-300 rounded"
          >
            {{ lang.name }}
          </span>
        </div>
      </div>

      <!-- Last commit -->
      <div
        v-if="user?.lastCommit"
        class="text-xs text-gray-400 border-t border-dashed border-[#FFB86C] pt-3"
      >
        Last commit: {{ formatDate(user.lastCommit.date) }}
      </div>
    </div>

    <!-- Download Button -->
    <button
      @click="downloadCard"
      class="mt-6 px-6 py-2 bg-[#232323] border-2 border-[#FFB86C] text-white rounded-lg hover:bg-[#2a2a2a] transition-colors"
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
  components: {
    AnimatedCounter
  },
  name: 'BusinessCard',
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
