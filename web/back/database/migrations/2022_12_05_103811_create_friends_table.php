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
        Schema::create('friends', function (Blueprint $table) {
            $table->id();
            $table->bigInteger('user_sent')->unsigned()->index();
            $table->bigInteger('user_received')->unsigned()->index();
            $table->ENUM('status', array('pending', 'accepted'))->DEFAULT('pending');
            $table->foreign('user_sent')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('user_received')->references('id')->on('users')->onDelete('cascade');
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
        Schema::dropIfExists('friends');
    }
};
