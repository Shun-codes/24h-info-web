<script setup>
const items = [
  {
    label: 'Annonces actives',
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></svg>`,
  },
  {
    label: 'Jardiniers inscrits',
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
  },
  {
    label: 'Catégories disponibles',
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>`,
  },
  {
    label: 'Échanges réalisés',
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/></svg>`,
  },
]
</script>

<template>
  <section class="stats-bar">
    <div class="stats-inner container">
      <div v-for="(item, i) in items" :key="i" class="stat-item">
        <span class="stat-icon" v-html="item.icon"></span>
        <span class="stat-label">{{ item.label }}</span>
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
  gap: 12px;
  padding: 24px 40px;
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

.stat-icon {
  width: 24px; height: 24px;
  flex-shrink: 0;
  color: var(--forest-300);
  display: flex;
  align-items: center;
  justify-content: center;
}
.stat-icon :deep(svg) { width: 24px; height: 24px; color: var(--forest-300); }

.stat-label {
  font-size: 14px;
  color: rgba(255,255,255,0.65);
  font-weight: 500;
  white-space: nowrap;
}

@media (max-width: 768px) {
  .stats-inner { flex-wrap: wrap; }
  .stat-item { flex: 1 1 50%; padding: 18px 20px; }
  .stat-item:nth-child(2)::after { display: none; }
  .stat-item:nth-child(3)::after { display: none; }
}

@media (max-width: 400px) {
  .stat-item { flex: 1 1 100%; }
  .stat-item::after { display: none !important; }
}
</style>
