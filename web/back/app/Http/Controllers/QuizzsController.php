<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Quizz;

class QuizzsController extends Controller
{
    public function getDemo(Request $request) {
        $demo = Quizz::inRandomOrder()
            ->limit(1)
            ->where('type', 'demo')
            ->first();
        return response()->json($demo->game);
    }

    public function getDaily(Request $request) {
        $daily = Quizz::inRandomOrder()
            ->limit(1)
            ->where('type', 'daily')
            ->where('date_creation', date('Y-m-d'))
            ->first();
        return response()->json($daily->game);
    }

    public function insertDaily($quizz) {
        
    }

    public function curl(Request $request) {
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
        
        return json_decode($response);
    }
}