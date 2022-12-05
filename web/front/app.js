//Componentes
const Template = {
    params: true,
    data: function() {
        return {
        }
    },
    mounted() {
    },
    methods:{
    
    },
    template: ``

}

const Questions = {
    params: true,
    props: ['category', 'difficulty', 'type'],
    data: function() {
        return {
            quizz: null,
            correct: 0,
            time: 0,
            nQuestion: 0,
            actualQ: 0,
            timer:false,
            questionTime:0
        }
    },
    methods: {
        goNext: function(correct) {
            this.questionTime=0;
            if (correct == true) {
                this.correct++
            }
            this.actualQ++;
            if (this.nQuestion < this.actualQ) {
                this.recordGame();
            }
        },
        countTimer () {
            // console.log('timer');
            if (this.time < 150 && this.timer == true) {
                // console.log('sum');
                setTimeout(() => {
                    this.time++;
                    this.questionTime++;
                    if(this.questionTime==15){
                        console.log('next q');
                        this.actualQ++;
                        this.questionTime=0;
                        if (this.nQuestion < this.actualQ) {
                            this.recordGame();
                        }
                    }
                    this.countTimer()
                }, 1000)
            }
        },
        recordGame(){
            this.timer=false;
            if(userStore().logged){
                console.log('final');
                let finalScore = this.correct;
                if (userStore().configPlay.difficulty == 'medium') {
                    finalScore *= 2;
                } else if (userStore().configPlay.difficulty == 'hard') {
                    finalScore *= 5;
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
                // console.log('fetch');
            }
        }
    },
    computed: {
        isLogged() {
            return userStore().logged;
        },
        confPlay() {
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
                    this.timer=true;
                    this.countTimer();
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
                    this.timer=true;
                    this.countTimer();
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
            //fetch(`https://the-trivia-api.com/api/questions?categories=${userStore().configPlay.category}&limit=10&difficulty=${ userStore().configPlay.difficulty}`)
            fetch(`../back/public/newGame`, {
                    method: 'POST',
                    body: question
                })
                .then((response) => response.json())
                .then((data) => {
                    this.quizz = data;
                    this.nQuestion = Object.keys(this.quizz).length - 1;
                    this.timer=true;
                    this.countTimer();
                });
        }
    },
    template: `
    <b-container>
        <div v-if="this.quizz">
            <div v-for="(question,index) in this.quizz">
                <div v-show="index==actualQ">
                    <p>{{index+1}}</p>
                    <p>Time:{{time}}</p>
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
        },
        user(){
            return userStore().loginInfo;
        }
    },
    mounted() {},
    template: `
        <div>
            <div class="wrapper__index wrapper">
                <RouterLink class="wrapperIndex__routerRanking" to="/"><button class="wrapperIndex__ranking">Ranking</button></RouterLink>
                <div v-show='!isLogged'>
                    <RouterLink class="wrapperIndex__routerLogin" to="/login"><button class="wrapperIndex__login">Log in</button></RouterLink>
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
                    <div class="center__grid1"><p>{{user.name}}</p></div>
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

const Login = {
    params: true,
    data: function() {
        return {
            name:'',
            surname:'',
            email:'',
            password:'',
            logMail:'',
            logPass:'',
            error:null

            // img:''
        }
    },
    mounted() {
        // console.log(this.$route.params.category);
    },
    methods:{
        newUser(){            
            var user = new FormData();
            user.append('name', this.name);
            user.append('surname', this.surname);
            user.append('email', this.email);
            user.append('password', this.password);

            fetch(`../back/public/register`, {
                    method: 'POST',
                    body: user
                })
            .then((response) => response.json())
            .then((data) => {
                if(data!=-1){
                    userStore().logged=true;
                    userStore().loginInfo.name=this.name;
                    userStore().loginInfo.idUser=data;
                    router.push('/');
                }
                this.error="Can't create the user";
            });

        },
        logUser(){
            var user = new FormData();
            user.append('email', this.logMail);
            user.append('password', this.logPass);

            fetch(`../back/public/login`, {
                method: 'POST',
                body: user
            })
            .then((response) => response.json())
            .then((data) => {
                if(data != "null"){
                    userStore().logged=true;
                    userStore().loginInfo.name=data.name;
                    userStore().loginInfo.idUser=data.id;
                    router.push('/');
                }
                this.error="Can't log in the user";
            });
        }
    },
    template: `
        <div>
            <!-- inicio sesion -->
                <ul>
                    <li>
                        <label for="email">e-mail:</label>
                        <input type="email" id="email" name="user_e-mail" required placeholder="Introduce e-mail" v-model="logMail">
                    </li>
                    <li>
                        <label for="password">Password:</label>
                        <input type="password" id="password" name="user_passwd" required placeholder="Introduce password" v-model="logPass">
                    </li>
                </ul>
                <button @click="logUser">Log in</button>
            <!-- registre -->
                <ul>
                    <li>
                        <label for="name">Name:</label>
                        <input type="text" id="name" name="user_name" required placeholder="Introduce name" v-model="name">
                    </li>
                    <li>
                        <label for="mail">Surname:</label>
                        <input type="text" id="mail" name="user_surname" required placeholder="Introduce surname" v-model="surname">
                    </li>
                    <li>
                        <label for="mail">e-mail:</label>
                        <input type="email" id="mail" name="user_mail" required placeholder="Introduce e-mail" v-model="email">
                    </li>
                    <li>
                        <label for="mail">Password:</label>
                        <input type="password" id="mail" name="user_passwd" required placeholder="Introduce password" v-model="password">
                    </li>
                    <button @click="newUser">Register</button>
                </ul>
                <div v-show="error">
                    <p>{{error}}<p>
                </div>
        </div>
    `

}

const Porfile = {
    data: function() {
        return {
        }
    },
    mounted() {
    },
    methods:{
    
    },
    template: ``

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
        path: '/login',
        component: Login,
    },
    {
        path: '/porfile',
        component: Porfile,
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
            },
            configPlay: {
                category: '',
                difficulty: '',
                type: ''
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
            userStore().configPlay.category = category;
            userStore().configPlay.difficulty = dif;
            userStore().configPlay.type = 'new';

            router.push('/questions');
        }
    })
}

function gameType() {
    Swal.fire({
        title: 'Type of game',
        // html: ``,
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: 'New',
        denyButtonText: `Daily`,
        denyButtonColor: '#b18597',
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
            userStore().configPlay.type = 'daily';
            router.push('/questions');
        }
    })
}