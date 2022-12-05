//Componentes
const Questions = {
    params: true,
    props: ['category', 'difficulty', 'type'],
    data: function() {
        return {
            quizz: null,
            correct: 0,
            time: 10,
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
            if (this.nQuestion < this.actualQ && userStore().logged) {
                console.log('final');
                let finalScore=this.correct;
                if(userStore().configPlay.difficulty=='medium'){
                    finalScore*=2;
                }else if(userStore().configPlay.difficulty=='hard'){
                    finalScore*=5;
                }
                var score = new FormData();
                score.append('score', finalScore);
                score.append('time_resolution', this.time);

                fetch(`../back/public/recordGame`,{
                    method:'POST',
                    body:score
                })    
                .then ((response)=>response.json())
                .then((data)=>{
                    console.log(data)
                }).catch((error) => {
                    console.error('Error:', error);
                });
                console.log('fetch');
            }
        }
    },
    computed: {
        isLogged() {
            return userStore().logged;
        },
        confPlay(){
            return userStore().configPlay;
        }
    },
    mounted() {
        if (!userStore().logged) {

            // fetch a demo
            // fetch(`https://the-trivia-api.com/api/questions?limit=10`)
            fetch(`../back/public/demo`)
                .then((response) => response.json())
                .then((data) => {
                    this.quizz = data;
                    this.nQuestion = Object.keys(this.quizz).length - 1;
                }).catch((error) => {
                    console.error('Error:', error);
                });
            console.log('fetch');

        } else if (userStore().configPlay.type == 'daily') {
            
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

            var question = new FormData();
            question.append('id_user', userStore().loginInfo.idUser);
            question.append('user_name', userStore().loginInfo.name);
            question.append('difficulty', userStore().configPlay.difficulty);
            question.append('category', userStore().configPlay.category);
            // fetch(`https://the-trivia-api.com/api/questions?categories=${userStore().configPlay.category}&limit=10&difficulty=${ userStore().configPlay.difficulty}`)
            fetch(`../back/public/newGame`, {
                    method: 'POST',
                    body: question
                })
                .then((response) => response.json())
                .then((data) => {
                    this.quizz = data;
                    this.nQuestion = Object.keys(this.quizz).length - 1;
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
            category: 'film_and_tv',
            difficulty: 'easy'
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
            <div>
                <RouterLink class="wrapperIndex__routerRanking" to="/"><button class="wrapperIndex__ranking">Ranking</button></RouterLink>
                <div v-show='!isLogged'>
                    <RouterLink class="wrapperIndex__routerLogin" to="/"><button class="wrapperIndex__login">Log in</button></RouterLink>
                </div>
                <div v-show='isLogged'>
                    <RouterLink class="wrapperIndex__routerProfile" to="/"><button class="wrapperIndex__profile">Profile</button></RouterLink>
                </div>
            </div>

            <div class="center">
                <div v-if='!isLogged'>
                    <input type="text" placeholder="Introduce nickname" class="center__input">
                    <RouterLink class="center__routerPlay" to="/questions"><button class="center__play">Play</button></RouterLink>
                </div>
                <div v-else>
                    <div class="center__grid1"><input type="text" placeholder="Introduce nickname" class="center__input"></div>
                    <div class="center__grid2"><button class="center__play" id="play" onclick="gameType()">Play</button></div>
                </div>
            </div>
        
        </div>
    `

}
const Prueva = {
    params: true,
    data: function() {
        return {}
    },
    mounted() {
        console.log(this.$route.params.category);
    },
    template: `
        <div>
            <h1>{{$route.params.category}}</h1>
            <h1>{{$route.params.difficulty}}</h1>
            <h1>{{$route.params.type}}</h1>
        </div>
    `

}

Vue.component('question', {
    props: ['question_info'],
    data: function() {
        return {
            answers: [],
            answered: false
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
            if (!this.answered) {
                this.answered = true;
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
                setTimeout(() => {
                    this.$emit('answered', ok);
                }, "1000");

            }
            // this.sleep(5000)
            // this.$emit('answered', ok);
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
        component: Questions,
    },
    {
        path: `/prueva/:info/:info2`,
        component: Prueva,
        params: true,
        props: true,
        name: 'try'
    },
    {
        path: `/question/:category/:difficulty/:type`,
        component: Questions,
        params: true,
        props: true,
        name: 'quizz'
    }
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
            },
            configPlay:{
                category:'',
                difficulty:'',
                type:''
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
function alertPartida() {
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
            </div>`,
        // icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Play',
        backdrop: `
            rgba(0,0,123,0.4)
            url("/img/nyan-cat.gif")
            left top
            no-repeat`
    }).then((result) => {
        if (result.isConfirmed) {
            let selectCategory = document.getElementById("selectCategory");
            let category = selectCategory.options[selectCategory.selectedIndex].value;

            let selectDif = document.getElementById("selectDif");
            let dif = selectDif.options[selectDif.selectedIndex].value;
            // console.log(category+" "+dif);
            userStore().configPlay.category=category;
            userStore().configPlay.difficulty=dif;
            userStore().configPlay.type='new';

            router.push('/questions');
        }
    })
}

function gameType(){
    Swal.fire({
        title: 'Type of game',
        // html: ``,
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: 'New',
        denyButtonText: `Daily`,
        denyButtonColor:'#b18597',
        cancelButtonColor: '#d33',
        backdrop: `
        rgba(0,0,123,0.4)
        url("/img/nyan-cat.gif")
        left top
        no-repeat`
    }).then((result) => {
        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) {
            alertPartida();
        } else if (result.isDenied) {
            userStore().configPlay.type='daily';
            router.push('/questions');
        }
      })
}