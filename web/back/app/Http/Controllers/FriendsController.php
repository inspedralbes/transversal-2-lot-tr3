<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Friend;
use Illuminate\Support\Facades\Session;

use App\Models\User;

class FriendsController extends Controller
{
    public function getFriends(Request $request) {
        $user_id = Session::get('user_id');
        $friendsList = Friend::where('status', 'accepted')
            ->where('user_sent', $user_id)
            ->orwhere('user_received', $user_id)
            ->where('status', 'accepted')
            ->get();


        $list=[];
        foreach ($friendsList as $infoFriend) {
            $friend= (object) [
                'id' => -1,
                'name' => '',
            ];

            if ($infoFriend -> user_received == Session::get('user_id')) {
                $friend -> id = $infoFriend -> user_sent;
                $user = User::find($infoFriend -> user_sent);
                $friend -> name = $user -> nickname;
            } else { 
                $friend -> id = $infoFriend -> user_received;
                $user = User::find($infoFriend -> user_received);
                $friend -> name = $user -> nickname;
            }

            $list[]=$friend;
        }
        // return response()->json($friendsList);
        return response()->json($list);
    }

    public function getFriendRequests(Request $request) {
        $user_id = Session::get('user_id');
        $friendsList = Friend::where('status', 'pending')
            ->where('user_received', $user_id)
            ->get();

        $list=[];

        foreach ($friendsList as $infoFriend) {

            $user=User::find($infoFriend->user_sent);

            $friend= (object) [
                'id' => $infoFriend->id,
                'name' => $user->name,
            ];
            
            $list[]=$friend;
        }

        // return response()->json($friendsList);
        return response()->json($list);
    }

    public function addFriend(Request $request){    
        //Check if the user sending the Friend Request has a pending Friend Request with the user.
        $duplicatedRequest = Friend::where('user_sent', Session::get('user_id')) -> where('user_received', $request -> id)
        ->orwhere('user_sent', $request -> id) -> where('user_received', Session::get('user_id'))->count();

        //Check if the user is trying to add himself
        $addMyself = Friend::where('user_sent', Session::get('user_id')) -> where('user_received', Session::get('user_id'))->count(); 
        
        $response = 'ERROR';
        if ($duplicatedRequest == 0 && $addMyself == 0) {
            $friend = new Friend;
            $friend -> user_sent = Session::get('user_id');
            $friend -> user_received = $request -> id;
            $friend -> save();  
            $response = 'OK';
        }
        return response()->json($response);
    }

    public function acceptFriend(Request $request){
        $friend = Friend::find($request->id);
        $friend->status='accepted';
        $friend->save();      
        return response()->json('OK');
    }

    public function declineFriend(Request $request){
        $friend = Friend::find($request->id);
        $friend->delete();      
        return response()->json('OK');
    }
}
