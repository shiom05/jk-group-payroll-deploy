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
        Schema::create('security_expenses', function (Blueprint $table) {
            $table->id();
            $table->foreignId('security_id')->constrained('securities', 'securityId')->onDelete('cascade');
            $table->enum('type', ['Food', 'Travel', 'Accommodation', 'Advances']);
            $table->string('description')->nullable();
            $table->date('date');
            $table->decimal('amount', 10, 2);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('security_expenses');
    }
};
