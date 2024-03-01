<template>
  <UModal v-model="isOpen">
    <UCard>
      <template #header> Add Transaction </template>
        <UForm :state="state" :schema="schema" ref="form" @submit="save">
            <UFormGroup label="Transaction Type" :required="true" name="type" class="mb-4">
                <USelect placeholder="Select the transaction type" :options="types" v-model="state.type"/>
            </UFormGroup>
            
            <UFormGroup label="Amount" :required="true" name="amount" class="mb-4">
                <UInput type="number" placeholder="Amount"  v-model.number="state.amount" />
            </UFormGroup>
            
            <UFormGroup label="Transaction date" :required="true" name="created_at" class="mb-4">
                <UInput type="date" icon="i-heroicons-calendar-days-20-solid"   v-model="state.created_at"/>
            </UFormGroup>
            
            <UFormGroup label="Description" hint="Optional" name="description" class="mb-4">
                <UInput placeholder="Description"  v-model="state.description" />
            </UFormGroup>
            <UFormGroup label="Category" :required="true" name="category" class="mb-4" v-if="state.type==='Expense'">
                <USelect placeholder="Category" :options="categories"  v-model="state.category"/>
            </UFormGroup>
            
            <UButton type="submit" color="black" variant="solid" label="Save" :loading="isLoading"/>
        </UForm>
    </UCard>
  </UModal>
</template>

<script setup>
import {categories, types} from '~/constant'
import {z} from 'zod'

const emit = defineEmits(['saved'])
const isOpen = defineModel()
watch(isOpen, ()=>{if(!isOpen.value) resetForm()})

const initialState = {
    type:undefined,
    amount:0,
    created_at:undefined,
    description:undefined,
    category: undefined
}

const resetForm= () => {
    Object.assign(state.value, initialState)
    form.value.clear()
}
const state = ref({...initialState})

const defaultSchema = z.object({
    created_at: z.string(),
    description: z.string().optional(),
    amount: z.number().positive('Sifirdan buyuk sayi olmali')

})

const incomeSchema = z.object({
  type: z.literal('Income')
})



const expenseSchema = z.object({
    type: z.literal('Expense'),
    category: z.enum(categories)
})

const investmentSchema = z.object({
    type: z.literal('Investment')
})

const savingSchema = z.object({
    type: z.literal('Saving')
})

const schema = z.intersection(
  z.discriminatedUnion('type', [incomeSchema, expenseSchema, investmentSchema, savingSchema]),
  defaultSchema
)

const form = ref()
const isLoading = ref(false)
const supabase = useSupabaseClient()
const {successToast, errorToast} = useAppToast()

const save = async () => {
    console.log(state.value)
  if (form.value.errors.length) return
  isLoading.value = true
  try{
    const {error} = await supabase.from('transactions').upsert({...state.value})
    if (!error){
        successToast({
            title: 'Transaction saved',
        })
        isOpen.value = false
        emit('saved')
        return
    }
   throw error
    
  } catch(e){
    errorToast({
            title: 'Transaction not saved',
            description: e.message,
        })
  }
   finally{
    isLoading.value =false
  }
}

</script>
