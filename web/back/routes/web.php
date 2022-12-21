<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\QuizzsController;
use App\Http\Controllers\FriendsController;
use App\Http\Controllers\Users_quizzsController;
use App\Http\Controllers\ChallengesController;
use App\Http\Controllers\QuestionsController;

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return view('welcome');
});

Route::get('/dashboard', function () {
    return view('dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';

Route::get('demo', [QuizzsController::class , 'getDemo']);
Route::post('daily', [QuizzsController::class , 'getDaily']);

Route::post('newGame', [QuizzsController::class , 'newGame']);
Route::post('recordGame', [QuizzsController::class , 'recordGame']);

Route::post('register', [ProfileController::class , 'register']);
Route::post('login', [ProfileController::class , 'login']);

Route::get('friends', [FriendsController::class , 'getFriends']);
Route::post('addFriend', [FriendsController::class , 'addFriend']);
Route::get('friendRequests', [FriendsController::class , 'getFriendRequests']);
Route::post('acceptFriend', [FriendsController::class , 'acceptFriend']);
Route::post('declineFriend', [FriendsController::class , 'declineFriend']);

Route::get('getRanking', [ProfileController::class , 'getRanking']);
Route::get('getDailyRanking', [ProfileController::class , 'getDailyRanking']);

Route::post('getUserQuizzs', [Users_quizzsController::class , 'getUserQuizzs']);
Route::post('getUserInfo', [ProfileController::class , 'getUserInfo']);

Route::post('newChallenge', [ChallengesController::class , 'newChallenge']);
Route::get('startChallenge', [QuizzsController::class , 'startChallenge']);
Route::post('startChallenge', [QuizzsController::class , 'startChallenge']);
Route::get('challengeCompleted', [ChallengesController::class , 'challengeCompleted']);
Route::post('updateChallenge', [ChallengesController::class , 'updateChallenge']);

Route::get('getPendingChallenges', [ChallengesController::class , 'getPendingChallenges']);
Route::get('getCompletedChallenges', [ChallengesController::class , 'getCompletedChallenges']);

Route::post('addQuestion', [QuestionsController::class , 'addQuestion']);