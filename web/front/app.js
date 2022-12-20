//Componentes
const Template = {
    params: true,
    data: function () {
        return {}
    },
    mounted() { },
    computed: {},
    methods: {

    },
    template: ``

}

const Questions = {
    params: true,
    props: [],
    data: function () {
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
        goNext: function (correct) {
            this.questionTime = 0;
            if (correct == true) {
                this.correct++
            }
            this.actualQ++;
            if (this.nQuestion < this.actualQ) {
                this.recordGame();
            }
            this.carousel();
        },
        carousel: function () {
            let buttons = document.getElementsByClassName('answers__button');


            for (const button of buttons) {
                button.addEventListener("click", function girar(event) {
                    let id = event.target.id;
                    if (id == 3) {
                        id = 0;
                    }
                    console.log(`item-${id}  y  item${id++}`);
                    document.getElementById(`item-${id++}`).click();
                });
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
                        if (userStore().configPlay.type == 'challenge') {
                            fetch(`../back/public/index.php/challengeCompleted`)
                                .then((response) => response.json())
                                .then((data) => {

                                }).catch((error) => {
                                    console.error('Error:', error);
                                });
                        }
                    }).catch((error) => {
                        console.error('Error:', error);
                    });
            }
        },
        stopTimer() {
            this.timer = false;
        },
        startTimer() {
            this.timer = true;
            this.countTimer();
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
            //The user will play the demo if he's not logged in.
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
        } else if (userStore().configPlay.type == 'daily') {
            //A logged user can play once the daily question
            var userInfo = new FormData();
            userInfo.append('id_user', userStore().loginInfo.idUser);
            fetch(`../back/public/index.php/daily`, {
                method: 'POST',
                body: userInfo
            })
                .then((response) => response.json())
                .then((data) => {
                    if (data != 'error') {
                        this.quizz = data;
                        this.nQuestion = Object.keys(this.quizz).length - 1;
                        this.timer = true;
                        this.countTimer();
                    } else {
                        Swal.fire({
                            title: 'Error',
                            icon: 'info',
                            text: 'You already play the daily game',
                            confirmButtonText: 'OK',
                            background: '#434c7a',
                            color: 'white',
                            showClass: {
                                popup: 'animate__animated animate__tada'
                            },
                            hideClass: {
                                popup: 'animate__animated animate__fadeOutDownBig'
                            }
                        }).then((result) => {
                            router.push('/');
                        })
                    }
                }).catch((error) => {
                    console.error('Error:', error);
                });
        } else if (userStore().configPlay.type == 'challenge') {
            fetch(`../back/public/index.php/startChallenge`)
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
            var question = new FormData();
            question.append('id_user', userStore().loginInfo.idUser);
            question.append('nickname', userStore().loginInfo.nickname);
            question.append('difficulty', userStore().configPlay.difficulty);
            question.append('category', userStore().configPlay.category);
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
    <div>
        <div v-if="this.quizz">
            <div v-for="(question,index) in this.quizz">
                <div v-show="index==actualQ">
                    <h1>Question {{index+1}} of 10</h1>
                    <question :question_info=question :time=questionTime @answered='goNext' @stopTimer="stopTimer" @startTimer="startTimer"></question>
                </div>
            </div>
            <div v-show="nQuestion<actualQ">
                <h1>Correct answers: {{this.correct}}/{{this.nQuestion+1}}</h1>
                <RouterLink class="wrapperIndex__routerProfile" to="/"><button class="home">Home</button></RouterLink>
            </div>
        </div>
    </div>`

}

const Index = {
    //params:true,
    // props: ['', ''],
    data: function () {
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
    mounted() { },
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
            <h1 class="indexTitle">✨THE CAT QUIZZ✨</h1>
            <div class="center">
                <div v-if='!isLogged' class="center__grid">
                    <div class="center__grid1"><input type="text" placeholder="Introduce nickname" class="center__input"></div>
                    <div class="center__grid2"><RouterLink class="center__routerPlay" to="/questions"><button class="center__play">Play</button></RouterLink></div>
                </div>
                <div v-else class="center__grid">
                    <div class="center__grid1"><p>{{user.nickname}}</p></div>
                    <div class="center__grid2"><button class="center__play" id="play" onclick="gameType()">Play</button></div>
                </div>
            </div>
        </div>
    `

}

const Prueva = {
    params: true,
    data: function () {
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

const Profile = {
    //router.push({ name: 'user', params: { username } })
    params: true,
    data: function () {
        return {
            user: {
                id: -1,
                nickname: '',
                img: 'cute_otter.jpg'
            },
            showStats: true,
            showHistory: false,
            quizzs: [],
            quizzs_ready: false
        }
    },
    mounted() {
        this.user.id = this.$route.params.id
        var userReq = new FormData();

        userReq.append('user_id', this.$route.params.id);
        fetch(`../back/public/index.php/getUserInfo`, {
            method: 'POST',
            body: userReq
        })
            .then((response) => response.json())
            .then((data) => {
                this.user.nickname = data.nickname;
                this.user.img = data.picture;
            });

        fetch(`../back/public/index.php/getUserQuizzs`, {
            method: 'POST',
            body: userReq
        })
            .then((response) => response.json())
            .then((data) => {
                this.quizzs = data;
                this.quizzs_ready = true;
            });
        // console.log(this.$route.params.id);
    },
    computed: {
        isLogged() {
            return userStore().logged;
        }
    },
    methods: {
        changeView(view) {
            if (view == 'stats') {
                this.showStats = !this.showStats;
                this.showHistory = false;

            } else if (view == 'history') {
                this.showHistory = !this.showHistory;
                this.showStats = false;
            }
        },
        challengeQuizz(quizzId) {
            var userReq = new FormData();
            userReq.append('quizz_id', quizzId);
            userReq.append('challenged_id', this.user.id);

            fetch(`../back/public/index.php/newChallenge`, {
                method: 'POST',
                body: userReq
            })
                .then((response) => response.json())
                .then((data) => {
                    if (data.status == 'pending') {
                        if (data.challengerId == userStore().loginInfo.idUser && data.challengerScore != null) {
                            Swal.fire({
                                title: 'Result',
                                background: '#434c7a',
                                color: 'white',
                                text: `You already challenged this play, wait for the other to play`,
                            })
                        } else {
                            userStore().configPlay.type = 'challenge'
                            router.push('/questions');
                        }
                    } else {
                        showResult(data);
                    }
                });
        },
        addFriend() {
            var friendReq = new FormData();
            friendReq.append('id', this.user.id);

            fetch(`../back/public/index.php/addFriend`, {
                method: 'POST',
                body: friendReq
            })
                .then((response) => response.json())
                .then((data) => {
                    if (data == "ERROR") {
                        Swal.fire({
                            color: 'white',
                            icon: 'error',
                            title: 'Error',
                            showClass: {
                                popup: 'animate__animated animate__tada'
                            },
                            hideClass: {
                                popup: 'animate__animated animate__fadeOutDownBig'
                            },
                            text: 'this user is already your friend or already has a pending request',
                        })
                    } else {
                        Swal.fire({
                            color: 'white',
                            icon: 'success',
                            title: 'Done',
                            text: 'Request sent, wait for your friend to accept it!',
                        })
                    }
                });
        },
        goHome() {
            router.push('/');
        }
    },
    template: `
    <div>
        <div class="profile">
            <div class="profile__left">
                <div class="profile__img">
                    <img :src="'IMG/profile/'+user.img" alt="">
                </div>
                <div class="profile__nickname">
                    <h1>{{user.nickname}}</h1>
                </div>
                <div class="profile__list">
                    <ul class="profile__listUl">
                        <li @click="changeView('stats')">Stats</li>
                        <li @click="changeView('history')">History</li>
                    </ul>
                    <div class="info__buttons">
                        <button style="margin: auto; padding:10px; font-size:1rem;" class="ranking__addFriend" @click="goHome">GO HOME</button>
                        <button v-if="isLogged" class="ranking__addFriend" @click="addFriend()">ADD FRIEND</button>
                    </div>
                </div>
            </div>
            <div class="profile__info info">
                <div class="info__status" v-show="showStats">
                    <div class="info__tittle">
                        <h1>Stats</h1>
                    </div>
                    <div class="info__content">
                        <playerStats :games=quizzs :ready=quizzs_ready ></playerStats>
                    </div>
                </div>

                <div class="history" v-show="showHistory">
                    <div class="info__tittle">
                        <h1>History</h1>
                    </div>
                    <div class="info__content">
                        <playerHistory :quizzs='quizzs' :challenge='true'  @challengeQuizz='challengeQuizz'></playerHistory>
                    </div>
                </div>
            </div>
        </div>
    </div>`

}


const Login = {
    params: true,
    data: function () {
        return {
            name: '',
            surname: '',
            nickname: '',
            email: '',
            password: '',
            logMail: '',
            logPass: '',
            img: 'cute_otter.jpg',
            signIn: true


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
                this.signIn = false;
            }, "300");

        });

        signInButton.addEventListener('click', () => {
            container.classList.remove("right-panel-active");
            setTimeout(() => {
                this.signIn = true;
            }, "300");
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
            user.append('picture', this.img);

            let infoOk = true;
            let msgError = "";

            if (!this.validateName(this.name)) {
                infoOk = false;
                msgError += "The name can't be empty and must be less than 15 characters <br/>"
            }

            if (!this.validateName(this.surname)) {
                infoOk = false;
                msgError += "The surname can't be empty and must be less than 15 characters <br/>"
            }

            if (!this.validateName(this.nickname)) {
                infoOk = false;
                msgError += "The nickname can't be empty and must be less than 15 characters <br/>"
            }

            if (!this.validateMail(this.email)) {
                msgError += "Invalid mail <br/>";
                infoOk = false;
            }

            if (!this.validatePassword(this.password)) {
                infoOk = false;
                msgError += "The password must be at least 8 charactes and must contain 1 Upper, 1 Lower , 1 number and not special characters";
            }

            //alert de cuando se registren con campos vacíos
            //rgex /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/
            if (!infoOk) {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops... Something went wrong :[',
                    color: 'white',
                    html: msgError,
                    background: '#434c7a',
                    buttonsStyling: 'background: linear-gradient(to right, #3d395c, #351632)',
                    showClass: {
                        popup: 'animate__animated animate__tada'
                    },
                    hideClass: {
                        popup: 'animate__animated animate__fadeOutDownBig'
                    },
                })
            } else {
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
                            userStore().loginInfo.img=this.img;

                            router.push('/');
                        } else {
                            Swal.fire({
                                icon: 'error',
                                title: 'Oops...',
                                color: 'white',
                                text: "Something went wrong :[",
                                background: '#434c7a',
                                confirmButtonColor: 'linear-gradient(to right, #3d395c, #351632)',
                                showClass: {
                                    popup: 'animate__animated animate__tada'
                                },
                                hideClass: {
                                    popup: 'animate__animated animate__fadeOutDownBig'
                                }
                            })
                        }
                    });
            }
        },
        logUser() {
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
                        userStore().loginInfo.img = data.picture;

                        router.push('/');
                    } else {
                        Swal.fire({
                            icon: 'error',
                            title: 'Oops...',
                            color: 'white',
                            text: 'Something went wrong :[',
                            background: '#434c7a',
                            confirmButtonColor: '',
                            showClass: {
                                popup: 'animate__animated animate__tada'
                            },
                            hideClass: {
                                popup: 'animate__animated animate__fadeOutDownBig'
                            }
                        })
                    }
                });
        },
        validateName(name) {
            let validation = false;

            if (name.length > 0 && name.length <= 15) {
                validation = true;
            }

            return validation;
        },
        validateMail(mail) {
            let validation = false;

            if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail)) {
                validation = true;
            }

            return validation;
        },
        validatePassword(psswd) {
            let validation = false;

            if (/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/.test(psswd)) {
                validation = true;
            }

            return validation;
        },
        goHome() {
            router.push('/');
        }
    },
    template: `
        <div>
        <button class="login__home" @click="goHome">Go home</button>
            <div class="containerLogin" id="container">
            <div class="container__form signUp">
            <div class="signUp__title"><h1>Create Account</h1></div>
                <div class="signUp__inputs">
                
                <div class="profile__selectImg">
                <input v-model="img" type="radio" id="otter" name="icon" value="cute_otter.jpg" checked="true"></input>
                <label for="otter"><img height="70px" width="70px" src="IMG/profile/cute_otter.jpg" alt="otter" :class="{img_selected: checked }"></label><br>
                    
                <input v-model="img" type="radio" id="pig" name="icon" value="cute_pig.jpg"></input>
                <label for="pig"><img height="70px" width="70px" src="IMG/profile/cute_pig.jpg" alt="pig"></label><br>

                <input v-model="img" type="radio" id="hamster" name="icon" value="cute_hamster.jpg"></input>
                <label for="hamster"><img height="70px" width="70px" src="IMG/profile/cute_hamster.jpg" alt="hamster"></label><br>
                
                <input v-model="img" type="radio" id="hedgehog" name="icon" value="cute_hedgehog.jpg"></input>
                <label for="hedgehog"><img height="70px" width="70px" src="IMG/profile/cute_hedgehog.jpg" alt="hedgehog"></label><br>
                </div>
                
                    <input type="text" placeholder="Name" v-model="name" required/>
                    <input type="text" placeholder="Surname" v-model="surname" required/>
                    <input type="text" placeholder="Nickname" v-model="nickname" required/>
                    <input type="email" placeholder="Email" v-model="email" required/>
                    <input type="password" placeholder="Password" v-model="password" required/>
                </div>
                <button class="login" @click="newUser">Sign Up</button>
                
            </div>
            <div class="container__form signIn" v-show="signIn">
                <div class="signIn__title"><h1>Sign in</h1></div>
                <div class="signIn__inputs">
                    <input type="email" placeholder="Email" v-model="logMail"/>
                    <input type="password" placeholder="Password" v-model="logPass"/>
                </div>
                <button class="login" @click="logUser">Sign In</button>
                
            </div>
            <div class="overlay-container">
                <div class="overlay">
                    <div class="overlay-panel overlay-left">
                        <h1>Log in please</h1>
                        <button class="login ghost" id="signIn">Sign In</button>
                    </div>
                    <div class="overlay-panel overlay-right">
                        <h1>Register please</h1>
                        <button class="login ghost" id="signUp">Sign Up</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
    `
}

const MyProfile = {
    data: function () {
        return {
            showStats: false,
            showAccount: false,
            showFriends: false,
            showPrivacy: false,
            showHistory: false,
            showChallenges: false,
            showChooseFriend: false,
            friends: null,
            pendentFriends: null,
            // seeRequests:false
            quizzs: null,
            pendingChallenges: [],
            completedChallenges: [],
            quizzReq: -1,
            quizzs_ready: false

        }
    },
    mounted() {
        this.getFriends();
        this.getPendingRequests();
        this.getPendingChallenges();
        this.getCompletedChallenges();

        var userReq = new FormData();
        userReq.append('user_id', userStore().loginInfo.idUser);
        fetch(`../back/public/index.php/getUserQuizzs`, {
            method: 'POST',
            body: userReq
        })
            .then((response) => response.json())
            .then((data) => {
                this.quizzs = data;
                this.quizzs_ready = true;
            });
    },
    computed: {
        infoPlayer() {
            return userStore().loginInfo;
        }
    },
    methods: {
        changeView(view) {
            this.showChooseFriend = false;
            if (view == 'stats') {
                this.showStats = !this.showStats;

                this.showAccount = false;
                this.showFriends = false;
                this.showPrivacy = false;
                this.showHistory = false;
                this.showChallenges = false;
            } else if (view == 'account') {
                this.showAccount = (!this.showAccount);

                this.showStats = false;
                this.showFriends = false;
                this.showPrivacy = false;
                this.showHistory = false;
                this.showChallenges = false;
            } else if (view == 'friends') {
                this.showFriends = !this.showFriends;

                this.showStats = false;
                this.showAccount = false;
                this.showPrivacy = false;
                this.showHistory = false;
                this.showChallenges = false;
            } else if (view == 'privacy') {
                this.showPrivacy = !this.showPrivacy;

                this.showStats = false;
                this.showAccount = false;
                this.showFriends = false;
                this.showHistory = false;
                this.showChallenges = false;
            } else if (view == 'history') {
                this.showHistory = !this.showHistory;

                this.showAccount = false;
                this.showFriends = false;
                this.showPrivacy = false;
                this.showStats = false;
                this.showChallenges = false;
            } else if (view == 'challenges') {
                this.showChallenges = !this.showChallenges;

                this.showAccount = false;
                this.showStats = false;
                this.showFriends = false;
                this.showPrivacy = false;
                this.showHistory = false;
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
        },
        logOut() {
            userStore().logged = false;
            userStore().loginInfo.nickname = '';
            userStore().loginInfo.idUser = -1;
            router.push('/');
        },
        getPendingChallenges() {
            fetch(`../back/public/index.php/getPendingChallenges`)
                .then((response) => response.json())
                .then((data) => {
                    this.pendingChallenges = data;
                });
        },
        getCompletedChallenges() {
            fetch(`../back/public/index.php/getCompletedChallenges`)
                .then((response) => response.json())
                .then((data) => {
                    this.completedChallenges = data;
                });
        },
        newChallenge(quizzId, userId) {
            var userReq = new FormData();
            userReq.append('quizz_id', quizzId);
            userReq.append('challenged_id', userId);

            fetch(`../back/public/index.php/newChallenge`, {
                method: 'POST',
                body: userReq
            })
                .then((response) => response.json())
                .then((data) => {
                    if (data.status = 'pending') {
                        Swal.fire({
                            title: 'Result',
                            background: '#434c7a',
                            color: 'white',
                            text: 'Challenge send'
                        })
                    } else {
                        Swal.fire({
                            title: 'Result',
                            background: '#434c7a',
                            color: 'white',
                            text: 'This friend already has played this match'
                        })
                    }
                    changeView('history');
                });
        },
        playChallenge(challengeId, accepted) {
            userStore().configPlay.type = 'challenge';

            var challengeInfo = new FormData();
            challengeInfo.append('challenge_id', challengeId);
            challengeInfo.append('saveChallenge', accepted);

            fetch(`../back/public/index.php/updateChallenge`, {
                method: 'POST',
                body: challengeInfo
            })
                .then((response) => response.json())
                .then((data) => {
                    if (data == 'ok') {
                        if (accepted) {
                            router.push('/questions');
                        } else {
                            this.getPendingChallenges();
                            this.getCompletedChallenges();
                        }
                    }
                });
            // router.push({ path: '/questions', props: { idChallenge: challengeId } })
        },
        seeChallenge(quizzId, userId) {
            var userReq = new FormData();
            userReq.append('quizz_id', quizzId);
            userReq.append('challenged_id', userId);

            fetch(`../back/public/index.php/newChallenge`, {
                method: 'POST',
                body: userReq
            })
                .then((response) => response.json())
                .then((data) => {
                    if (data.status == 'pending') {
                        Swal.fire({
                            background: '#434c7a',
                            color: 'white',
                            title: 'Error',
                            showClass: {
                                popup: 'animate__animated animate__tada'
                            },
                            hideClass: {
                                popup: 'animate__animated animate__fadeOutDownBig'
                            },
                            text: "There's an error with this match"
                        })
                    } else {
                        showResult(data);
                    }
                });
        },
        seeFriends(quizzId) {
            this.quizzReq = quizzId;
            this.showChooseFriend = true;
            this.showStats = false;
            this.showAccount = false;
            this.showFriends = false;
            this.showPrivacy = false;
            this.showHistory = false;
            this.showChallenges = false;
        },
        challengeFriends(idFriend) {
            var userReq = new FormData();
            userReq.append('quizz_id', this.quizzReq);
            userReq.append('challenged_id', idFriend);

            fetch(`../back/public/index.php/newChallenge`, {
                method: 'POST',
                body: userReq
            })
                .then((response) => response.json())
                .then((data) => {
                    if (data.status = 'pending') {
                        Swal.fire({
                            color: 'white',
                            title: 'Result',
                            background: '#434c7a',
                            text: 'Challenge send'
                        })
                    } else {

                        Swal.fire({
                            color: 'white',
                            title: 'Result',
                            background: '#434c7a',
                            text: 'This friend already has played this match'
                        })
                    }
                });
        },
        goHome() {
            router.push('/');
        }
    },
    template: ` 
    <div>
        <div class="profile">
            <div class="profile__left">
                <div class="profile__img">
                    <img :src="'img/profile/'+infoPlayer.img" alt="">
                </div>
                <div class="profile__nickname">
                    <h1>{{infoPlayer.nickname}}</h1>
                </div>
                <div class="profile__list">
                    <ul class="profile__listUl">
                        <li @click="changeView('stats')">Stats</li>
                        <li @click="changeView('friends')">Friends</li>
                        <li @click="changeView('history')">History</li>
                        <li @click="changeView('challenges')">challenges</li>
                    </ul>
                    <div class="info__buttons">
                        <button class="profile__home home" @click="goHome">GO HOME</button>
                        <button class="profile__logOut" @click="logOut">LOG OUT</button>
                    </div>
                </div>
            </div>
            <div class="profile__info info">
                <div class="info__status" v-show="showStats">
                    <div class="info__tittle">
                        <h1>Stats</h1>
                    </div>
                    <div class="info__content">
                        <playerStats :games=quizzs :ready=quizzs_ready ></playerStats>
                    </div>
                </div>

                <div class="info__friends" v-show="showFriends">
                    <div>
                        <b-card no-body>
                            <b-tabs pills card>
                                <b-tab title="Friends" active>
                                    <b-card-text>
                                        <div class="info__tittle">
                                            <h1>Friends</h1>
                                        </div>
                                        <div class="info__content">
                                            <div v-for="(friend, index) in this.friends" >
                                                <div class="wrapperFriends">
                                                    <RouterLink class="infoFriends__routerProfile" :to="'/profile/'+friend.id">{{friend.name}}</RouterLink>
                                                </div>
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
                                            <div class="wrapperFriends">
                                                <p>{{friend.name}} <button class="ranking__addFriend" @click="acceptFriend(friend.id)"></button> <button class="ranking__declineFriend" @click="declineFriend(friend.id)"></button></p>
                                            </div>
                                            </div>
                                        </div>
                                    </b-card-text>
                                </b-tab>
                            </b-tabs>
                        </b-card>
                    </div>
                </div>

                <div class="history" v-show="showHistory">
                    <div class="info__tittle">
                        <h1>History</h1>
                    </div>
                    <div class="info__content">
                        <playerHistory :quizzs='quizzs' :challenge='false' @challengeQuizz='seeFriends'></playerHistory>
                    </div>
                </div>

                <div class="info__challenges" v-show="showChallenges">
                    <div>
                        <b-card no-body>
                            <b-tabs pills card>
                                <b-tab title="Pending" active>
                                    <b-card-text>
                                        <div class="info__tittle">
                                            <h1>Pending Challenges</h1>
                                        </div>
                                        <div class="info__content">
                                            <div v-for="(challenge, index) in this.pendingChallenges">
                                                <div class="wrapperChallenge">
                                                    <p>{{challenge.id}} {{challenge.challenger}} VS {{challenge.challenged}} <button @click="playChallenge(challenge.id,true)">Play</button><button @click="playChallenge(challenge.id,false)">Decline</button></p>
                                                </div>
                                            </div>
                                        </div>
                                    </b-card-text>
                                </b-tab>
                            
                                <b-tab title="Completed">
                                    <b-card-text>
                                        <div class="info__tittle">
                                            <h1>Completed Challenges</h1>
                                        </div>
                                        <div class="info__content">
                                            <div v-for="(challenge, index) in this.completedChallenges">
                                            <div class="wrapperChallenge">
                                                <p>{{challenge.id}} {{challenge.challenger}} VS {{challenge.challenged}} <button @click="seeChallenge(challenge.quizz_id,challenge.challenged)">See</button></p>
                                            </div>
                                            </div>

                                        </div>
                                    </b-card-text>
                                </b-tab>

                            </b-tabs>
                        </b-card>
                    </div>
                </div>

                <div class="history" v-show="showChooseFriend">
                    <div class="info__tittle">
                        <h1>Choose a friend</h1>
                    </div>
                    <div class="info__content">
                        <div v-for="(friend, index) in this.friends">
                        <div class="wrapperChallenge">
                            <button @click="challengeFriends(friend.id)">{{friend.name}}</button>
                        </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
`

}

const Ranking = {
    data: function () {
        return {
            players: [],
            dailyRanq: [],
            viewGeneral: true
        }
    },
    mounted() {
        fetch(`../back/public/index.php/getRanking`)
            .then((response) => response.json())
            .then((data) => {
                this.players = data;
            }).catch((error) => {
                console.error('Error:', error);
            });
        fetch(`../back/public/index.php/getDailyRanking`)
            .then((response) => response.json())
            .then((data) => {
                this.dailyRanq = data;
            }).catch((error) => {
                console.error('Error:', error);
            });
    },
    computed: {
        isLogged() {
            return userStore().logged;
        },
        user() {
            return userStore().loginInfo;
        }
    },
    methods: {
        addFriend(id) {
            var friendReq = new FormData();
            friendReq.append('id', id);

            fetch(`../back/public/index.php/addFriend`, {
                method: 'POST',
                body: friendReq
            })
                .then((response) => response.json())
                .then((data) => {
                    if (data == "ERROR") {
                        Swal.fire({
                            icon: 'error',
                            title: 'Error',
                            background: '#434c7a',
                            color: 'white',
                            showClass: {
                                popup: 'animate__animated animate__tada'
                            },
                            hideClass: {
                                popup: 'animate__animated animate__fadeOutDownBig'
                            },
                            text: 'this user is already your friend or already has a pending request',
                        })
                    } else {
                        Swal.fire({
                            icon: 'success',
                            title: 'Done',
                            background: '#434c7a',
                            color: 'white',
                            text: 'Request sent, wait for your friend to accept it!',
                        })
                    }
                });
        },
        goHome() {
            router.push('/');
        }
    },

    // <i v-if="isLogged" class="fa fa-times-circle" @click="addFriend(player.id)"></i>
    template: `
    <div>
    <div class="rankingButtons">
        <button class="rankingButtons__Daily" @click="viewGeneral=!viewGeneral"><p v-if="viewGeneral">See daily</p><p v-else>See general</p></button>
        <button class="rankingButtons__Home" @click="goHome">Go home</button>
    </div>   
    <div class="ranking" v-if="viewGeneral">
            <h1 class="ranking__title">RANKING</h1>
            <div class="ranking__players">
                <div class="ranking__table">
                    <div>
                        <table >
                            <thead>
                                <tr>
                                    <th>TOP</th><th>NICKNAME</th><th>ELO</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(player, index) in this.players">
                                    <td>{{index + 1}}</td>
                                    <td>
                                        <p v-if="player.id!=user.idUser" class = "ranking__centerColumn">
                                            <RouterLink class="ranking__routerProfile" :to="'/profile/'+player.id"> {{player.nickname}} </RouterLink>
                                            <button v-if="isLogged" class="ranking__addFriend" @click="addFriend(player.id)">ADD FRIEND</button>
                                        </p>
                                        <p v-else class = "ranking__centerColumn">
                                            <RouterLink class="ranking__routerProfile" to="/profile"> {{player.nickname}}</RouterLink>
                                        </p>
                                    </td>
                                    <td>{{player.elo}}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>   
                </div>
            </div>
        </div>


        <div class="ranking" v-else>
            <h1 class="ranking__title">DAILY RANKING</h1>
            <div class="ranking__players">
                <div class="ranking__table">
                    <div>
                        <table >
                            <thead>
                                <tr>
                                    <th>TOP</th><th>NICKNAME</th><th>ELO</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(player, index) in this.dailyRanq">
                                    <td>{{index + 1}}</td>
                                    <td>
                                        <p v-if="player.id!=user.idUser" class = "ranking__centerColumn">
                                            <RouterLink class="ranking__routerProfile" :to="'/profile/'+player.id"> {{player.nickname}} </RouterLink>
                                            <button v-if="isLogged" class="ranking__addFriend" @click="addFriend(player.id)">ADD FRIEND</button>
                                        </p>
                                        <p v-else class = "ranking__centerColumn">
                                            <RouterLink class="ranking__routerProfile" to="/profile"> {{player.nickname}}</RouterLink>
                                        </p>
                                    </td>
                                    <td>{{player.score}}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>   
                </div>
            </div>
        </div> 
    </div>`
}

Vue.component('question', {
    props: ['question_info', 'time'],
    data: function () {
        return {
            answers: [],
            answered: false,
            showInfoPregunta: false,
            infoPregunta: {
                yourAnswer: false,
                persentage: 0,
                all:0
            },
            defaultClass: 'answers__button'
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
                    this.infoPregunta.yourAnswer = true;
                } else {
                    answer.incorrect = true;
                    console.log('incorrecto');
                    this.findCorrect();
                    this.infoPregunta.yourAnswer = false;
                }
                this.$emit('stopTimer');
                var infoQ = new FormData();
                infoQ.append('question_id', this.question_info.id);
                infoQ.append('correct', ok);

                fetch(`../back/public/index.php/addQuestion`, {
                    method: 'POST',
                    body: infoQ
                })
                    .then((response) => response.json())
                    .then((data) => {
                        this.infoPregunta.persentage = data.correct * 100 / data.all;
                        this.infoPregunta.all = data.all;
                        setTimeout(() => {
                            // this.$emit('stopTimer');
                            this.showInfoPregunta = true;
                        }, 1000);

                        setTimeout(() => {
                            this.showInfoPregunta = false;
                            this.$emit('startTimer');
                            this.$emit('answered', ok);
                        }, "3000");
                    });

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
    template:`
    <div>
    <div v-if="showInfoPregunta" class="cardQ">
        <p>You answered <i v-if="infoPregunta.yourAnswer">RIGHT</i> <i v-else>WRONG</i>!</p>
        <p v-if="infoPregunta.all==1"> You are the first person to answer this question</p>
        <p v-else>The {{parseFloat(infoPregunta.persentage).toFixed(2)}}% of de people answered right</p>
        <img v-if="infoPregunta.yourAnswer" src="img/happy_cat.gif" alt="Happy cat">
        <img v-else src="img/cat_peach.gif" alt="Sad cat">
    </div>
    <div v-else class="cardQ">
    <b-progress :value="15-this.time" show-value :max="15" class="mb-3"></b-progress>
        <div class="cardQ__question">
            <h1>{{this.question_info.question}}</h1>
        </div>
        <div class="cardQ__answers answers">
            <div class="answers__answer" v-for="(answer,index) in this.answers">
                <button @click="validate(index)" class="answers__button" :class="{ resposta__correcte: answer.correct, resposta__incorrecte:answer.incorrect}">{{answer.answer}}</button>
            </div>
        </div>
    </div>
</div>`

});

Vue.component('playerHistory', {
    props: ['quizzs', 'challenge'],
    data: function () {
        return {}
    },
    mounted() { },
    computed: {
        isLogged() {
            return userStore().logged;
        },
        confPlay() {
            return userStore().configPlay;
        }
    },
    methods: {},
    // v-if='challenge && confPlay.type=="normal" && isLogged'
    template: `
    <div>
        <div v-for="(quizz, index) in this.quizzs">
        <div class="wrapperHistory">
                <p>{{quizz.category}} {{quizz.difficulty}} Score:{{quizz.score}} Time:{{quizz.time_resolution}}s<div v-if="isLogged && quizz.type=='normal'"><button @click="$emit('challengeQuizz', quizz.quizz_id)">Challenge</button> </div></p>
        </div>
        </div>
    </div>
    `
});


Vue.component('playerStats', {
    props: ['games', 'ready'],
    data: function () {
        return {
            // config : {
            //     type: 'pie',
            //     data: this.dataChar,
            // },
            // dataChar : {
            //     labels: [
            //       'Hard',
            //       'Medium',
            //       'Easy'
            //     ],
            //     datasets: [{
            //       label: 'Played',
            //       data: [this.hard, this.medium, this.easy],
            //       backgroundColor: [
            //         'rgb(165, 99, 247)',
            //         'rgb(187, 134, 252)',
            //         'rgb(208, 172, 252)'
            //       ],
            //       hoverOffset: 4
            //     }]
            // },
            ctx: null
        }
    },
    watch: {
        ready(_new, _old) {
            let hard = 0;
            let medium = 0;
            let easy = 0;
            console.log("new:" + _new + " - old:" + _old);
            this.games.forEach(game => {
                if (game.difficulty == 'easy') {
                    // console.log(this.dataChar);
                    // this.data.datasets.data[2]++;
                    easy++;
                }

                if (game.difficulty == 'medium') {
                    // this.data.datasets.data[1]++;
                    medium++;
                }

                if (game.difficulty == 'hard') {
                    // this.data.datasets.data[0]++;
                    hard++;
                }
            });

            let dataChar = {
                labels: [
                    'Hard',
                    'Medium',
                    'Easy'
                ],
                datasets: [{
                    label: 'Played',
                    data: [hard, medium, easy],
                    backgroundColor: [
                        'rgb(165, 99, 247)',
                        'rgb(187, 134, 252)',
                        'rgb(208, 172, 252)'
                    ],
                    hoverOffset: 4
                }]
            }

            let config = {
                type: 'pie',
                data: dataChar,
            }


            this.ctx = document.getElementById('myChart');

            let myChart = new Chart(this.ctx, {
                type: config.type,
                data: dataChar
            });
            myChart.canvas.parentNode.style.height = '70vh';
            myChart.canvas.parentNode.style.width = '70vw';
        }
    },
    mounted() {
        // this.ctx=document.getElementById('myChart');
        // let dataChar = {
        //     labels: [
        //       'Hard',
        //       'Medium',
        //       'Easy'
        //     ],
        //     datasets: [{
        //       label: 'Played',
        //       data: [1, 2, 3],
        //       backgroundColor: [
        //         'rgb(165, 99, 247)',
        //         'rgb(187, 134, 252)',
        //         'rgb(208, 172, 252)'
        //       ],
        //       hoverOffset: 4
        //     }]
        // }

        // new Chart(this.ctx, {
        //     type: 'pie',
        //     data:dataChar
        // });
        // setTimeout(() => {
        //     this.impr();
        //     console.log(this.games);
        //     console.log(this.games, this.$refs);
        //   }, 3000);
    },
    computed: {},
    methods: {
        impr() {
            console.log(this.games);
        }
    },
    template: `<div>
        <div v-if="!ready">
            <img src="img/loadingCat.gif" alt="LOADING...">
        </div>
            <canvas id="myChart"></canvas>
        
    </div>`
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
    component: MyProfile,
},
{
    path: '/ranking',
    component: Ranking,
},
{
    path: '/profile/:id',
    component: Profile,
    params: true
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
                idUser: -1,
                img: 'cute_pig.jpg'
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
        background: '#434c7a',
        color: 'white',
        title: 'Are you sure?',
        html: `
        <div class="settings">
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
            </div>`,
        // icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Play'
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
        color: 'white',
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: 'New',
        denyButtonText: `Daily`,
        denyButtonColor: '#b18597',
        cancelButtonColor: '#d33',
        background: '#434c7a',
        color: 'white'
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

function showResult(data) {
    console.log(data);
    let htmlString = `<div>`;

    if (data.idChallenger == data.winner) {
        htmlString += `
            <div>
                <div>WINNER</div>
                <div>${data.nicknameChallenger} -> ${data.scoreChallenger}</div>
            </div>

            <div>
                <div>Nice try</div>
                <div>${data.nicknameChallenged} -> ${data.scoreChallenged}</div>
            </div>
        `;
    } else {
        htmlString += `
            <div>
                <div>Nice try</div>
                <div>${data.nicknameChallenger} -> ${data.scoreChallenger}</div>
            </div>

            <div>
                <div>WINNER</div>
                <div>${data.nicknameChallenged} -> ${data.scoreChallenged}</div>
            </div>
        `;
    }

    htmlString += `</div>`;

    Swal.fire({
        title: 'Result',
        background: '#434c7a',
        color: 'white',
        html: htmlString
    })
}