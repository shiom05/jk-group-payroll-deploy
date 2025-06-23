<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Leave;

class Security extends Model
{

    public $incrementing = false;  // Disable auto-increment assumption
    protected $keyType = 'string'; // Declare primary key type as string


    const STATUS_INACTIVE = 400;
    const STATUS_PENDING = 300;
    const STATUS_ACTIVE = 200;
    const STATUS_TERMINATED = 500;

    
    /** @use HasFactory<\Database\Factories\SecurityFactory> */
    use HasFactory;

    
    protected $primaryKey = 'securityId';

    protected $fillable = [
        'securityId',
        'securityName',
        'securityDob',
        'securityNicNumber',
        
        'securityPermanentAddress',
        'securityCurrentAddress',

        'securityPrimaryContact',
        'securitySecondaryContact',
        'securityPhoto',
        'securityNicUploaded',
        'securityPoliceReportUploaded',
        'securityBirthCertificateUploaded',
        'securityGramasewakaLetterUploaded',
        'securityStatus',
        'securityDateOfJoin',
        'securityType',
        
        'securityGender',
        'securityDistrict',
        'securityPoliceDivision',
        'securityGramaNiladariDivision',
        'securityEducationalInfo',
        'securityMaritalStatus',
        'securityPreviousWorkplace',
        'securityExperience',
        'securityEmergencyContactName',
        'securityEmergencyContactAddress',
        'securityEmergencyContactNumber',
        'securityAdditionalInfo',
        'securityEpfNumber',
        
        'resignationEffectiveDate',
        'resignationReason',
        'resignationAdditionalInfo',
        'securityIsResigned',
        'hasReturnedAllAssets',
    ];

    protected $casts = [
        'securityId' => 'string',
        'securityDob' => 'date',
        'securityDateOfJoin' => 'date',
        'securityNICUploaded' => 'boolean',
        'securityPoliceReportUploaded' => 'boolean',
        'securityBirthCertificateUploaded' => 'boolean',
        'securityGramasewakaLetterUploaded' => 'boolean',
        'securityStatus' => 'integer',
        'resignationEffectiveDate' => 'date',
        'securityIsResigned' => 'boolean',
        'hasReturnedAllAssets' => 'boolean',
       
    ];

    public function locations()
    {
        return $this->belongsToMany(Locations::class, 'security_location_allocations', 'security_id', 'location_id');
    }

    public function bankDetails()
    {
        return $this->hasOne(BankDetail::class, 'security_id', 'securityId');
    }

    // Add this method to get status text
public function getStatusTextAttribute()
{
    return match($this->securityStatus) {
        self::STATUS_ACTIVE => 'Active',
        self::STATUS_PENDING => 'Pending',
        self::STATUS_INACTIVE => 'Inactive',
        self::STATUS_TERMINATED => 'Terminated',
        default => 'Unknown',
    };
}
}
