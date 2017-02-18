<form class="form-horizontal" role="form" method="POST" action="{{ route('login') }}">
    {{ csrf_field() }}

    <div class="form-group{{ $errors->has('login.login') ? ' has-error' : '' }}">
        <label for="login" class="col-md-4 control-label">E-Mail Address or Nickname</label>

        <div class="col-md-6">
            <input id="login" type="text" class="form-control" name="login[login]" value="{{ old('login.login') }}" required autofocus>

            @if ($errors->has('login.login'))
                <span class="help-block">
                                        <strong>{{ $errors->first('login.login') }}</strong>
                                    </span>
            @endif
        </div>
    </div>

    <div class="form-group{{ $errors->has('login.password') ? ' has-error' : '' }}">
        <label for="password" class="col-md-4 control-label">Password</label>

        <div class="col-md-6">
            <input id="password" type="password" class="form-control" name="login[password]" value="{{ old('login.password') }}" required>

            @if ($errors->has('login.password'))
                <span class="help-block">
                                        <strong>{{ $errors->first('login.password') }}</strong>
                                    </span>
            @endif
        </div>
    </div>

    <div class="form-group">
        <div class="col-md-6 col-md-offset-4">
            <div class="checkbox">
                <label>
                    <input type="checkbox" name="login[remember]" {{ old('login.remember') ? 'checked' : '' }}> Remember Me
                </label>
            </div>
        </div>
    </div>

    <div class="form-group">
        <div class="col-md-8 col-md-offset-4">
            <button type="submit" class="btn btn-primary">
                Login
            </button>

            <a class="btn btn-link" href="{{ route('password.request') }}">
                Forgot Your Password?
            </a>
        </div>
    </div>
</form>