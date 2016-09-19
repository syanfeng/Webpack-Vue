// 引入vue以及vue-router
import Vue from "vue";
import VueRouter from "vue-router";
import VueResource from "vue-resource";

Vue.use(VueResource);
Vue.use(VueRouter);
// 引入组件！直接使用es6的语法
import alternateRegistration from './components/alternateRegistration.vue';
import involuntaryUpgrade from './components/involuntaryUpgrade.vue';
import volunteerSelect from './components/volunteerSelect.vue';
import passengerList from './components/passengerList.vue';
import waitingToInform from './components/waitingToInform.vue';
import workbench from './components/workbench.vue';
import login from './components/login.vue';
import report from './components/report.vue';
//开启debug模式
Vue.config.debug = true;
// 路由器需要一个根组件。
var App = Vue.extend({});
// 创建一个路由器实例
var router = new VueRouter({
    history: false
});
// 每条路由规则应该映射到一个组件。这里的“组件”可以是一个使用 Vue.extend创建的组件构造函数，也可以是一个组件选项对象。
router.map({//定义路由映射
    '/index':{//访问地址
        name:'index',//定义路由的名字。方便使用。
        component:workbench//引用的组件名称，对应上面使用`import`导入的组件
    },
    '/bench': {
        name:'workbench',
        component: workbench
    },
    '/registration': {
      name:'registration',
      component: alternateRegistration
    },
    '/list': {
        name:'list',
        component: passengerList
    },
    '/upgrade': {
      name:'upgrade',
      component: involuntaryUpgrade
    },
    '/volunteer': {
      name:'volunteer',
      component: volunteerSelect
    },
    '/inform': {
      name:'inform',
      component: waitingToInform
    },
    '/login': {
      name:'login',
      component: login
    },
    '/report': {
        name: 'report',
        component: report
    }

});
router.redirect({//定义全局的重定向规则。全局的重定向会在匹配当前路径之前执行。
  '*':"/bench"//重定向任意未匹配路径到/index
});
// Vue.http.options.root = 'http://172.20.41.45:8080/guics/Flight';
Vue.http.options.root = process.env.NODE_ENV === 'development' ? 'http://172.20.41.45:8080/guics' : '/guics';
Vue.http.options.emulateJSON = true;
// 现在我们可以启动应用
// 路由器会创建一个 App 实例，并且挂载到选择符 #app 匹配的元素上。
router.start(App, '#app');
