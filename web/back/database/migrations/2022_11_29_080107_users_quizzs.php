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
        Schema::create('users_quizzs', function (Blueprint $table) {
            $table->id()->index();
            $table->bigInteger('user_id')->unsigned()->index();
            $table->bigInteger('quizz_id')->unsigned();
            $table->bigInteger('score')->default(0);   
            $table->bigInteger('time_resolution')->default(150);  
            $table->timestamp('date')->default(date('Y-m-d'));
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('quizz_id')->references('id')->on('quizzs')->onDelete('cascade'); 
            $table->timestamp('updated_at')->nullable();
            $table->timestamp('created_at')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('users_quizzs');
    }
};
