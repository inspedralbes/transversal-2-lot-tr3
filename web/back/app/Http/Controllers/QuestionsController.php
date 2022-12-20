<?php

namespace App\Http\Controllers;

use App\Models\Question;
use Illuminate\Http\Request;

class QuestionsController extends Controller
{
    public function addQuestion(Request $request) {
        //Check if question is already added on the table
        $questionFound = Question::where('question_id', $request -> question_id) -> count();
        
        if ($questionFound > 0) {
            //Question is already on the table
            $updateQuestion = Question::where('question_id', $request -> question_id) -> first(); 
            if ($request -> correct =='true') {
                $updateQuestion -> correct += 1;
            } 
            $updateQuestion -> all += 1;
            $updateQuestion -> save();
            $returnQuestion = $updateQuestion;

        } else {
            //First time the question is being played
            $question = new Question;
            $question -> question_id = $request -> question_id;
            if ($request -> correct =='true') {
                $question -> correct = 1;
            } else {
                $question -> correct = 0;
            }
            $question -> all = 1;
            $question -> save();
            $returnQuestion = $question;
        }

        return response()->json($returnQuestion);
    }
}