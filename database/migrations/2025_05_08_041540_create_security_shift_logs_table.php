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
        Schema::create('security_shift_logs', function (Blueprint $table) {
          
            $table->id();
            $table->string('security_id');
            $table->string('location_id');
            $table->date('shift_date');
            $table->time('start_time');
            $table->time('end_time');
            $table->decimal('total_hours', 5, 2)->default(0); // e.g. 8.50
            $table->decimal('security_total_pay_for_shift', 10, 2)->default(0); // e.g. 1500.00
            $table->decimal('total_bill_pay_for_shift', 10, 2)->default(0); // e.g. 1500.00
            $table->text('notes')->nullable();
            $table->timestamps();

            $table->foreign('security_id')->references('securityId')->on('securities')->onDelete('cascade');
            $table->foreign('location_id')->references('locationId')->on('locations')->onDelete('cascade');
       
        
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('security_shift_logs');
    }
};
