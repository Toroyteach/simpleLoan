<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Traits\Auditable;
use App\Traits\MultiTenantModelTrait;
use \DateTimeInterface;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Loan extends Model
{
    use SoftDeletes, Auditable, HasFactory, MultiTenantModelTrait;


    protected $dates = [
        'created_at',
        'updated_at',
        'deleted_at',
    ];

    protected $fillable = [
        'loan_amount',
        'loan_amount_plus_interest',
        'description',
        'repaid_amount',
        'balance_amount',
        'duration',
        'user_id',
        'status_id',
        'max_limit_amount',
        'approved_date',
        'next_pay_date',
        'created_at',
        'updated_at',
        'deleted_at',
    ];

    protected function serializeDate(DateTimeInterface $date)
    {
        return $date->format('Y-m-d H:i:s');
    }

    public function users()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function status()
    {
        return $this->belongsTo(Status::class, 'status_id');
    }

    public function logs()
    {
        return $this->morphMany(AuditLog::class, 'subject');
    }
}
