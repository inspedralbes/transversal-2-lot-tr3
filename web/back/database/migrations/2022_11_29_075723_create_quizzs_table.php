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
            $table->date('date_creation')->default(date('Y-m-d'));
            $table->text('name_creator')->nullable();
            $table->text('difficulty')->nullable();
            $table->text('category')->nullable();
            $table->ENUM('type', array('daily', 'demo', 'normal'))->DEFAULT('normal');
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
        Schema::dropIfExists('quizzs');
    }
};
