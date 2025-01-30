<template>
  <div class="logo" @click="goHome">
    <div class="logo-icon">
      <svg viewBox="0 0 24 24" class="icon">
        <path 
          d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" 
          fill="none" 
          stroke="currentColor" 
          stroke-width="2" 
          stroke-linecap="round" 
          stroke-linejoin="round"
        />
      </svg>
    </div>
    <div class="logo-text">
      <span class="primary">易</span>购商城
    </div>
  </div>
</template>

<script>
import { useRouter } from 'vue-router'

export default {
  name: 'Logo',
  setup() {
    const router = useRouter()

    const goHome = () => {
      router.push('/')
    }

    return {
      goHome
    }
  }
}
</script>

<style scoped>
.logo {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  user-select: none;
}

.logo-icon {
  width: 32px;
  height: 32px;
  color: var(--primary-color);
}

.icon {
  width: 100%;
  height: 100%;
}

.logo-text {
  font-size: 24px;
  font-weight: bold;
  color: #333;
}

.primary {
  color: var(--primary-color);
}

/* 悬停效果 */
.logo:hover .logo-icon {
  transform: scale(1.1);
}

.logo-icon {
  transition: transform 0.3s ease;
}

@media (max-width: 768px) {
  .logo-icon {
    width: 28px;
    height: 28px;
  }

  .logo-text {
    font-size: 20px;
  }
}
</style> 