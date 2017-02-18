<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class Message extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'message',
        'from_user_id',
        'to_user_id',
        'active'
    ];

    /**
     *
     *
     * @var array
     */
    protected $casts = [
        'from_user_id' => 'int',
        'to_user_id' => 'int',
    ];

    /**
     * Get the user that owns the phone.
     */
    public function fromUser()
    {
        return $this->belongsTo('App\User', 'from_user_id');
    }

    /**
     * Get the user that owns the phone.
     */
    public function toUser()
    {
        return $this->belongsTo('App\User', 'to_user_id');
    }

    /**
     * Get dialog messages
     * @param $firstUserId
     * @param $secondUserId
     * @param int $limit
     * @return mixed
     */
    public static function getDialogMessages($firstUserId, $secondUserId, $limit = 5)
    {
        return DB::table('messages')
            ->select('messages.id', 'messages.message', 'messages.created_at', 'from.name AS username', 'from.id AS user_id')
            ->join('users AS from', 'from.id', '=', 'messages.from_user_id')
            ->whereIn('from_user_id', [$firstUserId, $secondUserId])
            ->whereIn('to_user_id', [$firstUserId, $secondUserId])
            ->where('active', 1)
            ->orderBy('created_at', 'desc')
            ->paginate($limit);
    }

    /**
     * Get all user dialogs members
     * @param $userId
     * @return mixed
     */
    public static function getDialogMembers($userId)
    {
        return DB::table('users')
            ->distinct()
            ->select('users.id', 'users.name AS username')
            ->leftJoin('messages AS from', 'from.from_user_id', '=', 'users.id')
            ->leftJoin('messages AS to', 'to.to_user_id', '=', 'users.id')
            ->where('from.to_user_id', $userId)
            ->orWhere('to.from_user_id', $userId)
            ->get();
    }
}
