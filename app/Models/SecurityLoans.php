<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;


class SecurityLoans extends Model
{
    /** @use HasFactory<\Database\Factories\SecurityLoansFactory> */
    use HasFactory;

    protected $fillable = ['security_id', 'total_amount', 'installments', 'start_date', 'description'];

    public function security()
    {
        return $this->belongsTo(Security::class, 'security_id', 'securityId');
    }

    public function getInstallmentAmountAttribute()
    {
        return round($this->total_amount / $this->installments, 2);
    }

    public function getEndDateAttribute()
    {
        return Carbon::parse($this->start_date)->addMonths($this->installments - 1)->format('Y-m-d');
    }
}
