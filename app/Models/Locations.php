<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Locations extends Model
{
    use HasFactory;

    protected $primaryKey = 'locationId';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'locationName',
        'locationType',
        'address',
        'isJkPropLocation',
        'billing_OIC_HourlyRate',
        'billing_JSO_HourlyRate',
        'billing_CSO_HourlyRate',
        'billing_LSO_HourlyRate',
        'billing_SSO_HourlyRate',
        'paying_OIC_HourlyRate',
        'paying_JSO_HourlyRate',
        'paying_CSO_HourlyRate',
        'paying_LSO_HourlyRate',
        'paying_SSO_HourlyRate',
    ];

    protected $casts = [
        'isJkPropLocation' => 'boolean', // Ensures boolean type
    ];

    public function securities()
    {
        return $this->belongsToMany(Security::class, 'security_location_allocations', 'location_id', 'security_id');
    }

    protected static function boot()
    {
        parent::boot();
        
        static::creating(function ($model) {
            if (empty($model->locationId)) {
                $model->locationId = Str::uuid()->toString();
            }
        });
    }
}
