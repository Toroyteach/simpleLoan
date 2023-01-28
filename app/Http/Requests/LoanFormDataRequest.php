<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class LoanFormDataRequest extends FormRequest
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
     * @return array
     */
    public function rules()
    {
        return [
            'loan_amount' => 'required|min:5',
            'description' => 'required|min:5',
            'user_id' => 'numeric|min:2',
        ];
    }
}
