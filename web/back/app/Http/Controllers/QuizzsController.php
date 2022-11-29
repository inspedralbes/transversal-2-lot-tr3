<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Quizz;

class QuizzsController extends Controller
{
    public function getQuizzs(Request $request) {
        $quizzs = Quizz::all();
        return response()->json($quizzs);
    }
}
