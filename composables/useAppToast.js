
  export const useAppToast = () => {
    const toast = useToast()

    return {
        successToast: ({title, description=null})=>{
            toast.add({
                title,
                description,
                icon: "i-heroicons-check-circle",
                color: "green",
              })
        },
        errorToast:({title, description=null})=>{
            toast.add({
                title,
                description,
                icon: "i-heroicons-exclamation-circle",
                color: "red",
              })
        }

    }
}
