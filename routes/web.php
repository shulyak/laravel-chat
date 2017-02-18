<?php

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/


Route::group(['middleware' => ['web']], function () {

    Route::get('/', function () {
        return view('home');
    });

    Auth::routes();

    Route::get('/home', 'HomeController@index');
    Route::get('/chat', 'ChatController@index');
    Route::get('/messages', 'ChatController@messages');
    Route::post('/chat', 'ChatController@send');
});


Route::group(['middleware' => ['auth', 'admin']], function () {

    Route::get('/', function () {
        return redirect('/admin');
    });

    Route::get('/admin', 'AdminController@index');
    Route::get('/admin/messages', 'AdminController@messages');
    Route::get('/admin/users', 'AdminController@users');
    Route::delete('/admin/remove', 'AdminController@remove');
});