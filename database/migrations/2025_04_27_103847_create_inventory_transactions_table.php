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
        Schema::create('inventory_transactions', function (Blueprint $table) {
            $table->id();
            $table->enum('type', ['allocation', 'return']);
            $table->string('security_id');
            $table->date('transaction_date');
            $table->date('start_date')->nullable();
            $table->integer('installments')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();

            $table->foreign('security_id')->references('securityId')->on('securities')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('inventory_transactions');
    }
};
