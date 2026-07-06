<?php

use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;

Route::prefix('api-console')->group(function () {
    Route::get('me', [UserController::class, 'me'])->name('console.me');
});
