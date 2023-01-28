<?php

namespace App\Http\Resources;

use App\Models\Status;
use App\Models\User;
use Illuminate\Http\Resources\Json\JsonResource;

class LoanResource extends JsonResource
{
    public static $wrap = false;

    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array|\Illuminate\Contracts\Support\Arrayable|\JsonSerializable
     */
    public function toArray($request)
    {
        $statusName = Status::select(['name'])->find($this->status_id);

        $userName = User::select(['name'])->find($this->user_id);

        return [
            'id' => $this->id,
            'loan_amount' => $this->loan_amount,
            'loan_amount_plus_interest' => $this->loan_amount_plus_interest,
            'description' => $this->description,
            'repaid_amount' => $this->repaid_amount,
            'balance_amount' => $this->balance_amount,
            'duration' => $this->duration,
            'max_limit_amount' => $this->max_limit_amount,
            'status_id' => $statusName->name,
            'user_id' => $userName->name,
            'created_at' => $this->created_at->format('Y-m-d H:i:s'),
        ];
    }
}
