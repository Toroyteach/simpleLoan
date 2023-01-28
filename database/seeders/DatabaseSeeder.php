<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        \App\Models\User::factory(10)->create();

        $status =  [
            [
                'name' => 'Processing',
            ],
            [
                'name' => 'Approved',
            ],
            [
                'name' => 'AdjustAmount',
            ],
            [
                'name' => 'Rejected',
            ],
            [
                'name' => 'Defaulted',
            ],
        ];

        \App\Models\Status::insert($status);

        \App\Models\Loan::factory(10)->create();

        // \App\Models\User::factory()->create([
        //     'name' => 'Test User',
        //     'email' => 'test@example.com',
        // ]);
    }
}
