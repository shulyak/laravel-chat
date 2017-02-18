@extends('layouts.app')

@section('content')
    <div class="container">
        <div class="row">
            <div class="col-md-3">
                @include('admin.layouts.users', ['users' => $users])
            </div>
            <div class="col-md-3">
                <div class="panel panel-default">
                    <div class="panel-heading">Dialogs with</div>

                    <div class="panel-body">
                        <ul class="nav nav-pills nav-stacked to-members" id="dialogUsers"></ul>
                    </div>
                </div>
            </div>
            <div class="col-md-6" id="chatContainer"></div>
        </div>
    </div>
@endsection


@push('scripts')
<!-- Scripts -->
<script>
    window.modules.adminController = {};
</script>
@endpush