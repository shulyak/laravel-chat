<?php

namespace App\Http\Controllers;

use App\Message;
use App\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Events\NewMessageAdded;

class ChatController extends Controller
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

        return view('chat.chat', [
            'users' => $users,
            'user' => $user
        ]);
    }

    /**
     * Send message.
     *
     * @param  Request  $request
     * @return Response
     */
    public function send(Request $request)
    {
        $toUser = User::findOrFail($request->input('id'));
        $fromUser = Auth::user();

        $this->validate($request, [
            'message' => 'required|max:255',
        ]);


        $message = Message::create([
            'message' => $request->input('message'),
            'to_user_id' => $toUser->id,
            'from_user_id' => $fromUser->id
        ]);

        event(
            new NewMessageAdded($message)
        );

        return response()->json([
            'status' => 'success',
            'message' => [
                'time' => $message->created_at->diffForHumans(),
                'user_id' => $message->fromUser->id,
                'username' => $message->fromUser->name,
                'message' => $message->message
            ]
        ], 200);
    }

    /**
     * Get dialog messages
     * @param Request $request
     * @return Response
     */
    public function messages(Request $request)
    {
        $toUser = User::findOrFail($request->input('id'));
        $fromUser = Auth::user();

        $data = Message::getDialogMessages($fromUser->id, $toUser->id);

        $messages = [];
        $next = $data->nextPageUrl();

        foreach ($data as $message) {
            $messages[] = [
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
