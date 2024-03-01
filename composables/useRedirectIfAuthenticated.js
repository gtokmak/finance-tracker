
export const useRedirectIfAuthenticated = (url='/') =>{
    const user = useSupabaseUser()

    watch(user, (user)=>{
        if(user){
            console.log(`useRedirectIfAuthenticated`)
            return navigateTo(url)
        }
    },{immediate:true})
    console.log(`useRedirectIfAuthenticated-1`)
    return {user}
}