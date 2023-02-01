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
        // \App\Models\User::factory(10)->create();
        $users = [
            [
                'id'             => 1,
                'name'           => 'Anthony Toroyteach',
                'email'          => 'tonytoroitich@gmail.com', //real email
                'password'       => '$2y$10$PadOOF6GiHJqI1IQhPZNjeXkKGPip9vJXdhB5ra6lrvZdcZFZDCjy', //"password"
                'firstname'      => 'Anthony',
                'lastname'       => 'Toroyteach',
                'number'         => '254710516288', //tony
                'id_number'      => '1555961',
                'address'        => '123-here',
                'status'         => 1,
                'role'           => 'admin',
                'remember_token' => null,
            ],
            [
                'id'             => 2,
                'name'           => 'Andrew Wafula',
                'email'          => 'andrew.w.wafula@gmail.com', //real email
                'password'       => '$2y$10$PadOOF6GiHJqI1IQhPZNjeXkKGPip9vJXdhB5ra6lrvZdcZFZDCjy', //"password"
                'firstname'      => 'Andrew',
                'lastname'       => 'Wafula',
                'number'         => '254704144041', //tony
                'id_number'      => '1666123',
                'address'        => '123-here',
                'status'         => 1,
                'role'           => 'admin',
                'remember_token' => null,
            ],
            [
                'id'             => 3,
                'name'           => 'Jonnes Iyadi',
                'email'          => 'iyadi@gmail.com', //real email
                'password'       => '$2y$10$PadOOF6GiHJqI1IQhPZNjeXkKGPip9vJXdhB5ra6lrvZdcZFZDCjy', //"password"
                'firstname'      => 'Jonnes',
                'lastname'       => 'Iyadi',
                'number'         => '254710342536', //tony
                'id_number'      => '1777432',
                'address'        => '123-here',
                'status'         => 1,
                'role'           => 'user',
                'remember_token' => null,
            ],
        ];

        \App\Models\User::insert($users);

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

        //\App\Models\Loan::factory(10)->create();
    }
}
