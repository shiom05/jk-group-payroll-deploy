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
        Schema::create('security_black_marks', function (Blueprint $table) {
            $table->id();
             $table->string('security_id');
            $table->enum('type', [
                'Theft',
                'Vacate a Point',
                'Alcohol/Drug',
                'Leave end date not return',
                'Other'
            ]);
            $table->text('incident_description');
            $table->date('incident_date');
            $table->text('inquiry_details')->nullable();
            $table->decimal('fine_amount', 10, 2)->nullable();
            $table->date('fine_effective_date')->nullable();
            $table->enum('status', ['pending', 'completed'])->default('pending');
            $table->timestamps();

             $table->foreign('security_id')->references('securityId')->on('securities')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('security_black_marks');
    }
};
