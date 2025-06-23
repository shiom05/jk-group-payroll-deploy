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
        Schema::table('securities', function (Blueprint $table) {

             $table->boolean('securityIsResigned')->default(false);
             $table->boolean('hasReturnedAllAssets')->default(false);
             $table->date('resignationEffectiveDate')->nullable();
             $table->text('resignationReason')->nullable();
             $table->text('resignationAdditionalInfo')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('securities', function (Blueprint $table) {
            //
        });
    }
};
