<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Password;

class UpdateUserRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, mixed>
     */
    public function rules()
    {
        return [
            'email' => 'required|email|unique:users,email,'.$this->id,
            'firstname'=> 'required|string|max:55',
            'lastname'=> 'required|string|max:55',
            'address' => 'required|string|max:55',
            'number' => ['required', 'integer', 'unique:users,number,'.$this->id, 'digits:12', 'regex:/(254)[0-9]{9}/'],
            'id_number' => ['required', 'integer', 'unique:users,id_number,'.$this->id, 'digits_between:6,8',],
            'role' => 'required',
            'password' => [
                'confirmed',
                Password::min(8)
                    ->letters()
                    ->symbols(),
            ]
        ];
    }
}
