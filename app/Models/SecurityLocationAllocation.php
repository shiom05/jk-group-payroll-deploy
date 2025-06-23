<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SecurityLocationAllocation extends Model
{
    /** @use HasFactory<\Database\Factories\SecurityLocationAllocationFactory> */
    use HasFactory;

    protected $table = 'security_location_allocations';

    // Disable automatic timestamps since we will be handling them manually
    public $timestamps = true;

    // Define fillable fields (for mass assignment)
    protected $fillable = [
        'security_id',
        'location_id',
    ];

    // Define the relationship between Security and Location
    public function security()
    {
        return $this->belongsTo(Security::class, 'security_id', 'securityId');
    }

    public function location()
    {
        return $this->belongsTo(Locations::class, 'location_id', 'locationId');
    }


}
