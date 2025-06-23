<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo; // ✅ Correct import
use Illuminate\Database\Eloquent\Relations\HasMany;   // ✅ Correct import

//import InventoryTransactionItem
class InventoryTransaction extends Model
{
    /** @use HasFactory<\Database\Factories\InventoryTransactionFactory> */
    use HasFactory;

    protected $fillable = [
        'type', 'user_id', 'security_id',
        'transaction_date', 'installments', 'start_date', 'notes'
    ];

    protected $casts = [
        'transaction_date' => 'date',
        'start_date' => 'date'
    ];

    public function security(): BelongsTo
    {
        return $this->belongsTo(Security::class, 'security_id', 'securityId');
    }

  public function items(): HasMany
{
    return $this->hasMany(InventoryTransactionItem::class, 'inventory_transaction_id');
}


    public function getTotalValueAttribute(): float
    {
        return $this->items->sum(function ($item) {
            return $item->quantity * $item->unit_price;
        });
    }

    public function getTotalValueAttributePerInstallment(): float
    {
        return round($this->items->sum(function ($item) {
            return $item->quantity * $item->unit_price;
        }) / $this->installments, 2);
    }
}
