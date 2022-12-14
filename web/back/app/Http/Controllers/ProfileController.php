<?php
//$2y$10$DiU94UZhbAuDxKRUdOqF2unURSM1C5KymTE975L8K9Ar6TuR7UDFS
//$2y$10$Y1nKEqtMYNU6ZIQXYtvklOx6nEdRTbKsdC6GBbFlVLw63.pVeyGYG
namespace App\Http\Controllers;

use App\Http\Requests\ProfileUpdateRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use App\Models\User;
use App\Models\Users_quizz;
use Illuminate\Support\Facades\Session;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;

class ProfileController extends Controller
{
    /**
     * Display the user's profile form.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\View\View
     */

    public function register(Request $request) {
        $idUserCreated = -1;

        $checkUser = User::where('email', $request -> email)
        ->orwhere('nickname', $request -> nickname)
        ->count();
        if ($checkUser != 1) {
            $createUser = new User();
            $createUser -> name = $request -> name;
            $createUser -> surname = $request -> surname;
            $createUser -> nickname = $request -> nickname;
            $createUser -> email = strtolower($request -> email);
            $createUser -> password = Hash::make($request->password);
            $createUser -> save();
            $idUserCreated = $createUser -> id;
            Session::put('user_id', $idUserCreated);
        }

        return response()->json($idUserCreated);
    }

    public function login(Request $request) {
        $returnUser = "null";
        $checkUser = User::where('email', strtolower($request -> email)) -> count();

        if ($checkUser == 1) {
            $userInfo = User::where('email', $request -> email) -> first();
            $dbPassword = $userInfo -> password;
            if (Hash::check($request -> password, $dbPassword)) {
                $returnUser = new User();
                $returnUser -> id = $userInfo -> id;
                $userId = $returnUser -> id;
                $returnUser -> name = $userInfo -> name;
                $returnUser -> surname = $userInfo -> surname;
                $returnUser -> nickname = $userInfo -> nickname;
                $returnUser -> email = strtolower($userInfo -> email);
                Session::put('user_id', $userId);        
            }
        }

        return response()->json($returnUser);
    }

    public function getRanking(Request $request) {
        $allUsers = User::orderBy('elo', 'DESC')
        ->get();

        $ranking = [];
        foreach ($allUsers as $infoUser) {
            $user = (object) [
                'id' => -1,
                'name' => '',
                'surname' => '',
                'elo' => -1
            ];
            $user -> id = $infoUser -> id;
            $user -> name = $infoUser -> name;
            $user -> surname = $infoUser -> surname;
            $user -> nickname = $infoUser -> nickname;
            $user -> elo = $infoUser -> elo;
            $ranking[] = $user;
        }
        return response()->json($ranking);
    }
    
    public function getDailyRanking(Request $request) {
        $allDaily = Users_quizz::where('type', 'daily')
        ->where('date_creation', date('Y-m-d'))
        ->all();

        $results = DB::table('users_quizzs')
                     ->distinct()
                     ->innerJoin('bookings', function($join)
                         {
                             $join->on('rooms.id', '=', 'bookings.room_type_id');
                             $join->on('arrival','>=',DB::raw("'2012-05-01'"));
                             $join->on('arrival','<=',DB::raw("'2012-05-10'"));
                             $join->on('departure','>=',DB::raw("'2012-05-01'"));
                             $join->on('departure','<=',DB::raw("'2012-05-10'"));
                         })
                     ->where('bookings.type', '=', 'daily')
                     ->where('users_quizzs.date_creation', date('Y-m-d'))
                     ->get();
        $ranking = [];
        foreach ($allDaily as $gameInfo) {
            $user = (object) [
                'quizz_id' => -1,
                'user_id' => -1,
                'score' => -1,
                'time_resolution' => -1,
            ];
            $user -> score = $gameInfo -> score;
            $user -> time_resolution = $gameInfo -> time_resolution;
            $ranking[] = $user;
        }
        return response()->json($ranking);
    }

    public function edit(Request $request)
    {
        return view('profile.edit', [
            'user' => $request->user(),
        ]);
    }

    /**
     * Update the user's profile information.
     *
     * @param  \App\Http\Requests\ProfileUpdateRequest  $request
     * @return \Illuminate\Http\RedirectResponse
     */

    public function update(ProfileUpdateRequest $request)
    {
        $request->user()->fill($request->validated());

        if ($request->user()->isDirty('email')) {
            $request->user()->email_verified_at = null;
        }

        $request->user()->save();

        return Redirect::route('profile.edit')->with('status', 'profile-updated');
    }

    /**
     * Delete the user's account.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function destroy(Request $request)
    {
        $request->validateWithBag('userDeletion', [
            'password' => ['required', 'current-password'],
        ]);

        $user = $request->user();

        Auth::logout();

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return Redirect::to('/');
    }

    public function getUserInfo(Request $request)
    {
        $userFound = User::where('id', $request -> user_id) -> first();

        return response()->json($userFound -> nickname);
    }
}
