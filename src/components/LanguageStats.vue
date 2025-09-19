<template>
  <div class="mt-8">
    <h3 class="text-xl font-semibold mb-4 text-[#dfac6b]">
      Language Statistics
    </h3>
    <div class="bg-[#232323] p-6 rounded-lg border border-gray-700">
      <div
        v-if="languages.length > 0"
        class="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        <!-- Chart -->
        <div class="h-64">
          <canvas ref="chartCanvas"></canvas>
        </div>

        <!-- Language List -->
        <div class="space-y-3">
          <div
            v-for="lang in languages"
            :key="lang.name"
            class="flex items-center justify-between p-3 bg-gray-800/50 rounded"
          >
            <div class="flex items-center">
              <span
                class="w-3 h-3 rounded-full mr-2"
                :style="{ backgroundColor: getLanguageColor(lang.name) }"
              ></span>
              <span class="font-medium">{{ lang.name }}</span>
            </div>
            <div class="text-gray-400">
              {{ lang.percentage }}% ({{ lang.count }} repos)
            </div>
          </div>
        </div>
      </div>
      <div v-else class="text-center py-4 text-gray-400">
        No language data available
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, onUnmounted, ref, watch } from 'vue';
import { Chart, registerables } from 'chart.js';

type LanguageName = string;

const languageColors = {
  JavaScript: '#f1e05a',
  TypeScript: '#3178c6',
  Python: '#3572A5',
  Java: '#b07219',
  'C++': '#f34b7d',
  'C#': '#178600',
  PHP: '#4F5D95',
  Ruby: '#701516',
  CSS: '#563d7c',
  HTML: '#e34c26',
  Go: '#00ADD8',
  Rust: '#dea584',
  Swift: '#F05138',
  Kotlin: '#A97BFF',
  Shell: '#89e051',
  'Jupyter Notebook': '#DA5B0B',
  Vue: '#41b883',
  React: '#61dafb',
  Angular: '#dd0031',
  Svelte: '#ff3e00',
} as const;

interface LanguageData {
  name: LanguageName;
  percentage: number;
  count?: number;
}

// Register Chart.js components
Chart.register(...registerables);

export default defineComponent({
  name: 'LanguageStats',
  props: {
    languages: {
      type: Array as () => LanguageData[],
      required: true,
      default: () => [],
      validator: (value: unknown[]): value is LanguageData[] => {
        return (
          Array.isArray(value) &&
          value.every(
            (item): item is LanguageData =>
              item !== null &&
              typeof item === 'object' &&
              'name' in item &&
              'percentage' in item &&
              'count' in item &&
              typeof item.name === 'string' &&
              typeof item.percentage === 'number' &&
              typeof item.count === 'number'
          )
        );
      },
    },
  },
  setup(props) {
    const chartCanvas = ref<HTMLCanvasElement | null>(null);
    let chart: Chart | null = null;

    // Language colors are now defined at the module level

    const getLanguageColor = (language: string): string => {
      // Use type assertion with a fallback to handle any language name
      return (languageColors as Record<string, string>)[language] || '#9ca3af';
    };

    const renderChart = () => {
      // Ensure we have valid data
      if (
        !props.languages ||
        !Array.isArray(props.languages) ||
        props.languages.length === 0
      ) {
        return;
      }
      if (!chartCanvas.value) return;

      // Destroy previous chart if it exists
      if (chart) {
        chart.destroy();
      }

      if (!chartCanvas.value) return;
      const ctx = chartCanvas.value.getContext('2d');
      if (!ctx) return;

      // Prepare data for chart
      const labels = props.languages.map((lang) => lang.name);
      const data = props.languages.map((lang) => lang.percentage);
      const backgroundColors = props.languages.map((lang) =>
        getLanguageColor(lang.name)
      );

      chart = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels,
          datasets: [
            {
              data,
              backgroundColor: backgroundColors,
              borderWidth: 0,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'right',
              labels: {
                color: '#9ca3af',
                font: {
                  family: 'sans-serif',
                },
              },
            },
            tooltip: {
              callbacks: {
                label: (context) => {
                  const label = context.label || '';
                  const value = context.raw as number;
                  return `${label}: ${value}%`;
                },
              },
            },
          },
          cutout: '70%',
          animation: {
            animateScale: true,
            animateRotate: true,
          },
        },
      });
    };

    // Watch for changes in languages prop
    watch(
      () => props.languages,
      (newVal) => {
        if (newVal.length > 0) {
          renderChart();
        }
      },
      { immediate: true, deep: true }
    );

    onMounted(() => {
      renderChart();
    });

    // Clean up chart on unmount
    onUnmounted(() => {
      if (chart) {
        chart.destroy();
        chart = null;
      }
    });

    return {
      chartCanvas,
      getLanguageColor,
    };
  },
});
</script>
