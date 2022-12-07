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
            $friend->id=$infoFriend->id;
            if($infoFriend->user_sent ==$user_id){
                $user=User::find($infoFriend->user_received);
                $friend->name=$user->name;
            }else{
                $user=User::find($infoFriend->user_sent);
                $friend->name=$user->name;
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
