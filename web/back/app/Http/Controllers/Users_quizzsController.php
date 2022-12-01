<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Users_quizz;
use App\Models\Quizz;

class Users_quizzsController extends Controller
{
    public function newGame(Request $request) {
        json_decode($request);
        $addQuizz = new Quizz();
        $addQuizz -> game = json_encode($request -> json);
        $addQuizz -> date_creation = date('Y-m-d');
        $addQuizz -> name_creator = $request -> user_name;
        $addQuizz -> difficulty = $request -> difficulty;
        $addQuizz -> category = $request -> category;
        $addQuizz -> type = 'normal';
        $addQuizz -> save();

        $addNewGame = new Users_quizz();
        $addNewGame -> user_id = $request -> id_user;
        $addNewGame -> quizz_id = $addQuizz -> id;
        $addNewGame -> date = date('Y-m-d');
        $addNewGame -> save();
    }
}
