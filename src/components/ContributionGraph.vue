<template>
  <div class="border border-[#FFB86C] rounded-lg overflow-hidden">
    <div class="bg-[#2a2a2a] p-4 border-b border-[#FFB86C]">
      <h2 class="text-lg font-bold text-[#FFB86C] flex items-center">
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
        {{ totalContributions.toLocaleString() }} contributions in the last year
      </h2>
    </div>

    <div class="p-6 bg-[#232323]">
      <div v-if="errorMessage" class="text-center text-[#FF6E6E] text-sm">
        {{ errorMessage }}
      </div>

      <div v-else class="relative">
        <!-- Month labels -->
        <div class="flex mb-2 text-xs text-[#A89984]">
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
          <div
            class="flex flex-col mr-2 text-xs text-[#A89984] justify-around h-[91px]"
          >
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
              <template
                v-if="weekIndex === 0 && week[0]?.day && week[0].day > 0"
              >
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
                  'w-[11px] h-[11px] rounded-sm border border-[#3a3a3a] hover:border-[#A89984] cursor-pointer transition-all duration-150',
                  getContributionColor(getContributionLevel(day.count)),
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
            class="text-xs text-[#A89984] hover:underline hover:text-[#FFB86C] transition-colors"
          >
            Learn how we count contributions
          </a>
          <div class="flex items-center gap-1 text-xs text-[#A89984]">
            <span>Less</span>
            <div class="flex gap-[3px] mx-2">
              <div
                v-for="level in [0, 1, 2, 3, 4]"
                :key="level"
                :class="[
                  'w-[11px] h-[11px] rounded-sm border border-[#3a3a3a]',
                  getContributionColor(level),
                ]"
              />
            </div>
            <span>More</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, defineProps } from 'vue';
import { ContributionDay, User } from '../types';

const props = defineProps<{ user: User }>();

const weeks = ref<ContributionDay[][]>([]);
const monthLabels = ref<{ name: string; index: number }[]>([]);
const totalContributions = ref(0);
const errorMessage = ref('');

const fetchContributions = async () => {
  if (!props.user) return;

  errorMessage.value = '';
  weeks.value = [];
  totalContributions.value = 0;

  try {
    const res = await fetch(
      `http://localhost:3000/api/v1/users/${props.user.username}/contributions`,
    );
    const data = await res.json();

    if (!data.weeks) {
      errorMessage.value = 'No contribution graph available';
      console.error('Invalid response format:', data);
      return;
    }

    data.weeks.forEach((week: ContributionDay[]) => {
      week.forEach((day: ContributionDay) => {
        day.day = new Date(day.date).getDay();
      });
    });

    weeks.value = data.weeks;
    totalContributions.value = data.weeks
      .flat()
      .reduce((sum, day) => sum + day.count, 0);

    const monthsSet = new Set<string>();
    data.weeks.flat().forEach((day: ContributionDay) => {
      const month = new Date(day.date).toLocaleDateString('en-US', {
        month: 'short',
      });
      monthsSet.add(month);
    });
    monthLabels.value = Array.from(monthsSet).map((name, index) => ({
      name,
      index,
    }));
  } catch (err) {
    errorMessage.value = 'No contribution graph available';
    console.error('Failed to fetch contributions', err);
  }
};

onMounted(() => fetchContributions());
watch(
  () => props.user,
  () => fetchContributions(),
  { immediate: true },
);

const getContributionLevel = (count: number): number => {
  if (count === 0) return 0;
  if (count <= 3) return 1;
  if (count <= 6) return 2;
  if (count <= 9) return 3;
  return 4;
};

const getContributionColor = (level: number): string => {
  const colors = [
    'bg-[#161b22]',
    'bg-[#0e4429]',
    'bg-[#006d32]',
    'bg-[#26a641]',
    'bg-[#39d353]',
  ];
  return colors[level];
};

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};
</script>

<style scoped>
/* Optional styling */
</style>
