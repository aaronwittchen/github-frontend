<template>
  <div class="mt-8 p-6 bg-[#232323] border-2 border-[#FFB86C] rounded-xl">
    <h3 class="text-xl font-bold text-[#FFB86C] mb-4">Contribution Activity</h3>
    <div class="flex items-end gap-1 overflow-x-auto py-2">
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
    <div class="flex justify-between mt-3 text-xs text-gray-400">
      <span>Mon</span>
      <span>Wed</span>
      <span>Fri</span>
      <span>Sun</span>
    </div>
    
    <!-- Legend -->
    <div class="flex items-center justify-end mt-4 gap-2 text-xs text-gray-400">
      <span>Less</span>
      <div class="flex">
        <div v-for="(color, index) in legendColors" :key="index" 
             class="w-3 h-3 mx-0.5" 
             :class="color"></div>
      </div>
      <span>More</span>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, PropType } from 'vue';

export interface ContributionDay {
  date: string;
  count: number;
  contributionCount?: number; // Added to match GitHub's API response
}

export interface User {
  contributions?: {
    weeks: Array<{
      contributionDays: ContributionDay[];
    }>;
  };
}

export default defineComponent({
  name: 'ContributionGraph',
  props: {
    user: {
      type: Object as PropType<User>,
      required: true
    }
  },
  setup(props) {
    // Use actual data if available, otherwise fall back to mock data
    const contributionWeeks = computed(() => {
      // If we have contributions data from the API, use it
      if (props.user?.contributions?.weeks?.length) {
        return props.user.contributions.weeks.map(week => 
          week.contributionDays.map(day => ({
            date: day.date,
            count: day.contributionCount || day.count || 0,
            contributionCount: day.contributionCount || day.count || 0
          }))
        );
      }
      
      // Fallback to mock data
      const weeks: ContributionDay[][] = [];
      const today = new Date();
      
      // Generate 52 weeks of data
      for (let week = 0; week < 52; week++) {
        const weekData: ContributionDay[] = [];
        
        // Generate 7 days for each week (Sun-Sat)
        for (let day = 0; day < 7; day++) {
          const date = new Date(today);
          date.setDate(date.getDate() - (week * 7) - (6 - day));
          
          // Random count for demo (replace with actual data)
          const count = Math.floor(Math.random() * 15);
          
          weekData.push({
            date: date.toISOString().split('T')[0],
            count: Math.random() > 0.3 ? count : 0 // 30% chance of no contributions
          });
        }
        
        weeks.push(weekData);
      }
      
      return weeks;
    });

    const legendColors = [
      'bg-[#161b22] border border-[#2a2f36]',
      'bg-[#0e4429]',
      'bg-[#006d32]',
      'bg-[#26a641]',
      'bg-[#39d353]'
    ];

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

    return {
      contributionWeeks,
      getContributionColor,
      formatContributionDate,
      legendColors
    };
  }
});
</script>
