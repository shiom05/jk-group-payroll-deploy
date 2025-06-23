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
        Schema::create('locations', function (Blueprint $table) {
            
            $table->uuid('locationId')->primary();
            $table->string('locationName');
            $table->string('locationType');
            $table->string('address');
            $table->boolean('isJkPropLocation');

            $table->decimal('billing_OIC_HourlyRate', 8, 2);
            $table->decimal('billing_JSO_HourlyRate', 8, 2);
            $table->decimal('billing_CSO_HourlyRate', 8, 2);
            $table->decimal('billing_LSO_HourlyRate', 8, 2);

            $table->decimal('paying_OIC_HourlyRate', 8, 2);
            $table->decimal('paying_JSO_HourlyRate', 8, 2);
            $table->decimal('paying_CSO_HourlyRate', 8, 2);
            $table->decimal('paying_LSO_HourlyRate', 8, 2);

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('locations');
    }
};
