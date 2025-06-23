<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SecurityShiftLog extends Model
{
    /** @use HasFactory<\Database\Factories\SecurityShiftLogFactory> */
    use HasFactory;

    protected $fillable = [
        'security_id',
        'location_id',
        'shift_date',
        'start_time',
        'end_time',
        'notes',
        'total_hours',
        'security_total_pay_for_shift',
        'total_bill_pay_for_shift'
    ];

    protected $dates = [
        'shift_date',
        'start_time',
        'end_time',
    ];

    public function security()
    {
        return $this->belongsTo(Security::class, 'security_id', 'securityId');
    }

    public function location()
    {
        return $this->belongsTo(Locations::class, 'location_id', 'locationId');
    }

}
