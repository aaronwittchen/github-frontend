<template>
  <span :class="textClass">{{ formattedValue }}</span>
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  watch,
  onMounted,
  onUnmounted,
  computed,
} from 'vue';

export default defineComponent({
  name: 'AnimatedCounter',
  props: {
    value: {
      type: Number,
      default: 0,
    },
    duration: {
      type: Number,
      default: 1500, // Animation duration in milliseconds
    },
    textClass: {
      type: String,
      default: '',
    },
    format: {
      type: Function,
      default: (value: number) => value.toString(),
    },
  },
  setup(props) {
    const currentValue = ref(0);
    const isAnimating = ref(false);
    let animationFrameId: number;
    let startTime: number;
    let startValue: number;

    const easeOutQuad = (t: number): number => {
      return t * (2 - t);
    };

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;

      const progress = Math.min((timestamp - startTime) / props.duration, 1);
      const easedProgress = easeOutQuad(progress);

      currentValue.value = Math.round(
        startValue + (props.value - startValue) * easedProgress,
      );

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(animate);
      } else {
        currentValue.value = props.value;
        isAnimating.value = false;
      }
    };

    const startAnimation = () => {
      if (isAnimating.value) {
        cancelAnimationFrame(animationFrameId);
      }

      isAnimating.value = true;
      startValue = currentValue.value;
      startTime = 0;

      if (props.value !== startValue) {
        animationFrameId = requestAnimationFrame(animate);
      }
    };

    onMounted(() => {
      // Start with 0 and animate to initial value
      currentValue.value = 0;
      startAnimation();
    });

    watch(
      () => props.value,
      (newVal, oldVal) => {
        if (newVal !== oldVal) {
          startAnimation();
        }
      },
    );

    onUnmounted(() => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    });

    const formattedValue = computed(() => {
      return props.format(currentValue.value);
    });

    return {
      currentValue,
      formattedValue,
    };
  },
});
</script>
