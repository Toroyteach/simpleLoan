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
        Schema::create('users', function (Blueprint $table) {
            $table->increments('id');
            $table->string('firstname')->default('firstname');
            $table->string('lastname')->default('lastname');
            $table->string('name');
            $table->string('email')->unique();
            $table->timestamp('email_verified_at')->nullable();
            $table->string('password');
            $table->rememberToken();
            $table->string('address')->default('123-here');
            $table->string('id_number')->unique()->nullable();
            $table->string('number')->unique()->nullable();
            $table->enum('role', ['admin', 'user', 'su'])->default('user');
            $table->string('photo_url')->default('avatar.jpg');
            $table->boolean('status')->default(0);
            $table->string('account_activated')->nullable();
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
        Schema::dropIfExists('users');
    }
};
