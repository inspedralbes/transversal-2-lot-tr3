<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProfileUpdateRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use App\Models\User;
use Illuminate\Support\Facades\Session;

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

        $checkUser = User::where('email', $request -> email)->count();
        if ($checkUser != 1) {
            $createUser = new User();
            $createUser -> name = $request -> name;
            $createUser -> surname = $request -> surname;
            $createUser -> email = $request -> email;
            $createUser -> password = password_hash($request -> password, PASSWORD_DEFAULT);
            $createUser -> save();
            $idUserCreated = $createUser -> id;
            Session::put('user_id', $idUserCreated);
        }

        return response()->json($idUserCreated);
    }

    public function login(Request $request) {
        $checkUser = User::where('email', $request -> email)
        ->where('password', password_hash($request -> password, PASSWORD_DEFAULT))
        ->count();

        $returnUser = "null";
        if ($checkUser == 1) {
            $userInfo = User::where('email', $request -> email)
            ->where('password', password_hash($request -> password, PASSWORD_DEFAULT))
            ->get();
            $returnUser = new User();
            $returnUser -> id = $userInfo -> id;
            $userId = $returnUser -> id;
            $returnUser -> name = $userInfo -> name;
            $returnUser -> surname = $userInfo -> surname;
            $returnUser -> email = $userInfo -> email;
            Session::put('user_id', $userId);
        }

        return response()->json($returnUser);
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
}
