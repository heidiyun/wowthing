import Vue from 'vue';
import Router from 'vue-router';
import Main from './views/main';
import Example1 from './views/example1';
import WaterWave from './views/water-wave';
import Shader from './views/shader';

Vue.use(Router);

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Main
    },
    {
      path: '/example1',
      name: 'example1',
      component: Example1
    },
    {
      path: '/water-wave',
      name: 'waterWave',
      component: WaterWave
    },
    {
      path: '/shader',
      name: 'shader',
      component: Shader
    }
  ]
});
