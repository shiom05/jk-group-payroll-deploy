<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SecurityBlackMark extends Model
{
    use HasFactory;

    protected $fillable = [
        'security_id',
        'type',
        'incident_description',
        'incident_date',
        'inquiry_details',
        'fine_amount',
        'fine_effective_date',
        'status'
    ];

    protected $casts = [
        'incident_date' => 'date',
        'fine_effective_date' => 'date',
    ];

    public function security()
    {
         return $this->belongsTo(Security::class, 'security_id', 'securityId');
    }

    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }

    public function scopeCompleted($query)
    {
        return $query->where('status', 'completed');
    }

    public function scopeForPayroll($query, $payrollDate)
    {
        return $query->where('fine_effective_date', '<=', $payrollDate)
            ->completed();
    }
}
