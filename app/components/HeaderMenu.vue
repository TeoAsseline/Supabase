<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useSupabase } from '../../utils/supabase' // Utilise '~' pour un chemin absolu plus sûr

const supabase = useSupabase()
const isLoggedIn = ref(false)

// Calcul dynamique du menu basé sur l'état isLoggedIn
const menuItems = computed(() => {
  if (isLoggedIn.value) {
    return [
      { label: 'Home', to: '/' },
      { label: 'Instruments', to: '/instruments' },
      { label: 'Logout', to: '/logout' }
    ]
  } else {
    return [
      { label: 'Login', to: '/login' }
    ]
  }
})

onMounted(async () => {
  // 1. Vérification initiale au chargement
  const { data } = await supabase.auth.getSession()
  isLoggedIn.value = !!data.session

  // 2. Écouteur en temps réel (Login/Logout)
  supabase.auth.onAuthStateChange((_event, session) => {
    isLoggedIn.value = !!session
  })
})
</script>

<template>
  <UNavigationMenu :items="menuItems" />
</template>