<script setup>
import NavBar from './components/NavBar.vue'
import HeroSection from './components/HeroSection.vue'
import StatsBar from './components/StatsBar.vue'
import CategoriesSection from './components/CategoriesSection.vue'
import FeaturedListings from './components/FeaturedListings.vue'
import HowItWorks from './components/HowItWorks.vue'
import CtaSection from './components/CtaSection.vue'
import FooterSection from './components/FooterSection.vue'
</script>

<template>
  <div>
    <NavBar />
    <main>
      <HeroSection />
      <StatsBar />
      <CategoriesSection />
      <FeaturedListings />
      <HowItWorks />
      <CtaSection />
    </main>
    <FooterSection />
  </div>
</template>
