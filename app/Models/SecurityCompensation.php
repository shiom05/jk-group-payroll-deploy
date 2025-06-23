<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SecurityCompensation extends Model
{
    /** @use HasFactory<\Database\Factories\SecurityCompensationFactory> */
    use HasFactory;

    protected $fillable = [
        'security_id',
        'amount',
        'reason',
        'effective_date'
    ];

    protected $casts = [
        'effective_date' => 'date',
        'amount' => 'decimal:2',
    ];

    public function security()
    {
        return $this->belongsTo(Security::class, 'security_id', 'securityId');
    }
    
}
