import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';
import { authMiddleware } from "./middleware/auth";

const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        redirect: '/home'
    },
    {
        path: '/',
        component: () => import('@/views/Index.vue'),
        children: [
            {
                path: 'home',
                name: 'home',
                component: () => import('@/modules/home/views/Home.vue')
            },
           
           

            {
                path: 'profile',
                name: 'profile',
                component: () => import('@/modules/profile/views/Profile.vue')
            },
            {
                path: '/EditName',
                name: 'EditName',
                component: () => import('@/modules/profile/views/EditName.vue')
            },
            {
                path: '/EditPassword',
                name: 'EditPassword',
                component: () => import('@/modules/profile/views/EditPassword.vue')
            },
            {
                path: '/EditPhone',
                name: 'EditPhone',
                component: () => import('@/modules/profile/views/EditPhone.vue')
            },
            {
                path: '/EditEmail',
                name: 'EditEmail',
                component: () => import('@/modules/profile/views/EditEmail.vue')
            },
            {
                path:'/messages',
                name:'messages',
                component: () => import('@/modules/messages/views/Messages.vue')
            },
            {
                path:'/reset-password/:code',
                name:'reset-password',
                component: () => import('@/modules/resetpassword/views/ResetPassword.vue')
            },
            {
                path:'/messageDetails/:code',
                name:'messageDetails',
                component: () => import('@/modules/messages/views/MessageDetails.vue')
            },
            {
                path: 'categories',
                name: 'categories',
                component: () => import('@/modules/category/views/CategoryIndex.vue')
            },
            {
                path: 'category/:code?',
                name: 'category',
                component: () => import('@/modules/category/views/CategoryList.vue')
            },
            {
                path:'allCategory/',
                name:'allCategory',
                component: () => import('@/modules/category/views/AllCategory.vue')
            },
            {
                path: '/product-detail/:code',
                name: 'product-detail',
                component: () => import('@/modules/product/views/ProductDetail.vue')
            },
            {
                path: '/product/create/:code?',
                name: 'product-create',
                component: () => import('@/modules/product/views/ProductCreate.vue'),
                meta: {
                    middleware: ["auth"]
                }
            },
            {
                path: '/product/create/category/:code?',
                name: 'product-create-category',
                component: () => import('@/modules/product/views/ProductCreateSelectCategory.vue'),
                meta: {
                    middleware: ["auth"]
                }
            },
           
            {
                path: 'search/:code?',
                name: 'search',
                component: () => import('@/modules/search/views/SearchIndex.vue')
            },
            {
                path: 'SearchData/:code?',
                name: 'SearchData',
                component: () => import('@/modules/search/views/SearchData.vue')
            },
            {
                path: '/my-ads',
                name: 'my-ads',
                component: () => import('@/modules/myAccount/views/MyAds.vue'),
                meta: {
                    middleware: ["auth"]
                }
            },

            {
                path:'myAdsDetail/:code?',
                name:'myAdsDetail',
                component: () => import('@/modules/myAccount/views/MyAdsDetail.vue'),
            },

            {
                path:'editMyAds/:code?',
                name:'edit-my-ads',
                component: () => import('@/modules/myAccount/views/editMyAds.vue'),
            },
            {
                path:'editMyAdsDate/:code?',
                name:'edit-ads-date',
                component: () => import('@/modules/myAccount/views/editAdsDate.vue'),
            },
 
            
            {
                path: 'my-favorites',
                name: 'my-favorites',
                component: () => import('@/modules/myAccount/views/MyFavorites.vue'),
                meta: {
                    middleware: ["auth"]
                }
            },
            {
                path: 'my-notifications',
                name: 'my-notifications',
                component: () => import('@/modules/myAccount/views/MyNotification.vue'),
                meta: {
                    middleware: ["auth"]
                }
            },

           
            {
                path: 'how-it-works',
                name: 'how-it-works',
                component: () => import('@/modules/pages/views/HowItsWork.vue')
            },
            {
                path: 'dopings',
                name: 'dopings',
                component: () => import('@/modules/doping/views/Dopings.vue')
            },
            {
                path: 'doping/select-product',
                name: 'doping-select-product',
                component: () => import('@/modules/doping/views/DopingSelectProduct.vue')
            },
            {
                path: 'doping/select-plan/:code',
                name: 'doping-select-plan',
                component: () => import('@/modules/doping/views/DopingSelectDopingPlan.vue')
            },
            {
                path: 'doping/payment/:code',
                name: 'doping-payment',
                component: () => import('@/modules/doping/views/DopingPayment.vue')
            },
            {
                path: 'support',
                name: 'support',
                component: () => import('@/modules/pages/views/Support.vue')
            },
            {
                path: 'faq',
                name: 'faq',
                component: () => import('@/modules/pages/views/FAQ.vue')
            },
            {
                path: 'map',
                name: 'map',
                component: () => import('@/modules/pages/views/Maps.vue')
            },
            {
                path:'gizlilik-politikasi',
                name:'privacy',
                component: () => import('@/modules/pages/views/privacyPage.vue')
            },
            {
                path:'hesap-silme',
                name:'deleteAccount',
                component: () => import('@/modules/pages/views/deleteAccount.vue')
            },
            {
                path:'veri-silme',
                name:'deleteData',
                component: () => import('@/modules/pages/views/dataDelete.vue')
            },

            {
                // path: 'swap/:meProducts/:targetProducts',
                path: 'swap',
                name: 'swap',
                component: () => import('@/modules/swap/views/SwapIndex.vue'),
            },
            {
                path:'buy-product/:code',
                name:'buy-product',
                component: () => import('@/modules/swap/views/BuyProduct.vue')
            },
            {
                path: 'userDetails/:code',
                name: 'userDetails',
                component: () => import('@/modules/userProfileDetail/views/userDetail.vue')
            },
            {
                path: 'odeme_basarili',
                name: 'odeme_basarili',
                component: () => import('@/modules/paySuccess/odemeBasarili.vue')
            },
            {
                path: 'odeme_basarisiz',
                name: 'odeme_basarisiz',
                component: () => import('@/modules/paySuccess/odemeBasarisiz.vue')
            }
            
        ]
    },
    {
        path: '/login',
        name: 'login',
        component: () => import('@/modules/auth/views/Login.vue')
    },
    {
        path: '/signup',
        name: 'signup',
        component: () => import('@/modules/auth/views/Signup.vue')
    },

    {
        path: '/forgotPassword',
        name: 'forgotPassword',
        component: () => import('@/modules/auth/views/ForgotPassword.vue')
    },
    
   
   

];


const router = createRouter({
    history: createWebHistory(),
    routes
})


router.beforeEach((to, from, next) => {
    const context = {
        to,
        from,
        next,
        router
    }

    if (to?.meta?.middleware) {
        const middlewares = Array.isArray(to.meta.middleware) ? to.meta.middleware : [to.meta.middleware];

        // Auth
        if (middlewares.includes('auth')) {
            authMiddleware(context);
        }
    }

    // if (to.path === '/swap') {
    //     console.log('Açıldı');
    //   }

    // Permission
    //if (to?.meta?.permission) {
    //permissionMiddleware(context);
    //}

    next();
})

export default router;