<div class="panel panel-default">
    <div class="panel-heading">Users</div>

    <div class="panel-body">
        <ul class="nav nav-pills nav-stacked from-members">
            @forelse ($users as $user)
                <li>
                    <a href="#" class="chat-from-member" data-id="{{ $user->id }}">
                        <i class="glyphicon glyphicon-user"></i> <b>{{ $user->name }}</b>
                    </a>
                </li>
            @empty
                <p>No users</p>
            @endforelse
        </ul>
    </div>
</div>