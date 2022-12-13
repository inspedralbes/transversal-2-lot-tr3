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
            $table->unsignedBigInteger('winner')->nullable();
            $table->timestamp('date_creation')->default(date('Y-m-d'));
            $table->ENUM('status', array('pending', 'declined', 'completed'))->DEFAULT('pending');

            $table->foreign('challenger')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('challenged')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('winner')->references('id')->on('users')->onDelete('cascade');
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
        Schema::dropIfExists('challenges');
    }
};
