//Componentes
const Template = { 
    params: true,
    data: function() {
        return {}
    },
    mounted() {},
    computed: {},
    methods: {

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
            timer: false,
            questionTime: 0
        }
    },
    methods: {
        goNext: function(correct) {
            this.questionTime = 0;
            if (correct == true) {
                this.correct++
            }
            this.actualQ++;
            if (this.nQuestion < this.actualQ) {
                this.recordGame();
            }
        },
        countTimer() {
            // console.log('timer');
            if (this.time < 150 && this.timer == true) {
                // console.log('sum');
                setTimeout(() => {
                    this.time++;
                    this.questionTime++;
                    if (this.questionTime == 15) {
                        console.log('next q');
                        this.actualQ++;
                        this.questionTime = 0;
                        if (this.nQuestion < this.actualQ) {
                            this.recordGame();
                        }
                    }
                    this.countTimer()
                }, 1000)
            }
        },
        recordGame() {
            this.timer = false;
            if (userStore().logged) {
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

                fetch(`../back/public/index.php/recordGame`, {
                        method: 'POST',
                        body: score
                    })
                    .then((response) => response.json())
                    .then((data) => {
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
            fetch(`../back/public/index.php/demo`)
                .then((response) => response.json())
                .then((data) => {
                    this.quizz = data;
                    this.nQuestion = Object.keys(this.quizz).length - 1;
                    this.timer = true;
                    this.countTimer();
                }).catch((error) => {
                    console.error('Error:', error);
                });
            console.log('fetch');

        } else if (userStore().configPlay.type == 'daily') {

            //fetch a diaria
            fetch(`../back/public/index.php/daily`)
                .then((response) => response.json())
                .then((data) => {
                    this.quizz = data;
                    this.nQuestion = Object.keys(this.quizz).length - 1;
                    this.timer = true;
                    this.countTimer();
                }).catch((error) => {
                    console.error('Error:', error);
                });

        } else {
            //fetch a la api externa 

            var question = new FormData();
            question.append('id_user', userStore().loginInfo.idUser);
            question.append('nickname', userStore().loginInfo.nickname);
            question.append('difficulty', userStore().configPlay.difficulty);
            question.append('category', userStore().configPlay.category);
            // fetch(`https://the-trivia-api.com/api/questions?categories=${userStore().configPlay.category}&limit=10&difficulty=${ userStore().configPlay.difficulty}`)
            fetch(`../back/public/index.php/newGame`, {
                    method: 'POST',
                    body: question
                })
                .then((response) => response.json())
                .then((data) => {
                    this.quizz = data;
                    this.nQuestion = Object.keys(this.quizz).length - 1;
                    this.timer = true;
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
                <RouterLink class="wrapperIndex__routerProfile" to="/"><button>Home</button></RouterLink>
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
        user() {
            return userStore().loginInfo;
        }
    },
    mounted() {},
    template: `
        <div>
            <div class="wrapper__index wrapper">
                <RouterLink class="wrapperIndex__routerRanking" to="/ranking"><button class="wrapperIndex__ranking">Ranking</button></RouterLink>
                <div v-show='!isLogged'>
                    <RouterLink class="wrapperIndex__routerLogin" to="/login"><button class="wrapperIndex__login">Log in</button></RouterLink>
                </div>
                <div v-show='isLogged'>
                    <RouterLink class="wrapperIndex__routerProfile" to="/profile"><button class="wrapperIndex__profile">Profile</button></RouterLink>
                </div>
            </div>

            <div class="center">
                <div v-if='!isLogged'>
                    <input type="text" placeholder="Introduce nickname" class="center__input">
                    <RouterLink class="center__routerPlay" to="/questions"><button class="center__play">Play</button></RouterLink>
                </div>
                <div v-else>
                    <div class="center__grid1"><p>{{user.nickname}}</p></div>
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
            name: '',
            surname: '',
            nickname: '',
            email: '',
            password: '',
            logMail: '',
            logPass: '',
            error: null,
            signIn:true


            // img:''
        }
    },
    mounted() {
        // console.log(this.$route.params.category);

        const signUpButton = document.getElementById('signUp');
        const signInButton = document.getElementById('signIn');
        const container = document.getElementById('container');

        signUpButton.addEventListener('click', () => {
            container.classList.add("right-panel-active");
            setTimeout(() => {
                this.signIn=false;
            }, "500");
            
        });

        signInButton.addEventListener('click', () => {
            container.classList.remove("right-panel-active");
            setTimeout(() => {
                this.signIn=true;
            }, "500");
        });
    },
    methods: {
        newUser() {
            var user = new FormData();
            user.append('name', this.name);
            user.append('surname', this.surname);
            user.append('nickname', this.nickname);
            user.append('email', this.email);
            user.append('password', this.password);

            fetch(`../back/public/index.php/register`, {
                    method: 'POST',
                    body: user
                })
                .then((response) => response.json())
                .then((data) => {
                    if (data != -1) {
                        userStore().logged = true;
                        userStore().loginInfo.nickname = this.nickname;
                        userStore().loginInfo.idUser = data;
                        router.push('/');
                    }
                    this.error = "Can't create the user";
                });

            // console.log('new');

        },
        logUser() {
            // console.log('login');
            var user = new FormData();
            user.append('email', this.logMail);
            user.append('password', this.logPass);

            fetch(`../back/public/index.php/login`, {
                    method: 'POST',
                    body: user
                })
                .then((response) => response.json())
                .then((data) => {
                    if (data != "null") {
                        userStore().logged = true;
                        userStore().loginInfo.nickname = data.nickname;
                        userStore().loginInfo.idUser = data.id;
                        router.push('/');
                    }
                    this.error = "Can't log in the user";
                });
        }
    },
    template: `
        <div>
        <div class="container" id="container">
        <div class="form-container sign-up-container">

                <h1>Create Account</h1>
                <br>
                <input type="text" placeholder="Name" v-model="name"/>
                <input type="text" placeholder="Surname" v-model="surname"/>
                <input type="text" placeholder="Nickname" v-model="nickname"/>
                <input type="email" placeholder="Email" v-model="email"/>
                <input type="password" placeholder="Password" v-model="password"/>
                <br>
                <button class="login" @click="newUser">Sign Up</button>

        </div>
        <div class="form-container sign-in-container" v-show="signIn">

                <h1>Sign in</h1>
                <br>
                <input type="email" placeholder="Email" v-model="logMail"/>
                <input type="password" placeholder="Password" v-model="logPass"/>
                <br>
                <button class="login" @click="logUser">Sign In</button>

        </div>
        <div class="overlay-container">
            <div class="overlay">
                <div class="overlay-panel overlay-left">
                    <h1>Log in please</h1>
                    <br>
                    <br>
                    <button class="login ghost" id="signIn">Sign In</button>
                </div>
                <div class="overlay-panel overlay-right">
                    <h1>Register please</h1>
                    <br>
                    <button class="login ghost" id="signUp">Sign Up</button>
                </div>
            </div>
        </div>
    </div>

    <div v-show="error">
        <p>{{error}}</p>
    </div>
        </div>
    `
}
        // const signUpButton = document.getElementById('signUp');
        // const signInButton = document.getElementById('signIn');
        // const container = document.getElementById('container');

        // signUpButton.addEventListener('click', () => {
        //     container.classList.add("right-panel-active");
        // });

        // signInButton.addEventListener('click', () => {
        //     container.classList.remove("right-panel-active");
        // });


const Profile = {
    data: function() {
        return {
            showStats: false,
            showAccount: false,
            showFriends: false,
            showPrivacy: false,
            friends: null,
            pendentFriends: null,
            // seeRequests:false
        }
    },
    mounted() {


        this.getFriends();
        this.getPendingRequests();


    },
    computed: {
        infoPlayer() {
            return userStore().loginInfo;
        }
    },
    methods: {
        changeView(view) {
            // this.showStats=false;
            // this.showAccount=false;
            // this.showFriends=false;
            // this.showPrivacy=false;
            if (view == 'stats') {
                this.showStats = !this.showStats;

                this.showAccount = false;
                this.showFriends = false;
                this.showPrivacy = false;
            } else if (view == 'account') {
                this.showAccount = (!this.showAccount);

                this.showStats = false;
                this.showFriends = false;
                this.showPrivacy = false;
            } else if (view == 'friends') {
                this.showFriends = !this.showFriends;

                this.showStats = false;
                this.showAccount = false;
                this.showPrivacy = false;
            } else if (view == 'privacy') {
                this.showPrivacy = !this.showPrivacy;

                this.showStats = false;
                this.showAccount = false;
                this.showFriends = false;
            }
        },
        acceptFriend(id) {

            var friendReq = new FormData();
            friendReq.append('id', id);

            fetch(`../back/public/index.php/acceptFriend`, {
                    method: 'POST',
                    body: friendReq
                })
                .then((response) => response.json())
                .then((data) => {
                    this.getPendingRequests();
                    this.getFriends();
                });

            // console.log('accept '+id);

        },
        getPendingRequests() {

            fetch(`../back/public/index.php/friendRequests`)
                .then((response) => response.json())
                .then((data) => {
                    this.pendentFriends = data;
                });

        },
        getFriends() {

            fetch(`../back/public/index.php/friends`)
                .then((response) => response.json())
                .then((data) => {
                    // console.log(data);
                    this.friends = data;
                });


        },
        declineFriend(id) {

            var friendReq = new FormData();
            friendReq.append('id', id);

            fetch(`../back/public/index.php/declineFriend`, {
                    method: 'POST',
                    body: friendReq
                })
                .then((response) => response.json())
                .then((data) => {
                    this.getPendingRequests();
                    this.getFriends();
                });

            // console.log('decline '+id);
        }
    },
    template: ` 
    <div>
        <div class="name">
            <h1>{{infoPlayer.name}}</h1>
        </div>
        <div class="lista">
            <ul>
                <li @click="changeView('stats')">Estadísticas</li>
                <li @click="changeView('account')">Mi cuenta</li>
                <li @click="changeView('friends')">Amigos</li>
                <li @click="changeView('privacy')">Terminos de privacidad</li>
            </ul>
        </div>

        <div class="info">
            <div class="info__status" v-show="showStats">
                <div class="info__tittle">
                    <h1>Stats</h1>
                </div>
                <div class="info__content">
                    <playerStats :id=infoPlayer.id></playerStats>
                </div>
            </div>

            <div class="info__account" v-show="showAccount">
                <div class="info__tittle">
                    <h1>Account</h1>
                </div>
                <div class="info__content">
                    <p>Aquí va la info de mi cuenta</p>
                </div>
            </div>

            <div class="info__friends" v-show="showFriends">
                <div>
                    <b-card no-body>
                        <b-tabs card>
                            <b-tab title="Friends" active>
                                <b-card-text>
                                    <div class="info__tittle">
                                        <h1>Friends</h1>
                                    </div>
                                    <div class="info__content">
                                        <div v-for="(friend, index) in this.friends">
                                            <p>{{friend.name}}</p>
                                        </div>
                                    </div>
                                </b-card-text>
                            </b-tab>
                            
                            <b-tab title="Friend Requests">
                                <b-card-text>
                                    <div class="info__tittle">
                                        <h1>Friends Request</h1>
                                    </div>
                                    <div class="info__content">
                                    <div v-for="(friend, index) in this.pendentFriends">
                                        <p>{{friend.name}} <i class="fa fa-check-circle" @click="acceptFriend(friend.id)"></i> <i class="fa fa-times-circle" @click="declineFriend(friend.id)"></i></p>
                                    </div>
                                    </div>
                                </b-card-text>
                            </b-tab>
                        </b-tabs>
                    </b-card>
                </div>
            </div>

            <div class="privacy" v-show="showPrivacy">
                <div class="info__tittle">
                    <h1>Privacy</h1>
                </div>
                <div class="info__content">
                    <p>Aquí van las politicas de privacidad</p>
                </div>
            </div>
        </div>
    </div>
`

}

const Ranking = { 
    data: function() {
        return {
            players:[]
        }
    },
    mounted() {
        fetch(`../back/public/index.php/getRanking`)
        .then((response) => response.json())
        .then((data) => {
           this.players=data;
        }).catch((error) => {
            console.error('Error:', error);
        });
        // this.players=[{
        //     nickname:'a',
        //     elo:6,
        // }]
    },
    computed:{
        isLogged() {
            return userStore().logged;
        },
    },
    methods: {
        addFriend(id){
            var friendReq = new FormData();
            friendReq.append('id', id);

            fetch(`../back/public/index.php/addFriend`, {
                method: 'POST',
                body: friendReq
            })
            .then((response) => response.json())
            .then((data) => {
                if(data=="ERROR"){
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: 'this user is already your friend or already has a pending request',
                      })
                }else{
                    Swal.fire({
                        icon: 'success',
                        title: 'Done',
                        text: 'Request sent, wait for your friend to accept it!',
                      })
                }
            });
        }
    },
    template: `<div>
        <div v-for="(player, index) in this.players">
            <div>{{index}} {{player.nickname}} {{player.elo}} <i v-if="isLogged" class="fa fa-times-circle" @click="addFriend(player.id)"></i></div>
        </div>
    </div>`

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
                    this.findCorrect();
                }
                setTimeout(() => {
                    this.$emit('answered', ok);
                }, "1000");

            }
            // this.sleep(5000)
            // this.$emit('answered', ok);
        },
        findCorrect() {
            this.answers.forEach(answer => {
                if (answer.answer == this.question_info.correctAnswer) {
                    answer.correct = true;
                }
            });
        }
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

Vue.component('playerStats',{
    props: ['id'],
    data: function() {
        return {}
    },
    mounted() {},
    computed:{},
    methods: {

    },
    template: ``
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
        path: '/profile',
        component: Profile,
    },
    {
        path: '/ranking',
        component: Ranking,
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
                nickname: '',
                idUser: -1
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