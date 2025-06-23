<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SecurityAsset extends Model
{
    /** @use HasFactory<\Database\Factories\SecurityAssetFactory> */
    use HasFactory;
    protected $fillable = [
        'security_id',
        'inventory_item_id',
        'quantity',
    ];

    public function security()
    {
        return $this->belongsTo(Security::class, 'security_id', 'securityId');
    }

    public function inventoryItem()
    {
        return $this->belongsTo(InventoryItems::class, 'inventory_item_id', 'id');
    }
}
