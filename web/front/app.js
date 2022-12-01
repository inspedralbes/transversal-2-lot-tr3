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
            var question=new FormData();
            question.append('id_user', userStore().loginInfo.idUser);
            question.append('user_name', userStore().loginInfo.name);
            // fetch a demo
            //fetch(`../back/public/demo`)
            fetch(`https://the-trivia-api.com/api/questions?limit=10`)
            // fetch('../back/public/newGame',{
            //     method: "POST",
            //     body: question
            // })
            .then ((response)=>response.json())
            .then((data)=>{
                this.quizz=data;
                this.nQuestion=Object.keys(this.quizz).length-1;
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
    //params:true,
    // props: ['', ''],
    data: function() {
        return {
            quizz: null,
            category:'film_and_tv',
            difficulty:'easy'
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
                    <button class="center__play" onclick="alertPartida()">Play</button>
                </div>
            </div>
        
        </div>
    `

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
                <button @click="validate(index)" id="answers__button" :class="{ resposta__correcte: answer.correct, resposta__incorrecte:answer.incorrect}">{{answer.answer}}</button>
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
            logged: true,
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


// Alerts

// import Swal from 'sweetalert2/dist/sweetalert2.js';

// import 'sweetalert2/src/sweetalert2.scss';
function alertPartida(){
    Swal.fire({
        title: 'Are you sure?',
        html: `
        <div class="category">
                <div class="selectCat">
                    <select name="select" id="selectCategory">
                        <option value="arts_and_literature">Arts & Literature</option>
                        <option value="film_and_tv">Film & TV</option>
                        <option value="food_and_drink">Food & Drink</option>
                        <option value="general_knowledge">General Knowledge</option>
                        <option value="geography">Geography</option>
                        <option value="history">History</option>
                        <option value="music">Music</option>
                        <option value="science">Science</option>
                        <option value="society_and_culture">Society & Culture</option>
                        <option value="sport_and_leisure">Sport & Leisure</option>
                    </select>
                </div>
            </div>

            <div class="difficulty">
                <div class="selectDif">
                    <select name="select" id="selectDif">
                        <option value="easy">Easy</option>
                        <option value="medium">Medium</option>
                        <option value="hard">Hard</option>
                    </select>
                </div>
            </div>
            <RouterLink class="routerPlay" :to="{ path: '/ruta', params: {}"><button class="play">Play</button></RouterLink>`,
        // icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!',
        backdrop: `
            rgba(0,0,123,0.4)
            url("/images/nyan-cat.gif")
            left top
            no-repeat`
    }).then((result) => {
        if (result.isConfirmed) {
            let selectCategory=document.getElementById("selectCategory");
            let category=selectCategory.options[selectCategory.selectedIndex].value;

            let selectDif=document.getElementById("selectDif");
            let dif=selectDif.options[selectDif.selectedIndex].value;
            console.log(category+" "+dif);
            // this.$router.push({ path: 'home' })
        }
    })
}
