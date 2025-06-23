<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Payroll extends Model
{
    /** @use HasFactory<\Database\Factories\PayrollFactory> */
    use HasFactory;

    
    protected $fillable = [
        'payroll_month',
        'security_id',
        'calculated_at',
        'parameters'
    ];

    protected $casts = [
        'parameters' => 'array',
        'calculated_at' => 'date'
    ];

    public function security()
    {
        return $this->belongsTo(Security::class, 'security_id', 'securityId');
    }
}
