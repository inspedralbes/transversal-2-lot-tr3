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
        Schema::create('challenges', function (Blueprint $table) {
            $table->unsignedBigInteger('challenger');
            $table->unsignedBigInteger('challenged');
            $table->unsignedBigInteger('winner');
            $table->unsignedBigInteger('quizz_id');
            $table->foreign('challenger')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('challenged')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('winner')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('quizz_id')->references('id')->on('quizzs')->onDelete('cascade');
            $table->date('date_creation'); 
            $table->ENUM('status', array('pending', 'declined', 'completed'))->DEFAULT('pending');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('challenges');
    }
};
