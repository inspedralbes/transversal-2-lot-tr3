<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Quizz;
use App\Models\Users_quizz;
use Illuminate\Support\Facades\Session;
use Illuminate\Support\Facades\DB;

class QuizzsController extends Controller
{
    public function getDemo(Request $request) {
        $demo = Quizz::inRandomOrder()
            ->limit(1)
            ->where('type', 'demo')
            ->first();
        $quizz = json_decode($demo->game);  
        return response()->json($quizz);
    }

    public function getDaily(Request $request) {
        $daily = Quizz::inRandomOrder()
            ->limit(1)
            ->where('type', 'daily')
            ->where('date_creation', date('Y-m-d'))
            ->first();
        $quizz = json_decode($daily->game); 
        return response()->json($quizz);
    }

    public function newGame(Request $request) {
        $curl = curl_init();
        curl_setopt_array($curl, array(
            CURLOPT_URL => "https://the-trivia-api.com/api/questions?limit=10",
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_TIMEOUT => 30,
            CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
            CURLOPT_CUSTOMREQUEST => "GET",
            CURLOPT_HTTPHEADER => array(
                "cache-control: no-cache"
            ),
        ));
        $response = curl_exec($curl);
        $err = curl_error($curl);
        curl_close($curl);

        $quizzInsert = new Quizz;
        $quizzInsert -> game = $response;
        $quizzInsert -> date_creation = date('Y-m-d');
        $quizzInsert -> name_creator = $request -> user_name;
        $quizzInsert -> difficulty = $request -> difficulty;
        $quizzInsert -> category = $request -> category;
        $quizzInsert -> type = 'normal';
        $quizzInsert -> save();
        $quizz_id = $quizzInsert -> id;
        $quizzInsert = json_decode($quizzInsert->game); 

        $addNewGame = new Users_quizz();
        $addNewGame -> user_id = $request -> id_user;
        $addNewGame -> quizz_id = $quizz_id;
        $addNewGame -> save();

        Session::put('quizz_id', $quizz_id);
        Session::put('user_id', $request -> id_user);
        return response()->json($quizzInsert);
    }

    public function recordGame(Request $request) {
        $quizz_id = Session::get('quizz_id');
        $user_id = Session::get('user_id');
 
        $updateGame = Users_quizz::where('user_id', $user_id)
        ->where('quizz_id', $quizz_id)->first();

        $updateGame -> score = $request -> score;
        $updateGame -> time_resolution = $request -> time_resolution;
        $updateGame -> save();

        return response()->json($updateGame);
    }
}