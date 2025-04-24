<script setup>
import { ref } from 'vue';

import AppMenuItem from './AppMenuItem.vue';

const model = ref([
    {
        label: 'Home',
        items: [{ label: 'Dashboard', icon: 'pi pi-fw pi-home', to: '/' }]
    },
    {
        label: 'Pages',
        icon: 'pi pi-fw pi-briefcase',
        to: '/pages',
        items: [
        {
                label: '영업관리',
                icon: 'pi pi-fw pi-tag',
                items: [
                    {
                        label: '주문관리',
                        icon: 'pi pi-fw pi-sign-in',
                        to: '/sales/saleorder'
                    },
                    {
                        label: '출/입고 관리',
                        icon: 'pi pi-fw pi-times-circle',
                        to: '/'
                    },
                    {
                        label: '매출 관리',
                        icon: 'pi pi-fw pi-lock',
                        to: '/'
                    },
                    {
                        label: '반품관리',
                        icon: 'pi pi-fw pi-sign-in',
                        to: '/'
                    },
                ]
            },
            {
                label: '생산관리',
                icon: 'pi pi-fw pi-tag',
                items: [
                    {
                        label: '생산 계획 관리',
                        icon: 'pi pi-fw pi-clipboard',
                        to: '/work/schedule'
                    },
                    {
                        label: '생산 계획 조회',
                        icon: 'pi pi-fw pi-list-check',
                        to: '/work/dispatch'
                    },
                    {
                        label: '생산 지시 관리',
                        icon: 'pi pi-fw pi-check',
                        to: '/work/order'
                    },
                    {
                        label: '공정 진행 관리',
                        icon: 'pi pi-fw pi-cog',
                        to: '/work/process'
                    },
                    {
                        label: '생산 전표 관리',
                        icon: 'pi pi-fw pi-barcode',
                        to: '/work/report'
                    }
                ]
            },
            {
                label: '자재관리',
                icon: 'pi pi-fw pi-tag',
                items: [
                    {
                        label: 'Login',
                        icon: 'pi pi-fw pi-sign-in',
                        to: '/'
                    },
                    {
                        label: 'Error',
                        icon: 'pi pi-fw pi-times-circle',
                        to: '/'
                    },
                    {
                        label: 'Access Denied',
                        icon: 'pi pi-fw pi-lock',
                        to: '/'
                    }
                ]
            },
            {
                label: '설비관리',
                icon: 'pi pi-fw pi-tag',
                items: [
                    {
                        label: '설비 정보 등록',
                        icon: 'pi pi-fw pi-sign-in',
                        to: '/'
                    },
                    {
                        label: '설비 상태 확인',
                        icon: 'pi pi-fw pi-times-circle',
                        to: '/'
                    },
                    {
                        label: '비가동 설비 관리',
                        icon: 'pi pi-fw pi-lock',
                        to: '/'
                    },
                    {
                        label: '설비 수리 관리',
                        icon: 'pi pi-fw pi-sign-in',
                        to: '/'
                    },
                    {
                        label: '설비 통계 관리',
                        icon: 'pi pi-fw pi-sign-in',
                        to: '/'
                    },
                    {
                        label: '설비 점검 관리',
                        icon: 'pi pi-fw pi-sign-in',
                        to: '/'
                    },
                ]
            },
            {
                label: '품질관리',
                icon: 'pi pi-fw pi-tag',
                items: [
                    {
                        label: '자재 검수',
                        icon: 'pi pi-fw pi-sign-in',
                        to: '/'
                    },
                    {
                        label: '제품 검수',
                        icon: 'pi pi-fw pi-times-circle',
                        to: '/'
                    },
                    {
                        label: 'BOM 관리',
                        icon: 'pi pi-fw pi-lock',
                        to: '/'
                    },
                    {
                        label: '공정 흐름도 관리',
                        icon: 'pi pi-fw pi-sign-in',
                        to: '/'
                    },
                    {
                        label: '사원 관리',
                        icon: 'pi pi-fw pi-sign-in',
                        to: '/'
                    },
                ]
            },
        ]
    },
    {
        // label: 'UI Components',
        // items: [
        //     { label: 'Form Layout', icon: 'pi pi-fw pi-id-card', to: '/uikit/formlayout' },
        //     { label: 'Input', icon: 'pi pi-fw pi-check-square', to: '/uikit/input' },
        //     { label: 'Button', icon: 'pi pi-fw pi-mobile', to: '/uikit/button', class: 'rotated-icon' },
        //     { label: 'Table', icon: 'pi pi-fw pi-table', to: '/uikit/table' },
        //     { label: 'List', icon: 'pi pi-fw pi-list', to: '/uikit/list' },
        //     { label: 'Tree', icon: 'pi pi-fw pi-share-alt', to: '/uikit/tree' },
        //     { label: 'Panel', icon: 'pi pi-fw pi-tablet', to: '/uikit/panel' },
        //     { label: 'Overlay', icon: 'pi pi-fw pi-clone', to: '/uikit/overlay' },
        //     { label: 'Media', icon: 'pi pi-fw pi-image', to: '/uikit/media' },
        //     { label: 'Menu', icon: 'pi pi-fw pi-bars', to: '/uikit/menu' },
        //     { label: 'Message', icon: 'pi pi-fw pi-comment', to: '/uikit/message' },
        //     { label: 'File', icon: 'pi pi-fw pi-file', to: '/uikit/file' },
        //     { label: 'Chart', icon: 'pi pi-fw pi-chart-bar', to: '/uikit/charts' },
        //     { label: 'Timeline', icon: 'pi pi-fw pi-calendar', to: '/uikit/timeline' },
        //     { label: 'Misc', icon: 'pi pi-fw pi-circle', to: '/uikit/misc' }
        // ]
    },
    {
        // label: 'Hierarchy',
        // items: [
        //     {
        //         label: 'Submenu 1',
        //         icon: 'pi pi-fw pi-bookmark',
        //         items: [
        //             {
        //                 label: 'Submenu 1.1',
        //                 icon: 'pi pi-fw pi-bookmark',
        //                 items: [
        //                     { label: 'Submenu 1.1.1', icon: 'pi pi-fw pi-bookmark' },
        //                     { label: 'Submenu 1.1.2', icon: 'pi pi-fw pi-bookmark' },
        //                     { label: 'Submenu 1.1.3', icon: 'pi pi-fw pi-bookmark' }
        //                 ]
        //             },
        //             {
        //                 label: 'Submenu 1.2',
        //                 icon: 'pi pi-fw pi-bookmark',
        //                 items: [{ label: 'Submenu 1.2.1', icon: 'pi pi-fw pi-bookmark' }]
        //             }
        //         ]
        //     },
        //     {
        //         label: 'Submenu 2',
        //         icon: 'pi pi-fw pi-bookmark',
        //         items: [
        //             {
        //                 label: 'Submenu 2.1',
        //                 icon: 'pi pi-fw pi-bookmark',
        //                 items: [
        //                     { label: 'Submenu 2.1.1', icon: 'pi pi-fw pi-bookmark' },
        //                     { label: 'Submenu 2.1.2', icon: 'pi pi-fw pi-bookmark' }
        //                 ]
        //             },
        //             {
        //                 label: 'Submenu 2.2',
        //                 icon: 'pi pi-fw pi-bookmark',
        //                 items: [{ label: 'Submenu 2.2.1', icon: 'pi pi-fw pi-bookmark' }]
        //             }
        //         ]
        //     }
        // ]
    },
    {
        // label: 'Get Started',
        // items: [
        //     // {
        //     //     label: 'Documentation',
        //     //     icon: 'pi pi-fw pi-book',
        //     //     to: '/documentation'
        //     // },
        //     {
        //         label: 'View Source',
        //         icon: 'pi pi-fw pi-github',
        //         url: 'https://github.com/primefaces/sakai-vue',
        //         target: '_blank'
        //     }
        // ]
    }
]);
</script>

<template>
    <ul class="layout-menu">
        <template v-for="(item, i) in model" :key="item">
            <app-menu-item v-if="!item.separator" :item="item" :index="i"></app-menu-item>
            <li v-if="item.separator" class="menu-separator"></li>
        </template>
    </ul>
</template>

<style lang="scss" scoped></style>
