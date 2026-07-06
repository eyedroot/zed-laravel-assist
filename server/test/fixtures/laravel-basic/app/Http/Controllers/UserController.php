<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreUserRequest;
use App\Models\User;

class UserController
{
    public function show(User $user)
    {
        return view('users.show', ['user' => $user]);
    }

    public function me()
    {
        return User::query()->first();
    }

    public function store(StoreUserRequest $request)
    {
        return $request->validated('email');
    }
}
