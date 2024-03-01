<template>
    <UCard v-if="!success">
      <template #header>
        Sign-in to Finance Tracker
      </template>
  
      <form @submit.prevent="handleLogin">
        <UFormGroup label="Email" name="email" class="mb-4" :required="true"
          help="You will receive an email with the confirmation link">
          <UInput type="email" placeholder="Email" required v-model="email" />
        </UFormGroup>
  
        <UButton type="submit" variant="solid" color="black" :loading="pendig" :disabled="pendig">Sign-in</UButton>
      </form>
    </UCard>
    <UCard v-else>
      <template #header>
        Email has been sent
      </template>
  
      <div class="text-center">
        <p class="mb-4">We have sent an email to <strong>{{ email }}</strong> with a link to sign-in.</p>
        <p>
          <strong>Important:</strong> The link will expire in 5 minutes.
        </p>
      </div>
    </UCard>
  </template>
  
  <script setup>
  const success = ref(false)
  const email = ref('gokhantkmk@gmail.com')
  const pendig = ref(false)
  const {errorToast} = useAppToast()
  const supabase = useSupabaseClient()

  useRedirectIfAuthenticated()
  
  const handleLogin = async ()=>{
    pendig.value = true
    try {
        const {error} = await supabase.auth.signInWithOtp({
            email: email.value,
            options:{
                emailRedirectTo : 'http://localhost:3000/confirm'
            }
        }) 
        if (error) throw error
        success.value = true

    }catch(err){
       errorToast({
            title: 'Error authenticating',
            description: err.message,
        })
    } finally {
        pendig.value = false
    }
  }

  </script>