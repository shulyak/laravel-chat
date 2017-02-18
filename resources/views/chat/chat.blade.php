@extends('layouts.app')

@section('content')
    <div class="container">
        <div class="row">
            <div class="col-md-4">
                @include('chat.layouts.users', ['users' => $users])
            </div>
            <div class="col-md-8" id="chatContainer"></div>
        </div>
    </div>
@endsection


@push('scripts')
    <script src="https://cdn.socket.io/socket.io-1.4.5.js"></script>
    <!-- Scripts -->
    <script>
        window.modules.chatController = {!! json_encode([
            'socketIoHost' => env('SOCKETIO_ASSETS_SERVER_HOST'),
            'socketIoPort' => env('SOCKETIO_SERVER_PORT'),
            'token' => $user->secret_token
        ]) !!};
    </script>
@endpush