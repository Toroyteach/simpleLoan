<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('loans', function (Blueprint $table) {
            $table->increments('id');
            $table->longText('description')->nullable();
            $table->decimal('loan_amount', 15, 2);
            $table->decimal('repaid_amount', 15, 2)->default(0);
            $table->decimal('balance_amount', 15, 2);
            $table->decimal('max_limit_amount', 15, 2)->default(0);
            $table->decimal('loan_amount_plus_interest', 15, 2);
            $table->string('status')->default(1);
            $table->string('loan_type')->default('Development');
            $table->string('duration')->default(1);
            $table->date('approved_date')->nullable();
            $table->date('next_pay_date')->nullable();
            $table->string('mpesa_receipt')->nullable()->unique();
            $table->integer('user_id')->unsigned();
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            $table->unsignedInteger('status_id')->default(1)->nullable();
            $table->foreign('status_id', 'status_fk_1721035')->references('id')->on('statuses');
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('loans');
    }
};
