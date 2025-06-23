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
        Schema::create('payrolls', function (Blueprint $table) {
            $table->id();
            $table->string('payroll_month'); // Format: YYYY-MM
            $table->string('security_id'); 
            $table->date('calculated_at');
            $table->json('parameters'); // JSON column for all payroll data
            $table->timestamps();
            
            $table->foreign('security_id')->references('securityId')->on('securities')->onDelete('cascade');
            $table->unique(['payroll_month', 'security_id']); // Prevent duplicates
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('payrolls');
    }
};
