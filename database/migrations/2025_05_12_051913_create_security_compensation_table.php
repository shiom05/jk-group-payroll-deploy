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
        Schema::create('security_compensation', function (Blueprint $table) {
           $table->id();
            $table->string('security_id');
            $table->decimal('amount', 10, 2);
            $table->string('reason');
            $table->date('effective_date');
            $table->timestamps();

            $table->foreign('security_id')->references('securityId')->on('securities');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('security_compensation');
    }
};
