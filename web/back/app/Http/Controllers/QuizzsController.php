<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Quizz;

class QuizzsController extends Controller
{
    public function getDemo(Request $request) {
        $demo = Quizz::inRandomOrder()
            ->limit(1)
            ->where('type', 'daily')
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
        return response()->json($daily->game);
    }
}