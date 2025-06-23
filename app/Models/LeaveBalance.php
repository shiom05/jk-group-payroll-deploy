<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LeaveBalance extends Model
{
    /** @use HasFactory<\Database\Factories\LeaveBalanceFactory> */
    use HasFactory;
    
    protected $primaryKey = 'balance_id';

    protected $fillable = [
        'security_id',
        'annual_total',
        'annual_used',
        'sick_total',
        'sick_used',
        'casual_total',
        'casual_used',
    ];

    public function security()
    {
        return $this->belongsTo(Security::class, 'security_id', 'securityId');
    }
}
