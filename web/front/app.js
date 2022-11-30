//Componentes
const Questions={
    //props:true,
    props:['category','difficulty'],
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
            //fetch(`../back/public/demo`)
            fetch(`https://the-trivia-api.com/api/questions?limit=10`)
            .then ((response)=>response.json())
            .then((data)=>{
                this.quizz=data;
            }).catch((error) => {
                console.error('Error:', error);
            });
            console.log('fetch');
        }else if(type=='daily'){
            //fetch a diaria
            fetch(`../../back/daily`)
            .then ((response)=>response.json())
            .then((data)=>{
                this.quizz=data;
            }).catch((error) => {
                console.error('Error:', error);
            });
            
        }else{
            //fetch a la api externa 
            fetch(`https://the-trivia-api.com/api/questions?categories=${this.category}&limit=10&difficulty=${this.difficulty}`)
            .then ((response)=>response.json())
            .then((data)=>{
                this.quizz=data;
            });
        }
    },
    template:`
    <b-container>
        <div v-if="this.quizz">
            <question :question_info=this.quizz[this.nQuestion]></question>
        </div>
    </b-container>`

}

const Index={
    //props:true,
    props:['category','difficulty'],
    data:function(){
        return{
            quizz:null
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
    },
    template:`
        <div>
            <div class="wrapper">
                <RouterLink class="wrapper__routerRanking" to="/"><button class="wrapper__ranking">Ranking</button></RouterLink>
                <div v-show='!isLogged'>
                    <RouterLink class="wrapper__routerLogin" to="/"><button class="wrapper__login">Log in</button></RouterLink>
                </div>
                <div v-show='isLogged'>
                    <RouterLink class="wrapper__routerProfile" to="/"><button class="wrapper__profile">Profile</button></RouterLink>
                </div>
            </div>
            <div class="center">
                <div v-if='!isLogged'>
                    <input type="text" placeholder="Introduce nickname" class="center__input">
                    <RouterLink class="center__routerPlay" to="/questions"><button class="center__play">Play</button></RouterLink>
                </div>
                <div v-else>
                    <input type="text" placeholder="Introduce nickname" class="center__input">
                    <RouterLink class="center__routerPlay" to="/ruta"><button class="center__play">Play</button></RouterLink>
                </div>
            </div>
        
        </div>
    `

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
    data:function(){
        return{
            answers:[]
        }
    },
    methods:{
        validate(i){
            console.log(this.answers[i].answer);
            answer=this.answers[i];
           if(answer.answer==this.question_info.correctAnswer){
                answer.correct=true;
                console.log('correcto');
           }else{
                answer.incorrect=true;
                console.log('incorrecto');
           }
        }
    },
    mounted(){
        this.question_info.incorrectAnswers.forEach(element => {
            let a={
                correct: false, 
                incorrect: false,
                answer: element
            }
            
            this.answers.push(a);
        });
        // this.answers.push(this.question_info.correctAnswer);
        let a={
            correct: false, 
            incorrect: false,
            answer: this.question_info.correctAnswer
        }
        
        this.answers.push(a);
        this.answers=this.answers.sort((a, b) => 0.5 - Math.random());

    },
    template:`
    <div class="targeta">
        <div class="targeta__pregunta">
            <h1>{{this.question_info.question}}</h1>
        </div>
        <div class="targeta__respostes resposta"  v-for="(answer,index) in this.answers">
            <div class="respostes__resposta">
                <button @click="validate(index)" :class="{ resposta__correcte: answer.correct, resposta__incorrecte:answer.incorrect}">{{answer.answer}}</button>
            </div>
        </div>
    </div>`
    // template:`<p>{{info.Title}}</p>`
    
});


//Rutas
const routes = [
    {
        path: '/',
        component: Index
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