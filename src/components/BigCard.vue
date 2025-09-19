<template>
  <div class="flex flex-col items-center">
    <!-- Big Card -->
    <div
      ref="cardRef"
      class="w-[800px] bg-[#232323] border-2 border-[#FFB86C] rounded-xl p-8 font-mono text-gray-200 shadow-lg relative"
    >
      <!-- Top Right Logo -->
      <div class="absolute top-4 right-6 text-2xl font-bold text-[#ffb86c]">
        devlogs<span class="terminal-blinking-cursor">█</span>
      </div>

      <div class="flex flex-col lg:flex-row gap-8">
        <!-- Left Side -->
        <div class="flex-1 flex flex-col justify-center">
          <!-- Username -->
          <p class="text-sm text-gray-400">@{{ user?.username }}</p>
          <!-- Name -->
          <h2 class="text-3xl font-bold text-[#FFB86C] mb-2">
            {{ user?.name || user?.username }}
          </h2>
          <!-- Bio -->
          <p v-if="user?.bio" class="mb-6 text-gray-300 leading-snug max-w-md">
            {{ user.bio }}
          </p>

          <!-- Followers / Following -->
          <div class="flex gap-8 mb-6">
            <div>
              <p class="text-lg font-bold text-[#ffb86c]">
                {{ user?.followers }}
              </p>
              <p class="text-xs text-gray-400">Followers</p>
            </div>
            <div>
              <p class="text-lg font-bold text-[#ffb86c]">
                {{ user?.following }}
              </p>
              <p class="text-xs text-gray-400">Following</p>
            </div>
          </div>
        </div>

        <!-- Right Side -->
        <div class="flex-1 flex flex-col items-center">
          <!-- Avatar -->
          <img
            :src="user?.avatarUrl"
            alt="Avatar"
            class="w-40 h-40 rounded-full border-2 border-[#FFB86C] object-cover mb-6"
          />

          <!-- Separator -->
          <div
            class="w-full border-t border-dashed border-[#FFB86C] my-4"
          ></div>

          <!-- Info Blocks -->
          <div class="grid grid-cols-2 gap-4 w-full">
            <!-- Languages -->
            <div class="bg-[#18181b] p-4 rounded border border-[#FFB86C]/50">
              <p class="text-sm font-semibold text-[#dfac6b] mb-2">
                Top Language
              </p>
              <p class="text-lg font-bold text-[#ffb86c]">
                {{ user?.languages?.[0]?.name || 'N/A' }}
              </p>
            </div>

            <!-- Commits -->
            <div class="bg-[#18181b] p-4 rounded border border-[#FFB86C]/50">
              <p class="text-sm font-semibold text-[#dfac6b] mb-2">
                Last Commit
              </p>
              <p class="text-xs text-gray-300 truncate">
                {{ user?.lastCommit?.message || 'No recent commits' }}
              </p>
            </div>

            <div class="grid grid-cols-3 gap-4">
              <!-- Repositories -->
              <div class="bg-[#18181b] p-4 rounded border border-[#FFB86C]/50">
                <p class="text-sm font-semibold text-[#dfac6b] mb-2">
                  Repositories
                </p>
                <p class="text-lg font-bold text-[#ffb86c]">
                  <AnimatedCounter 
                    :value="user?.publicRepos ?? 0" 
                    text-class="text-lg font-bold text-[#ffb86c]"
                  />
                </p>
              </div>

              <!-- Stars -->
              <div class="bg-[#18181b] p-4 rounded border border-[#FFB86C]/50">
                <p class="text-sm font-semibold text-[#dfac6b] mb-2">Stars</p>
                <p class="text-lg font-bold text-[#ffb86c]">
                  <AnimatedCounter 
                    :value="totalStars" 
                    text-class="text-lg font-bold text-[#ffb86c]"
                  />
                </p>
              </div>
            </div>
          </div>

          <!-- Contributions Streak -->
          <div class="mt-6">
            <p class="text-sm font-semibold text-[#dfac6b] mb-3">Contributions</p>
            <div class="flex items-end gap-1">
              <div v-for="(week, weekIndex) in contributionWeeks" :key="weekIndex" class="flex flex-col gap-1">
                <div 
                  v-for="(day, dayIndex) in week" 
                  :key="dayIndex"
                  class="w-3 h-3 rounded-sm"
                  :class="getContributionColor(day.count)"
                  :title="`${day.count} contributions on ${formatContributionDate(day.date)}`"
                ></div>
              </div>
            </div>
            <div class="flex justify-between mt-2 text-xs text-gray-400">
              <span>Mon</span>
              <span>Wed</span>
              <span>Fri</span>
              <span>Sun</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Download Button -->
    <button
      @click="downloadCard"
      class="mt-6 px-6 py-2 bg-[#232323] border-2 border-[#FFB86C] text-white rounded-lg hover:bg-[#2a2a2a] transition-colors"
    >
      Download Big Card
    </button>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, PropType } from 'vue';
import html2canvas from 'html2canvas';
import AnimatedCounter from './AnimatedCounter.vue';

interface Repository {
  name: string;
  description: string | null;
  htmlUrl: string;
  stars: number;
  language: string | null;
  updatedAt: string;
}

interface Commit {
  message: string;
  url: string;
  sha: string;
  date: string;
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
  languages?: Array<{name: string, percentage: number}>;
  lastCommit?: Commit;
}

export default defineComponent({
  name: 'BigCard',
  components: {
    AnimatedCounter
  },
  props: {
    user: {
      type: Object as PropType<User>,
      required: true,
      validator: (user: User) => {
        return (
          typeof user === 'object' &&
          'username' in user &&
          'followers' in user &&
          'following' in user &&
          'avatarUrl' in user
        );
      }
    },
  },
  setup(props) {
    const cardRef = ref<HTMLElement | null>(null);

    // Generate mock contribution data (replace with actual data from your API)
    const contributionWeeks = computed(() => {
      const weeks = [];
      const today = new Date();
      
      // Generate 52 weeks of data
      for (let week = 0; week < 52; week++) {
        const weekData = [];
        
        // Generate 7 days for each week (Sun-Sat)
        for (let day = 0; day < 7; day++) {
          const date = new Date(today);
          date.setDate(date.getDate() - (week * 7) - (6 - day));
          
          // Random count for demo (replace with actual data)
          const count = Math.floor(Math.random() * 10);
          
          weekData.push({
            date: date.toISOString().split('T')[0],
            count: count > 3 ? count - 3 : count // Make some days empty for realism
          });
        }
        
        weeks.push(weekData);
      }
      
      return weeks;
    });

    const getContributionColor = (count: number) => {
      if (count === 0) return 'bg-[#161b22] border border-[#2a2f36]';
      if (count < 3) return 'bg-[#0e4429]';
      if (count < 5) return 'bg-[#006d32]';
      if (count < 10) return 'bg-[#26a641]';
      return 'bg-[#39d353]';
    };

    const formatContributionDate = (dateString: string) => {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
    };

    const totalStars = computed(() => {
      if (!props.user?.topRepositories) return 0;
      return props.user.topRepositories?.reduce(
        (sum: number, repo: Repository) => sum + (repo.stars || 0),
        0
      ) || 0;
    });

    const downloadCard = async () => {
      if (!cardRef.value) return;
      const canvas = await html2canvas(cardRef.value, {
        backgroundColor: '#18181b',
        scale: 2,
      });
      const link = document.createElement('a');
      link.download = 'github-big-card.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
    };

    return { 
      cardRef, 
      downloadCard, 
      totalStars, 
      contributionWeeks, 
      getContributionColor, 
      formatContributionDate 
    };
  },
});
</script>
