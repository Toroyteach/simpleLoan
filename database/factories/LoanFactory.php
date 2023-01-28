<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\User>
 */
class LoanFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition()
    {
        return [
            'loan_amount' => fake()->numberBetween($min = 1000, $max = 90000),
            'loan_amount_plus_interest' => fake()->numberBetween($min = 1000, $max = 9000),
            'description' => fake()->realText($maxNbChars = 200, $indexSize = 2),
            'repaid_amount' => fake()->numberBetween($min = 1000, $max = 9000),
            'balance_amount' => fake()->numberBetween($min = 1000, $max = 9000),
            'duration' => fake()->numberBetween($min = 1, $max = 9),
            'user_id' => fake()->numberBetween($min = 1, $max = 10),
            'status_id' => fake()->numberBetween($min = 1, $max = 4),
        ];
    }
}
