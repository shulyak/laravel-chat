<?php

namespace App\Http\Controllers;

use App\Message;
use Carbon\Carbon;
use App\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AdminController extends Controller
{
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('auth');
    }

    /**
     * Show the application dashboard.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $user = Auth::user();
        $users = User::all()->where('role', '=', User::ROLE_USER)->where('id', '<>', $user->id);

        return view('admin.admin', [
            'users' => $users,
            'user' => $user
        ]);
    }

    /**
     * Add user dialog users.
     *
     * @param  Request  $request
     * @return Response
     */
    public function users(Request $request)
    {
        $user = User::findOrFail($request->input('id'));

        $users = Message::getDialogMembers($user->id);

        return response()->json([
            'status' => 'success',
            'users' => $users
        ], 200);
    }

    /**
     * Remove message.
     *
     * @param  Request  $request
     * @return Response
     */
    public function remove(Request $request)
    {
        $message = Message::findOrFail($request->input('id'));

        $message->update(['active' => 0]);

        return response()->json([
            'status' => 'success',
        ], 200);
    }

    /**
     * Get dialog messages
     * @param Request $request
     * @return Response
     */
    public function messages(Request $request)
    {
        $toUser = User::findOrFail($request->input('to_user_id'));
        $fromUser = User::findOrFail($request->input('from_user_id'));

        $data = Message::getDialogMessages($fromUser->id, $toUser->id);

        $messages = [];
        $next = $data->nextPageUrl();

        foreach ($data as $message) {
            $messages[] = [
                'id' => $message->id,
                'time' => (new Carbon($message->created_at))->diffForHumans(),
                'user_id' => $message->user_id,
                'username' => $message->username,
                'message' => $message->message
            ];
        }

        return response()->json([
            'status' => 'success',
            'messages' => $messages,
            'next' => $next
        ], 200);
    }
}
