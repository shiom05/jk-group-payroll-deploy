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
        Schema::create('security_location_allocations', function (Blueprint $table) {
            // $table->id();

            $table->string('security_id');  // Foreign key referencing the securityId in the securities table
            $table->string('location_id');  // Foreign key referencing the locationId in the locations table
            $table->timestamps();

            // Define foreign keys
            $table->foreign('security_id')->references('securityId')->on('securities')->onDelete('cascade');
            $table->foreign('location_id')->references('locationId')->on('locations')->onDelete('cascade');

            // Define composite primary key (security_id, location_id)
            $table->primary(['security_id', 'location_id']);
            
           });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('security_location_allocations');
    }
};
