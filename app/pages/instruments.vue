
<script setup>
  import { useSupabase } from '../../utils/supabase'
  const supabase = useSupabase();
  const instruments = ref([])

  async function getInstruments() {
    const { data } = await supabase.from('instruments').select();
    instruments.value = data
  }

  onMounted(() => {
    getInstruments()
  })

</script>

<template>
    <UContainer class="py-12">
        <h1 class="text-3xl font-bold mb-6">Instruments</h1>
        <UButton @click="getInstruments" class="mb-4">Refresh</UButton>
        <UPageCard v-for="instrument in instruments" :key="instrument.id" class="mb-4">
            <h2 class="text-xl font-semibold">{{ instrument.name }}</h2>
        </UPageCard>
    </UContainer>
</template>
