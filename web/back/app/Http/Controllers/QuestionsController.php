<?php

namespace App\Http\Controllers;

use App\Models\Question;
use Illuminate\Http\Request;

class QuestionsController extends Controller
{
    public function addQuestion(Request $request) {
        //todo
        $question = new Question;
        $question -> question_id = $request -> question_id;
        if ($request -> correct) {
            $question -> question_id;
        }
        $question -> save();
        return response()->json($question);
    }
}
