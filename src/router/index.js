import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
    routes: [
        {
            path: '/',
            redirect: '/dashboard'
        },
        {
            path: '/',
            component: resolve => require(['../components/common/Home.vue'], resolve),
            meta: { title: '自述文件' },
            children:[
                {
                    path: '/dashboard',
                    component: resolve => require(['../components/page/Dashboard.vue'], resolve),
                    meta: { title: '系统首页' }
                },
                {
                    path: '/teacherList',
                    component: resolve => require(['../components/page/TeacherList.vue'], resolve),
                    meta: { title: '教师列表' }
                },
                {
                    path: '/studentList',
                    component: resolve => require(['../components/page/StudentList.vue'], resolve),
                    meta: { title: '学生列表' }
                },
                {
                    path: '/classList',
                    component: resolve => require(['../components/page/ClassList.vue'], resolve),
                    meta: { title: '班级列表' }
                },
            ]
        },
        {
            path: '/login',
            component: resolve => require(['../components/page/Login.vue'], resolve)
        },
        {
            path: '/404',
            component: resolve => require(['../components/common/404.vue'], resolve)
        },
        {
            path: '*',
            redirect: '/404'
        }
    ]
})
