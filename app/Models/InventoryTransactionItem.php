<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class InventoryTransactionItem extends Model
{
    /** @use HasFactory<\Database\Factories\InventoryTransactionItemFactory> */
    use HasFactory;

    protected $fillable = [
        'transaction_id', 'inventory_item_id',
        'quantity', 'unit_price', 'condition'
    ];

    protected $casts = [
        'unit_price' => 'decimal:2'
    ];

    public function transaction(): BelongsTo
    {
        return $this->belongsTo(InventoryTransaction::class);
    }

    // public function inventoryItem(): BelongsTo
    // {
    //     return $this->belongsTo(InventoryItem::class);
    // }

    public function inventoryItem(): BelongsTo
{
    return $this->belongsTo(InventoryItem::class, 'inventory_item_id');
}


}
