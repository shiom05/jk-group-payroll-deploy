<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SecurityExpenses extends Model
{
    /** @use HasFactory<\Database\Factories\SecurityExpensesFactory> */
    use HasFactory;

    protected $fillable = ['security_id', 'type', 'description', 'date', 'amount'];

    public function security()
    {
        return $this->belongsTo(Security::class, 'security_id', 'securityId');
    }
}
