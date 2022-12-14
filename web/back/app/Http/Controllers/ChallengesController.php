<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Quizz;
use App\Models\Users_quizz;
use App\Models\User;
use App\Models\Challenge;
use Error;
use Illuminate\Support\Facades\Session;

class ChallengesController extends Controller
{
    public function newChallenge(Request $request)
    {
        //Object to return the played Challenges
        $challengePlayed = (object) [
            'id' => '',
            'winner' => '',
            'idChallenger' => '',
            'nicknameChallenger' => '',
            'scoreChallenger' => '',
            'idChallenged' => '',
            'nicknameChallenged' => '',
            'scoreChallenged' => '',
            'status' => ''
        ];

        //Check if user has played that quizz already
        $quizzPlayed = Users_quizz::where('user_id', Session::get('user_id'))
        ->where('quizz_id', $request->quizz_id)
        ->count();

        //If the user has played the quizz we check if the challenge has already been played
        if ($quizzPlayed > 0) {
            $challengeCount = Challenge::where('challenger', Session::get('user_id'))->where('challenged', $request->challenged_id)->where('quizz_id', $request->quizz_id)
                ->orwhere('challenger', $request->challenged_id)->where('challenged', Session::get('user_id'))->where('quizz_id', $request->quizz_id)
                ->count();

            //If the challenge has already been created we return the data from the Challenge
            if ($challengeCount > 0) {
                $challengeFound = Challenge::where('challenger', Session::get('user_id'))->where('challenged', $request->challenged_id)->where('quizz_id', $request->quizz_id)
                    ->orwhere('challenger', $request->challenged_id)->where('challenged', Session::get('user_id'))->where('quizz_id', $request->quizz_id)
                    ->first();
                
                $challengePlayed->id = $challengeFound->id;
                $challengePlayed->idChallenger = $challengeFound->challenger;
                $challengePlayed->nicknameChallenger = User::where('id', $challengeFound->challenger)->first()->nickname;

                $challengePlayed->idChallenged = $challengeFound->challenged;
                $challengePlayed->nicknameChallenged = User::where('id', $challengeFound->challenged)->first()->nickname;

                $scoreChallenger = Users_quizz::where('user_id', $challengeFound->challenger)->where('quizz_id', $challengeFound->quizz_id)->first()->score;
                $scoreChallenged = Users_quizz::where('user_id', $challengeFound->challenged)->where('quizz_id', $challengeFound->quizz_id)->first()->score;
                
                if ($scoreChallenger != null) {
                    $challengePlayed->scoreChallenger = Users_quizz::where('user_id', $challengeFound->challenger)->where('quizz_id', $challengeFound->quizz_id)->first()->score;
                } else {
                    $challengePlayed->scoreChallenger = 0;
                }

                if ($scoreChallenged  != null) {
                    $challengePlayed->scoreChallenged = Users_quizz::where('user_id', $challengeFound->challenged)->where('quizz_id', $challengeFound->quizz_id)->first()->score;
                } else {
                    $challengePlayed->scoreChallenged = 0;
                }

                if ($scoreChallenger != null && $scoreChallenged != null) {
                    $challengeFound->status  = 'completed';
                }

                $challengePlayed->status = $challengeFound->status;

                if (($challengeFound->winner == '' || null) && $challengePlayed->status = 'completed') {
                    $scoreChallenger = Users_quizz::where('user_id', $challengeFound->challenger)->where('quizz_id', $challengeFound->quizz_id)->first()->score;
                    $scoreChallenged = Users_quizz::where('user_id', $challengeFound->challenged)->where('quizz_id', $challengeFound->quizz_id)->first()->score;

                    if ($scoreChallenger >= $scoreChallenged) {
                        $challengeFound->winner = $challengeFound->challenger;
                    } else {
                        $challengeFound->winner = $challengeFound->challenged;
                    }
                }
                $challengePlayed->winner = $challengeFound->winner;
                $challengeFound->save();

                $returnChallenge = $challengePlayed;
                error_log(json_encode($returnChallenge));
            } else {
                //If the Quizz has been played but there's no Challenge created we create it.
                $newChallenge = new Challenge;
                $newChallenge->challenger = Session::get('user_id');
                $newChallenge->challenged = $request->challenged_id;
                $newChallenge->quizz_id = $request->quizz_id;

                $scoreChallenger = Users_quizz::where('user_id', $newChallenge->challenger)->where('quizz_id', $newChallenge->quizz_id)->first()->score;
                
                $challengedFound = Users_quizz::where('user_id', $newChallenge->challenged)->where('quizz_id', $newChallenge->quizz_id)->count();
                
                if ($scoreChallenger != null) {
                    $challengePlayed->scoreChallenger = $scoreChallenger;
                } else {
                    $challengePlayed->scoreChallenger = 0;
                }

                if ($challengedFound > 0) {
                    $scoreChallenged = Users_quizz::where('user_id', $newChallenge->challenged)->where('quizz_id', $newChallenge->quizz_id)->first()->score;
                    $challengePlayed->scoreChallenged = $scoreChallenged;
                }

                if ($scoreChallenger != null && $challengedFound > 0) {
                    $newChallenge->status = 'completed';
                    if ($scoreChallenger >= $scoreChallenged) {
                        $newChallenge->winner = $newChallenge->challenger;
                    } else {
                        $newChallenge->winner = $newChallenge->challenged;
                    }
                }

                $newChallenge->save();
                Session::put('challenge_id', $newChallenge->id);

                //After saving the challenge we save the atributs we want to respond to the fetch.
                $challengePlayed->id = Session::get('challenge_id');
                $challengePlayed->winner = $newChallenge->winner;

                $challengePlayed->idChallenger = $newChallenge->challenger;
                $challengePlayed->nicknameChallenger = User::where('id', $newChallenge->challenger)->first()->nickname;

                $challengePlayed->idChallenged = $newChallenge->challenged;
                $challengePlayed->nicknameChallenged = User::where('id', $newChallenge->challenged)->first()->nickname;

                $challengePlayed->status = $newChallenge->status;

                $returnChallenge = $challengePlayed;
            }
        } else {
            //If the user hasn't played the Quizz we will respond with the JSON of the Quizz later on,
            //Create an empty Challenge.
            $challengeCount = Challenge::where('challenger', Session::get('user_id'))->where('challenged', $request->challenged_id)->where('quizz_id', $request->quizz_id)
            ->orwhere('challenger', $request->challenged_id)->where('challenged', Session::get('user_id'))->where('quizz_id', $request->quizz_id)
            ->count();

            if ($challengeCount > 0) {
                //Challenge exists because the other player has created it.
                $challengeFound = Challenge::where('challenger', Session::get('user_id'))->where('challenged', $request->challenged_id)->where('quizz_id', $request->quizz_id)
                ->orwhere('challenger', $request->challenged_id)->where('challenged', Session::get('user_id'))->where('quizz_id', $request->quizz_id)
                ->first();
                $challengePlayed -> id = $challengeFound ->id ;
                $challengePlayed -> winner = '';
                $challengePlayed -> idChallenger = $request->challenged_id;
                $challengePlayed -> nicknameChallenger = User::where('id', $challengeFound->challenger)->first()->nickname;
                $challengePlayed -> scoreChallenger = Users_quizz::where('user_id', $challengeFound->challenger)->where('quizz_id', $challengeFound->quizz_id)->first()->score;
                $challengePlayed -> idChallenged = Session::get('user_id');
                $challengePlayed -> nicknameChallenged = User::where('id', Session::get('user_id'))->first()->nickname;
                $challengePlayed -> scoreChallenged = -1;
                $challengePlayed -> status = 'pending';     
                $returnChallenge = $challengePlayed;
            } else {
                $newChallenge = new Challenge;
                $newChallenge->challenger = Session::get('user_id');
                $newChallenge->challenged = $request->challenged_id;
                $newChallenge->quizz_id = $request->quizz_id;
                $newChallenge->status = 'pending';
                $newChallenge->save();
                Session::put('challenge_id', $newChallenge->id);

                $challengePlayed->id = Session::get('challenge_id');
                $challengePlayed->winner = '';
                $challengePlayed->idChallenger = $newChallenge->challenger;
                $challengePlayed->nicknameChallenger = User::where('id', $newChallenge->challenger)->first()->nickname;
                $challengePlayed->scoreChallenger = -1;

                $challengePlayed->idChallenged = $newChallenge->challenged;
                $challengePlayed->nicknameChallenged = User::where('id', $newChallenge->challenged)->first()->nickname;
                $challengePlayed->scoreChallenged = Users_quizz::where('user_id', $newChallenge->challenged)->where('quizz_id', $newChallenge->quizz_id)->first()->score;
                $challengePlayed->status = $newChallenge->status;
                $returnChallenge = $challengePlayed;
            }
        }

        return response()->json($returnChallenge);
    }

    public function challengeCompleted(Request $request)
    {
        $challenge = Challenge::find(Session::get('challenge_id'));

        $scoreChallenger = Users_quizz::where('user_id', $challenge->challenger)->where('quizz_id', $challenge->quizz_id)->first()->score;
        $scoreChallenged = Users_quizz::where('user_id', $challenge->challenged)->where('quizz_id', $challenge->quizz_id)->first()->score;

        if ($scoreChallenger >= $scoreChallenged) {
            $challenge->winner = $challenge->challenger;
        } else {
            $challenge->winner = $challenge->challenged;
        }

        $challenge->status = 'completed';
        $challenge->save();

        return response()->json('OK');
    }

    public function getPendingChallenges(Request $request)
    {
        $getChallenges = Challenge::where('challenged', Session::get('user_id'))
            ->where('status', 'pending')
            ->get();

        return response()->json($getChallenges);
    }

    public function getCompletedChallenges(Request $request)
    {
        $getChallenges = Challenge::where('challenged', Session::get('user_id'))->orwhere('challenger', Session::get('user_id'))
            ->where('status', 'completed')
            ->get();

        return response()->json($getChallenges);
    }

    public function updateChallenge(Request $request)
    {
        if ($request -> saveChallenge == "true") {
            Session::put('challenge_id', $request -> challenge_id);
            $updateChallenge = Challenge::find($request -> challenge_id);
            $updateChallenge -> status = 'completed';
            $updateChallenge -> save();
        } else {
            $updateChallenge = Challenge::find($request -> challenge_id);
            $updateChallenge -> status = 'declined';
            $updateChallenge -> save();
        }

        return response()->json('ok');
    }
}