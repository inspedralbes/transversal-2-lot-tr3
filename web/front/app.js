//Componentes
const Questions = {
    //props:true,
    props: ['category', 'difficulty', 'type'],
    data: function() {
        return {
            quizz: null,
            correct: 0,
            time: 0,
            nQuestion: 0,
            actualQ: 0
        }
    },
    methods: {
        goNext: function(correct) {
            if (correct == true) {
                this.correct++
            }
            this.actualQ++;
            // if(this.actualQ < this.nQuestion ){
            //     this.actualQ++;
            // }else{
            //     this.quizz=null;
            // }
        }
    },
    computed: {
        isLogged() {
            return userStore().logged;
        }
    },
    mounted() {
        if (!userStore().logged) {
            // fetch a demo
            //fetch(`../back/public/demo`)
            fetch(`https://the-trivia-api.com/api/questions?limit=10`)
                // var question=new FormData();
                // question.append('id_user', userStore().loginInfo.idUser);
                // question.append('user_name', userStore().loginInfo.name);
                // fetch('../back/public/newGame',{
                //     method: "POST",
                //     body: question
                // })
                .then((response) => response.json())
                .then((data) => {
                    this.quizz = data;
                    this.nQuestion = Object.keys(this.quizz).length - 1;
                }).catch((error) => {
                    console.error('Error:', error);
                });
            console.log('fetch');
        } else if (type == 'daily') {
            //fetch a diaria
            fetch(`../back/public/daily`)
                .then((response) => response.json())
                .then((data) => {
                    this.quizz = data;
                    this.nQuestion = Object.keys(this.quizz).length - 1;
                }).catch((error) => {
                    console.error('Error:', error);
                });

        } else {
            //fetch a la api externa 
            fetch(`https://the-trivia-api.com/api/questions?categories=${this.category}&limit=10&difficulty=${this.difficulty}`)
                .then((response) => response.json())
                .then((data) => {
                    this.quizz = data;
                    this.nQuestion = Object.keys(this.quizz).length - 1;

                    var question = new FormData();
                    question.append('id_user', userStore().loginInfo.idUser);
                    question.append('user_name', userStore().loginInfo.name);
                    question.append('json', data);
                    question.append('difficulty', this.difficulty);
                    question.append('category', this.category);
                    fetch('../back/public/newGame', {
                            method: "POST",
                            body: question
                        })
                        .then((response) => response.json())
                        .then((data) => {});


                });
        }
    },
    template: `
    <b-container>
        <div v-if="this.quizz">
            <div v-for="(question,index) in this.quizz">
                <div v-show="index==actualQ">
                    <p>{{index+1}}</p>
                    <question :question_info=question @answered='goNext'></question>
                </div>
            </div>
            <div v-show="nQuestion<actualQ">
            <h1>Correctas: {{this.correct}}/{{this.nQuestion+1}}</h1>
            </div>
        </div>
    </b-container>`

}

const Index = {
    //props:true,
    props: ['category', 'difficulty'],
    data: function() {
        return {
            quizz: null
        }
    },
    methods: {

    },
    computed: {
        isLogged() {
            return userStore().logged;
        }
    },
    mounted() {},
    template: `
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

{
    /* <div class="card">
                <div class="card__pregunta">{{question_info.}}</div>
                <div class="card__respuestas respuesta">
                    <div class="respuestas_respuesta"></div>
                    <div class="respuestas_respuesta"></div>
                    <div class="respuestas_respuesta"></div>
                    <div class="respuestas_respuesta"></div>
                </div>
            </div> */
}

Vue.component('question', {
    props: ['question_info'],
    data: function() {
        return {
            answers: []
        }
    },
    methods: {
        sleep(milliseconds) {
            const date = Date.now();
            let currentDate = null;
            do {
                currentDate = Date.now();
            } while (currentDate - date < milliseconds);
        },
        validate(i) {
            console.log(this.answers[i].answer);
            answer = this.answers[i];
            let ok = false;
            if (answer.answer == this.question_info.correctAnswer) {
                answer.correct = true;
                console.log('correcto');
                ok = true;
            } else {
                answer.incorrect = true;
                console.log('incorrecto');
            }
            //this.sleep(5000)
            this.$emit('answered', ok);
        }
    },
    sendInfo: function(ok) {
        //this.$emit('answered',ok);
    },
    mounted() {
        this.question_info.incorrectAnswers.forEach(element => {
            let a = {
                correct: false,
                incorrect: false,
                answer: element
            }

            this.answers.push(a);
        });
        // this.answers.push(this.question_info.correctAnswer);
        let a = {
            correct: false,
            incorrect: false,
            answer: this.question_info.correctAnswer
        }

        this.answers.push(a);
        this.answers = this.answers.sort((a, b) => 0.5 - Math.random());

    },
    template: `
    <div class="card">
        <div class="card__question">
            <h1>{{this.question_info.question}}</h1>
        </div>
        <div class="card__answers answers">
            <div class="answers__answer" v-for="(answer,index) in this.answers">
                <button @click="validate(index)" class="answers__button" :class="{ resposta__correcte: answer.correct, resposta__incorrecte:answer.incorrect}">{{answer.answer}}</button>
            </div>
        </div>
    </div>`
        // template:`<p>{{info.Title}}</p>`

});


//Rutas
const routes = [{
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
                name: 'alessia',
                idUser: 1
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
    data: {},
    // Per a pinia
    computed: {
        ...Pinia.mapState(userStore, ['loginInfo', 'logged']),

        isLogged() {
            return userStore().logged;
        }
    },
    methods: {
        userLogged(user) {
            this.user = user;
        },
        userUnlogged() {
            this.user = null;
        },
        ...Pinia.mapActions(userStore, ['setEstado'])
    }
});