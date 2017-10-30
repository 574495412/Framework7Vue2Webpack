export default [{
        path: '/Chat/:userId/:groupId',
        component: require('../components/about.vue')
    },
    {
        path: '/language/',
        component: require('../components/language.vue')
    },
    {
        path: '/feedback/',
        component: require('../components/feedback.vue')
    },
    {
        path: '/groupChat/:groupId/:title',
        component: require('../app.vue')
    },
    {
        path: '/groupChat/:groupId/:title/:uid',
        component: require('../components/Chat.vue')
    }
]
// import Vue from 'vue'
// import VueRouter from 'vue-router'

// Vue.use(VueRouter)

// const router = new VueRouter({
//     mode: 'history',
//     routes: [{
//             path: '/groupChat/:groupId/:title',
//             component: () => asyncLoad(
//                 import ('../app.vue'))
//         },
//         {
//             path: '/Chat/:userId/:groupId',
//             component: () => asyncLoad(
//                 import ('../components/about.vue'))
//         }
//     ]
// })

// export default router

// import { showIndicator, hideIndicator } from 'framework7-vue'

// function asyncLoad(promise) {
//     showIndicator()
//     return promise.then(cpt => {
//         hideIndicator()
//         return cpt
//     }, err => {
//         hideIndicator()
//         alert('Network error when load page.')
//         return Promise.reject(err)
//     })
// }