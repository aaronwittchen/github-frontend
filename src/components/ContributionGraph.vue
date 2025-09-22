<template>
  <div class="w-full max-w-4xl mx-auto p-6 bg-[#0d1117] border border-[#30363d] rounded-lg">
    <div class="mb-4">
      <h2 class="text-xl font-semibold text-[#f0f6fc] mb-2">
        {{ totalContributions.toLocaleString() }} contributions in the last year
      </h2>
    </div>

    <div class="relative">
      <!-- Month labels -->
      <div class="flex mb-2 text-xs text-[#8b949e]">
        <div 
          v-for="(month, index) in monthLabels" 
          :key="month.name + index" 
          class="flex-1 text-left"
          style="min-width: 40px"
        >
          {{ index % 2 === 0 ? month.name : '' }}
        </div>
      </div>

      <div class="flex">
        <!-- Day labels -->
        <div class="flex flex-col mr-2 text-xs text-[#8b949e] justify-around h-[91px]">
          <div>Mon</div>
          <div>Wed</div>
          <div>Fri</div>
        </div>

        <!-- Contribution grid -->
        <div class="flex gap-[3px] overflow-x-auto">
          <div 
            v-for="(week, weekIndex) in weeks" 
            :key="weekIndex" 
            class="flex flex-col gap-[3px]"
          >
            <!-- Fill empty days at the beginning of first week -->
            <template v-if="weekIndex === 0 && week.length > 0 && week[0] && week[0].day && week[0].day > 0">
              <div
                v-for="i in week[0].day"
                :key="`empty-${i}`"
                class="w-[11px] h-[11px]"
              ></div>
            </template>
            
            <div
              v-for="(day, dayIndex) in week"
              :key="dayIndex"
              :class="[
                'w-[11px] h-[11px] rounded-sm border border-[#30363d] hover:border-[#8b949e] cursor-pointer transition-all duration-150',
                getContributionColor(getContributionLevel(day.count))
              ]"
              :title="`${day.count} contributions on ${formatDate(day.date)}`"
            />
          </div>
        </div>
      </div>

      <!-- Legend -->
      <div class="flex items-center justify-between mt-4">
        <a 
          href="https://docs.github.com/en/account-and-profile/how-tos/setting-up-and-managing-your-github-profile/managing-contribution-settings-on-your-profile/troubleshooting-missing-contributions" 
          target="_blank" 
          rel="noopener noreferrer"
          class="text-xs text-[#8b949e] hover:underline hover:text-[#58a6ff] transition-colors"
        >
          Learn how we count contributions
        </a>
        <div class="flex items-center gap-1 text-xs text-[#8b949e]">
          <span>Less</span>
          <div class="flex gap-[3px] mx-2">
            <div
              v-for="level in [0, 1, 2, 3, 4]"
              :key="level"
              :class="[
                'w-[11px] h-[11px] rounded-sm border border-[#30363d]',
                getContributionColor(level)
              ]"
            />
          </div>
          <span>More</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, defineProps } from 'vue';

interface ContributionDay {
  date: string;
  count: number;
  day?: number;
  contributionCount?: number;
}

interface Repository {
  // Add your Repository interface fields as needed
  [key: string]: any;
}

interface Commit {
  // Add your Commit interface fields as needed
  [key: string]: any;
}

interface ContributionWeek {
  contributionDays: ContributionDay[];
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

const props = defineProps<{
  user: User;
}>();
const contributions = ref<ContributionDay[]>([]);

const processUserData = (): ContributionDay[] => {
  // If we have contributions data from the user prop, use it
  if (props.user?.contributions?.weeks?.length) {
    const data: ContributionDay[] = [];
    
    props.user.contributions.weeks.forEach(week => {
      week.contributionDays.forEach(day => {
        const date = new Date(day.date);
        data.push({
          date: day.date,
          count: day.contributionCount || day.count || 0,
          day: date.getDay(),
          contributionCount: day.contributionCount || day.count || 0
        });
      });
    });
    
    return data;
  }
  
  // Fallback to mock data if no user data provided
  return generateMockContributions();
};

const generateMockContributions = (): ContributionDay[] => {
  const data: ContributionDay[] = [];
  const today = new Date();
  
  // Start from the Sunday of the week that contains today minus 52 weeks
  const startDate = new Date(today);
  startDate.setDate(today.getDate() - 364); // 52 weeks * 7 days - 1
  
  // Find the Sunday before start date
  const dayOfWeek = startDate.getDay();
  startDate.setDate(startDate.getDate() - dayOfWeek);
  
  // Generate exactly 371 days (53 weeks) to ensure we cover the full year
  for (let i = 0; i < 371; i++) {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + i);
    
    // Don't include future dates
    if (date > today) break;
    
    // Generate realistic contribution pattern
    let count = 0;
    const dayOfWeek = date.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    
    // Lower activity on weekends, higher on weekdays
    const baseChance = isWeekend ? 0.3 : 0.7;
    
    if (Math.random() < baseChance) {
      // Weighted random for more realistic distribution
      const rand = Math.random();
      if (rand < 0.4) count = 1 + Math.floor(Math.random() * 3); // 1-3 contributions (40%)
      else if (rand < 0.7) count = 4 + Math.floor(Math.random() * 6); // 4-9 contributions (30%)
      else if (rand < 0.9) count = 10 + Math.floor(Math.random() * 10); // 10-19 contributions (20%)
      else count = 20 + Math.floor(Math.random() * 15); // 20-34 contributions (10%)
    }
    
    data.push({
      date: date.toISOString().split('T')[0],
      count: count,
      day: date.getDay()
    });
  }
  
  return data;
};

// Group contributions by weeks (Sunday to Saturday)
const weeks = computed(() => {
  const weekArray: ContributionDay[][] = [];
  let currentWeek: ContributionDay[] = [];
  
  contributions.value.forEach((day, index) => {
    currentWeek.push(day);
    
    // If it's Saturday (day 6) or the last day, complete the week
    if (day.day === 6 || index === contributions.value.length - 1) {
      weekArray.push([...currentWeek]);
      currentWeek = [];
    }
  });

  return weekArray;
});

const getContributionLevel = (count: number): number => {
  if (count === 0) return 0;
  if (count <= 3) return 1;
  if (count <= 6) return 2;
  if (count <= 9) return 3;
  return 4;
};

const getContributionColor = (level: number): string => {
  const colors = [
    'bg-[#161b22]', // No contributions
    'bg-[#0e4429]', // Level 1
    'bg-[#006d32]', // Level 2  
    'bg-[#26a641]', // Level 3
    'bg-[#39d353]'  // Level 4
  ];
  return colors[level];
};

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
};

const monthLabels = computed(() => {
  const labels = [];
  const currentDate = new Date();
  for (let i = 11; i >= 0; i--) {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
    const monthName = date.toLocaleDateString('en-US', { month: 'short' });
    labels.push({
      name: monthName,
      index: 11 - i
    });
  }
  return labels;
});

const totalContributions = computed(() => {
  return contributions.value.reduce((sum, day) => sum + day.count, 0);
});

onMounted(() => {
  contributions.value = processUserData();
});
</script>

<style scoped>
/* Add any additional styles if needed */
</style>