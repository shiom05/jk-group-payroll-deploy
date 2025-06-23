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
        Schema::create('bank_details', function (Blueprint $table) {
            $table->id();
            $table->string('security_id')->unique();
            $table->string('bank_name');
            $table->string('bank_branch');
            $table->string('account_number')->unique();
            $table->string('bank_account_holder_name')->nullable();
            $table->boolean('is_commercial_bank')->default(false);
            $table->timestamps();

            
            $table->foreign('security_id')
            ->references('securityId')
            ->on('securities')
            ->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('bank_details');
    }
};
