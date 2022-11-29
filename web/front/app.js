//Rutas
const routes = [
    {
        path: '/',
        component: Buscador
    }, 
    {
        path: '/personal',
        component: Personal
    }, 
]

const router = new VueRouter({
    routes // short for `routes: routes`
})

//Pinia
const userStore = Pinia.defineStore('usuario', {
    state() {
        return {
            logged: false,
            loginInfo: {
                success: true,
                name: 'Nombre del almacen',
                image: '',
                idUser: ''
            }
        }
    },
    actions: {
        setEstado(i) {
            this.loginInfo = i
        }
    }
})

Vue.use(Pinia.PiniaVuePlugin);
const pinia = Pinia.createPinia();

//Bootstrap
Vue.use(BootstrapVue);

//app
var app = new Vue({
    el: '#app',
    pinia,
    router,
    data: {
    },
    // Per a pinia
    computed: {
        ...Pinia.mapState(userStore, ['loginInfo', 'logged']),

        isLogged() {
            return userStore().logged;
        }
    },
    methods:{
        userLogged(user){
            this.user=user;
        },
        userUnlogged(){
            this.user=null;
        },
        ...Pinia.mapActions(userStore, ['setEstado'])
    }
});