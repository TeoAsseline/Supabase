// middleware/auth.global.ts
import { defineNuxtRouteMiddleware, navigateTo } from '#app'
import { useSupabase } from '../../utils/supabase'

export default defineNuxtRouteMiddleware(async (to, from) => {
  const supabase = useSupabase()
  const { data: { session } } = await supabase.auth.getSession()

  // 1. Si l'utilisateur n'est PAS connecté et essaie d'aller ailleurs que sur Login
  if (!session && to.path !== '/login') {
    return navigateTo('/login')
  }

  // 2. Si l'utilisateur EST connecté et essaie d'aller sur Login
  if (session && to.path === '/login') {
    return navigateTo('/')
  }
})