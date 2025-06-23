<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('leave_balances', function (Blueprint $table) {

            $table->id('balance_id');
            $table->foreignId('security_id')->unique();
            $table->integer('annual_total')->default(14); // Default Annual leave
            $table->integer('annual_used')->default(0);
            $table->integer('sick_total')->default(7); // Default Sick leave
            $table->integer('sick_used')->default(0);
            $table->integer('casual_total')->default(5); // Default Casual leave
            $table->integer('casual_used')->default(0);
            $table->timestamps();

            $table->foreign('security_id')
            ->references('securityId')
            ->on('securities')
            ->onDelete('cascade');
        });
    } 

    public function down(): void
    {
        Schema::dropIfExists('leave_balances');
    }
};
// https://chatgpt.com/share/67f80658-5590-800c-82a6-5f09f50cc349