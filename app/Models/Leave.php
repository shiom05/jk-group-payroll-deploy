<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Leave extends Model
{
    use HasFactory;

    protected $primaryKey = 'leave_id';

    protected $fillable = [
        'security_id',
        'leave_type',
        'reason',
        'description',
        'start_date',
        'end_date',
    ];

    protected $casts = [
        'start_date' => 'date',
        'end_date' => 'date',
    ];

    public function security()
    {
        return $this->belongsTo(Security::class, 'security_id', 'securityId');
    }
}