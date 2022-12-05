<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Friend;
use Illuminate\Support\Facades\Session;

class FriendsController extends Controller
{
    public function getFriends(Request $request) {
        $user_id = Session::get('user_id');
        $friendsList = Friend::where('status', 'accepted')
            ->where('user_sent', $user_id)
            ->orwhere('user_received', $user_id)
            ->get();
        return response()->json($friendsList);
    }

    public function getFriendRequests(Request $request) {
        $user_id = Session::get('user_id');
        $friendsList = Friend::where('status', 'pending')
            ->where('user_received', $user_id)
            ->get();
        return response()->json($friendsList);
    }
}
