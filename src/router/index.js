import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import Detalle from '../views/Detalle.vue';

const routes = [
    {
        path: '/',
        name: 'Home',
        component: Home
    },
    {
        path: '/detalle/:nombre',
        name: 'Detalle',
        component: Detalle,
        props: true // permite recibir parámetros como props
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

export default router;


