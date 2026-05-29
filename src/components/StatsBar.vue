<script setup>
const stats = [
  { value: '12 847', label: 'Annonces actives', icon: '📋' },
  { value: '4 203',  label: 'Jardiniers inscrits', icon: '🌿' },
  { value: '48',     label: 'Catégories', icon: '🗂️' },
  { value: '4,8★',   label: 'Note moyenne', icon: '⭐' },
]
</script>

<template>
  <section class="stats-bar">
    <div class="stats-inner container">
      <div v-for="(stat, i) in stats" :key="i" class="stat-item">
        <span class="stat-icon">{{ stat.icon }}</span>
        <div class="stat-text">
          <strong class="stat-value">{{ stat.value }}</strong>
          <span class="stat-label">{{ stat.label }}</span>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.stats-bar {
  background: var(--forest-800);
  padding: 0;
}

.stats-inner {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 28px 48px;
  position: relative;
  flex: 1;
  justify-content: center;
}

.stat-item:not(:last-child)::after {
  content: '';
  position: absolute;
  right: 0; top: 25%; bottom: 25%;
  width: 1px;
  background: rgba(255,255,255,0.1);
}

.stat-icon { font-size: 26px; flex-shrink: 0; }

.stat-text {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.stat-value {
  font-family: var(--font-heading);
  font-size: 26px;
  font-weight: 700;
  color: white;
  line-height: 1;
  letter-spacing: -0.5px;
}

.stat-label {
  font-size: 13px;
  color: rgba(255,255,255,0.55);
  font-weight: 400;
  white-space: nowrap;
}

@media (max-width: 768px) {
  .stats-inner {
    flex-wrap: wrap;
  }
  .stat-item {
    flex: 1 1 50%;
    padding: 20px 24px;
  }
  .stat-item:nth-child(2)::after { display: none; }
  .stat-item:nth-child(3)::after { display: none; }
}

@media (max-width: 400px) {
  .stat-item { flex: 1 1 100%; }
  .stat-item::after { display: none !important; }
}
</style>
