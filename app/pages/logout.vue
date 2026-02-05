<script setup>
// This page is used to log out the user and redirect to the login page
import { onMounted } from 'vue'
import { navigateTo } from '#app'
import { useSupabase } from '../../utils/supabase'

const supabase = useSupabase()

onMounted(async () => {
  await supabase.auth.signOut()
  navigateTo('/login')
})
</script>

<template>
  <div>Logging out...</div>
</template>