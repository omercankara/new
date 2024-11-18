import {pinia} from '@/main'
import {useAuthStore} from '@/stores/authStore'

export function authMiddleware({to, next}: any) {
    const authStore = useAuthStore(pinia)
    if (!authStore.isAuthenticated()) {
        const fullPath:string = to.fullPath as string;
        if (fullPath && !['/login', '/logout'].includes(fullPath)) {
            next('/login?referrerUrl=' + to.fullPath);
            return;
        }
        next('/login')
    }
}
