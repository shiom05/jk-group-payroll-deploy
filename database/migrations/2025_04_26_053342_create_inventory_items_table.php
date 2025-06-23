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
        Schema::create('inventory_items', function (Blueprint $table) {
            //there will be x number of records of the same type of each and duplicate with new and returned
            //When returned create a new record with type returned and keep incrementing that when security return the same 

            $table->id();
            $table->foreignId('inventory_type_id')->constrained();
            $table->string('size')->nullable();
            $table->enum('condition', ['new', 'returned'])->default('new');
            $table->integer('quantity')->default(0);
            $table->decimal('purchase_price', 10, 2);
            $table->date('purchase_date');
            $table->date('last_restocked_at')->nullable();
            $table->boolean('is_available')->default(true);
            $table->timestamps();
            
            $table->index(['inventory_type_id', 'size', 'condition']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('inventory_items');
    }
};
