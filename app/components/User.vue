<script setup>
import { ref, watch } from 'vue'
import { useSupabase } from '../../utils/supabase'

// 1. On accepte un objet 'user' en propriété
const props = defineProps({
  user: {
    type: Object,
    required: true
  }
})

const supabase = useSupabase()
const toast = useToast()
const loading = ref(false)
const fileInput = ref(null)

// On initialise l'avatar avec les métadonnées de l'utilisateur ou une image par défaut
const avatarSrc = ref(props.user?.user_metadata?.avatar_url || 'https://i.pravatar.cc/150?u=default')

const triggerFileInput = () => {
  fileInput.value.click()
}

const handleFileUpload = async (event) => {
  const file = event.target.files[0]
  if (!file) return

  loading.value = true

  try {
    const fileExt = file.name.split('.').pop()
    const fileName = `${props.user.id}-${Date.now()}.${fileExt}` // ID unique basé sur l'user
    const filePath = `public/${fileName}`

    const { error } = await supabase.storage
      .from('avatars')
      .upload(filePath, file, { cacheControl: '3600', upsert: false })

    if (error) throw error

    const { data: publicUrlData } = supabase.storage
      .from('avatars')
      .getPublicUrl(filePath)

    // 2. Mise à jour locale + Mise à jour du profil Auth Supabase
    const publicUrl = publicUrlData.publicUrl
    avatarSrc.value = publicUrl

    // Sauvegarder l'URL dans les métadonnées de l'utilisateur pour qu'elle reste à la prochaine connexion
    await supabase.auth.updateUser({
      data: { avatar_url: publicUrl }
    })
    
    toast.add({ title: 'Succès', description: 'Avatar mis à jour !', color: 'success' })

  } catch (error) {
    toast.add({ title: 'Erreur', description: error.message, color: 'red' })
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <UCard>
    <div class="flex items-center gap-6">
      <div class="relative">
        <UAvatar
          :src="avatarSrc"
          :alt="user.email"
          size="3xl"
        />
        <UButton 
          icon="i-lucide-camera"
          size="2xs"
          color="primary"
          class="absolute bottom-0 right-0 rounded-full"
          :loading="loading"
          @click="triggerFileInput"
        />
      </div>

      <div class="flex-1">
        <h3 class="text-xl font-bold text-gray-900 dark:text-white">
          {{ user.user_metadata?.full_name || 'Utilisateur sans nom' }}
        </h3>
        <p class="text-gray-500 dark:text-gray-400">
          {{ user.email }}
        </p>
        <p class="text-xs text-gray-400 mt-1">
          ID: {{ user.id }}
        </p>
      </div>

      <input
        ref="fileInput"
        type="file"
        accept="image/*"
        class="hidden"
        @change="handleFileUpload"
      />
    </div>
  </UCard>
</template>