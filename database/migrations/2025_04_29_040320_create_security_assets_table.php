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
        Schema::create('security_assets', function (Blueprint $table) {
            $table->id();
            $table->foreignId('security_id')->constrained('securities', 'securityId');
            $table->foreignId('inventory_item_id')->constrained('inventory_items', 'id');
            $table->integer('quantity');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('security_assets');
    }
};
