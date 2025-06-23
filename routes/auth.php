<?php

use Illuminate\Support\Facades\Route;
use Laravel\WorkOS\Http\Requests\AuthKitAuthenticationRequest;
use Laravel\WorkOS\Http\Requests\AuthKitLoginRequest;
use Laravel\WorkOS\Http\Requests\AuthKitLogoutRequest;

Route::get('login', function (AuthKitLoginRequest $request) {
    return $request->redirect();
})->middleware(['guest','web'])->name('login');

Route::get('authenticate', function (AuthKitAuthenticationRequest $request) {
    $request->authenticate();

    // Get the authenticated user (from Laravel Auth)
    $user = auth()->user();

    // Allowed email from env
    $allowedEmail = env('WORKOS_ALLOWED_EMAIL');

    // Check if the logged in user's email matches the allowed one
    if (!$user || $user->email !== $allowedEmail) {
        auth()->logout(); // Log the user out immediately
        abort(403, 'Access denied: Unauthorized account');
    }

    return to_route('dashboard');
})->middleware(['guest', 'throttle:10,1']);

Route::post('logout', function (AuthKitLogoutRequest $request) {
    return $request->logout();
})->middleware(['auth','web'])->name('logout');
