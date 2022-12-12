<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Users_quizz;
use App\Models\Quizz;

class Users_quizzsController extends Controller
{
    public function getUserQuizzs(Request $request) {
        $userQuizzs = Users_quizz::where('user_id', $request -> user_id)
        ->get();

        return response()->json($userQuizzs);
    }
}
