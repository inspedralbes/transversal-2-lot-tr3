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

        $allGames = [];
        foreach ($userQuizzs as $info) {
            $gameInfo = (object) [
                'quizz_id' => -1,
                'score' => -1,
                'time_resolution' => -1,
                'game' => '',
                'date_creation' => '',
                'name_creator' => '',
                'difficulty' => '',
                'category' => '',
                'type' => '',
            ];

            $gameInfo -> quizz_id = $info -> quizz_id;
            $gameInfo -> score = $info -> score;
            $gameInfo -> time_resolution = $info -> time_resolution;

            $quizzInfo = Quizz::where('id', $gameInfo -> quizz_id)
            ->first();

            $gameInfo -> game = json_decode($quizzInfo -> game);
            $gameInfo -> date_creation = $quizzInfo -> date_creation;
            $gameInfo -> name_creator = $quizzInfo -> name_creator;
            $gameInfo -> difficulty = $quizzInfo -> difficulty;
            $gameInfo -> category = $quizzInfo -> category;
            $gameInfo -> type = $quizzInfo -> type;

            $allGames[] = $gameInfo;
        }

        return response()->json($allGames);
    }
}
