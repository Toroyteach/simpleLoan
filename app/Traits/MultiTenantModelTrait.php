<?php

namespace App\Traits;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;

trait MultiTenantModelTrait
{
    public static function bootMultiTenantModelTrait()
    {
        if (!app()->runningInConsole() && auth()->check()) {
            
            $user = auth()->user();

            if ($user->role != 'admin') {

                static::addGlobalScope('user_id', function (Builder $builder) use ($user) {

                    $column = 'user_id';

                    $field = sprintf('%s.%s', $builder->getQuery()->from, $column);

                    $builder->where($field, auth()->id());
                });
            }
        }
    }
}
