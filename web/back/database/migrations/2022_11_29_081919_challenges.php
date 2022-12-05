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
            $table->id()->index();
            $table->bigInteger('challenger')->unsigned()->index();
            $table->bigInteger('challenged')->unsigned();
            $table->bigInteger('quizz_id')->unsigned();
            $table->unsignedBigInteger('winner');
            $table->date('date_creation'); 
            $table->ENUM('status', array('pending', 'declined', 'completed'))->DEFAULT('pending');

            $table->foreign('challenger')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('challenged')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('winner')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('quizz_id')->references('id')->on('quizzs')->onDelete('cascade');
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
