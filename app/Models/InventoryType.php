<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\InventoryItems;


class InventoryType extends Model
{
    /** @use HasFactory<\Database\Factories\InventoryTypeFactory> */
    use HasFactory;

    protected $fillable = [
        'name',
        'code',
        'track_size',
        'size_range',
        'standard_price'
    ];

    protected $casts = [
        'track_size' => 'boolean',
        'standard_price' => 'decimal:2'
    ];

    public function items(): HasMany
    {
        return $this->hasMany(InventoryItems::class);
    }
    
    public function getSizesAttribute(): ?array
    {
        if (!$this->track_size) return null;
        
        [$min, $max] = explode('-', $this->size_range);
        return range($min, $max);
    }



}
