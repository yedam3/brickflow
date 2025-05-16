import AppLayout from '@/layout/AppLayout.vue';
import { createRouter, createWebHistory } from 'vue-router';
import workRoutes from './routes/work.js';
import matRoutes from './routes/mat.js';
import qualityRoutes from './routes/quality.js';
import sellerRoutes from './routes/seller.js';
import facRoutes from './routes/fac.js';
import adminRouter from './routes/admin.js';
import { useUserStore } from '@/stores/user';
import axios from 'axios';
const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            component: AppLayout,
            
            children: [
                {
                    path: '/',
                    name: 'main',
                    component: () => import('@/views/pages/MainView.vue')
                },
                ...workRoutes,
                ...matRoutes,
                ...qualityRoutes,
                ...facRoutes,
                ...sellerRoutes,
                ...adminRouter,
                
            ]
        },
        {       path: '/auth/login',
                name: 'login',
                component: () => import('@/views/pages/auth/Login.vue')
        },
        {
            path:'/error',
            name:'error',
            component : () =>import('@/views/pages/Error.vue')
        },
        // {
        //     path: '/landing',
        //     name: 'landing',
        //     component: () => import('@/views/pages/Landing.vue')
        // },
        // {
        //     path: '/pages/notfound',
        //     name: 'notfound',
        //     component: () => import('@/views/pages/NotFound.vue')
        // },

        // {
        //     path: '/auth/login',
        //     name: 'login',
        //     component: () => import('@/views/pages/auth/Login.vue')
        // },
        // {
        //     path: '/auth/access',
        //     name: 'accessDenied',
        //     component: () => import('@/views/pages/auth/Access.vue')
        // },
        // {
        //     path: '/auth/error',
        //     name: 'error',
        //     component: () => import('@/views/pages/auth/Error.vue')
        // }
    ]
    
    
});
//라우터 가드 추가 beforeEach쓰면 페이지 이동 함수가 적용
//to  사용자가 이동하려는 페이지정보
//from 사용자가 이동하기 전의 페이지 정보
//next() 다음페이지로 이동하게하는 함수 
// router.beforeEach(async (to, from, next) => {
//     const store = useUserStore();
//     //로그인 없이 접근 가능한 URL 목록을 지정한 배열
//     const publicPages = ['/auth/login','/error'];
//     // 사용자가 이동하려는 URL가  비로그인 허용된 페이지인지 확인
//     const authRequired = !publicPages.includes(to.path);
//     // 새로고침했을 때 세션으로 복구
//     if (!store.id) {

//       try {
//         const res = await axios.get('/api/session');
//         console.log(res);
//         if (res.data.isLogin) {
//           store.setUser({
//             id: res.data.id,
//             empName: res.data.empName,
//             dep: res.data.dep
//           });
//         }
//       } catch (e) {
//         console.log(e)
//       }
//     }
  
//     //로그인 하지 않았는데 접속을 할려 하면 로그인 페이지로 이동
//     if (authRequired && !store.isLogin) {
//      return next('/auth/login');
//     }
//     //부서 권한 설정
//     //startWith /admin으로 시작하는 맞으면 TRUE 아니면 FALSE
//     if (to.path.startsWith('/admin') && store.dep !== '관리자') {
//       if(store.dep !== '관리자'){
//         return next('/error');
//        }
//       }
//       if (to.path.startsWith('/mat') && store.dep !== '자재') {
//         if(store.dep !== '관리자'){
//         return next('/error');
//        }
//       }
//       if(to.path.startsWith('/work') && store.dep !== '생산'){
//         if(store.dep !== '관리자'){
//           return next('/error');
//          }
//       }
//       if(to.path.startsWith('/qual') && store.dep !== '품질'){
//         if(store.dep !== '관리자'){
//           return next('/error');
//          }
//       }
//       if(to.path.startsWith('/fac') && store.dep !== '설비'){
//         if(store.dep !== '관리자'){
//           return next('/error');
//          }
//       }
//       if(to.path.startsWith('/seller') && store.dep !== '영업'){
//         if(store.dep !== '관리자'){
//           return next('/error');
//          }
//       }
    
//       // 모든 조건 통과 시 이동
//       next();
//   });

export default router;
