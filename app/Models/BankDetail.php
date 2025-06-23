<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BankDetail extends Model
{
    /** @use HasFactory<\Database\Factories\BankDetailFactory> */
    use HasFactory;

    protected $fillable = [
        'security_id',
        'bank_name',
        'bank_branch',
        'account_number',
        'bank_account_holder_name',
        'is_commercial_bank',
    ];

    protected $casts = [
    'is_commercial_bank' => 'boolean',
    ];

    public function security()
    {
        // return $this->belongsTo(Security::class);
        return $this->belongsTo(Security::class, 'security_id', 'securityId');
    }
}
