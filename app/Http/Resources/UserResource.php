<?php

namespace App\Http\Resources;

use App\Models\File;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
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
        //$photoUrl = File::select(['name'])->where('user_id', $this->id)->orderBy('id', 'desc')->limit(1)->get();

        return [
            'id' => $this->id,
            'name' => $this->name,
            'email' => $this->email,
            'created_at' => $this->created_at->format('Y-m-d H:i:s'),
            'firstname' => $this->firstname,
            'lastname' => $this->lastname,
            'address' => $this->address,
            'number' => $this->number,
            'status' => $this->status,
            'id_number' => $this->id_number,
            'role' => $this->role,
            'photo_url' => $this->photo_url,
        ];
    }
}
