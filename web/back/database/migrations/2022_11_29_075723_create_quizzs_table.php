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
        Schema::create('quizzs', function (Blueprint $table) {
            $table->id();
            $table->json('game');
            $table->timestamp('date_creation');
            $table->text('name_creator')->nullable();
            $table->text('difficulty');
            $table->text('category');
            $table->ENUM('type', array('daily', 'demo', 'normal'))->DEFAULT('normal');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('quizzs');
    }
};
