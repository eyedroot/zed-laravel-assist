<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreUserRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'email' => ['required', Rule::unique('users', 'email')],
            'status' => ['boolean'],
        ];
    }
}
