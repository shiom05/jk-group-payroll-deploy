<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use App\Models\InventoryType;


class InventoryItems extends Model
{
    /** @use HasFactory<\Database\Factories\InventoryItemsFactory> */
    use HasFactory;

    protected $fillable = [
        'inventory_type_id', 'size', 'condition',
        'quantity', 'purchase_price', 'purchase_date',
        'last_restocked_at', 'is_available'
    ];

    protected $casts = [
        'purchase_date' => 'date',
        'last_restocked_at' => 'date',
        'purchase_price' => 'decimal:2',
        'is_available' => 'boolean'
    ];
 

    public function inventoryType(): BelongsTo
    {
        return $this->belongsTo(InventoryType::class);
    }
    
    public function scopeAvailable(Builder $query): Builder
    {
        return $query->where('is_available', true);
    }
    
    public function scopeNewItems(Builder $query): Builder
    {
        return $query->where('condition', 'new');
    }
    
    public function scopeReturnedItems(Builder $query): Builder
    {
        return $query->where('condition', 'returned');
    }
    
    public function getCurrentValueAttribute(): float
    {
        return $this->condition === 'returned' 
            ? $this->purchase_price * 0.5 
            : $this->purchase_price;
    }
    
    protected static function booted()
    {
        static::saving(function ($item) {
            if ($item->quantity <= 0) {
                $item->is_available = false;
            }
        });
    }
}
        