<script setup>
  import { ref, onMounted } from 'vue'
  import { useSupabase } from '../../utils/supabase'

  const supabase = useSupabase()
  const user = ref(null)
  const loading = ref(true)

  // Récupérer l'utilisateur connecté
  async function getUserProfile() {
    loading.value = true
    const { data: { user: currentUser } } = await supabase.auth.getUser()
    user.value = currentUser
    loading.value = false
  }

  onMounted(() => {
    getUserProfile()
  })
</script>

<template>
  <UContainer class="py-12">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-3xl font-bold">Mon Profil</h1>
      <UButton icon="i-lucide-refresh-cw" variant="ghost" @click="getUserProfile">
        Refresh
      </UButton>
    </div>

    <div v-if="loading" class="space-y-4">
      <USkeleton class="h-32 w-full" />
    </div>

    <div v-else-if="user">
      <User :user="user" />
    </div>

    <UAlert
      v-else
      icon="i-lucide-alert-circle"
      color="red"
      variant="soft"
      title="Erreur"
      description="Impossible de charger le profil utilisateur."
    />
  </UContainer>
</template>