//Componentes
const Questions={
    props:true,
    data:function(){
        return{
            quizz:null,
            correct:0,
            time:0,
            nQuestion:0
        }
    },
    methods:{
        
    },
    computed: {
        isLogged() {
            return userStore().logged;
        }
    },
    mounted(){
        if(!userStore().logged){
            // fetch a demo
            fetch('https://the-trivia-api.com/api/questions?categories=film_and_tv&limit=10&difficulty=easy')
            .then ((response)=>response.json())
            .then((data)=>{
                this.quizz=data;
            });
            console.log('fetch');
        }else if(type=='daily'){
            //fetch a diaria
        }else{
            //fetch a la api externa 
        }
    },
    template:`
    <b-container>
        <div v-if="this.quizz">
            <question :question_info=this.quizz[this.nQuestion]></question>
        </div>
    </b-container>`

}

{/* <div class="card">
            <div class="card__pregunta">{{question_info.}}</div>
            <div class="card__respuestas respuesta">
                <div class="respuestas_respuesta"></div>
                <div class="respuestas_respuesta"></div>
                <div class="respuestas_respuesta"></div>
                <div class="respuestas_respuesta"></div>
            </div>
        </div> */}

Vue.component('question',{
    props: ['question_info'],
    methods:{
        validate(){
        },
    },
    template:`<div>
        {{question_info}}
    </div>`
    // template:`<p>{{info.Title}}</p>`
    
});


//Rutas
const routes = [
    {
        path: '/',
        component: Questions
    }, 
    {
        path: '/questions',
        component: Questions
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