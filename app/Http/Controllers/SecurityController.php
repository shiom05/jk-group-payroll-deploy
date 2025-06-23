<?php

namespace App\Http\Controllers;

use App\Models\Security;
use App\Http\Requests\StoreSecurityRequest;
use App\Http\Requests\UpdateSecurityRequest;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

use Illuminate\Http\Request;

class SecurityController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $securities = Security::with('bankDetails')
        ->where('securityIsResigned', false)
        ->get();

    return response()->json($securities);
    }

     public function getAllSecurities()
    {
        $securities = Security::with('bankDetails')->get();
        return response()->json($securities);   
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreSecurityRequest $request)
    {
        // Log the incoming request body
        \Log::info('Security Store Request:', [
            'request_data' => $request->all(),
            'files' => $request->hasFile('securityPhoto') ? 'File present' : 'No file'
        ]);


        $validator = Validator::make($request->all(), [
            'securityId' => ['required'],
            'securityName' => ['required'],
            'securityDob' => ['required'],
            'securityNicNumber' => ['required'],
            'securityPrimaryContact' => ['required'],
            'securitySecondaryContact' => ['required'],
            'securityPhoto' => ['required'],
            'securityDateOfJoin' => ['required'],

            'securityType' => ['required', 'in:LSO,OIC,JSO,SSO,CSO'],
            'securityPermanentAddress' => ['required'],
            'securityCurrentAddress' => ['required'],
            'securityGender' => ['required', 'in:male,female'],
            'securityDistrict' => ['required'],
            'securityPoliceDivision' => ['required'],
            'securityGramaNiladariDivision' => ['required'],
            'securityEducationalInfo' => ['required'],
            'securityMaritalStatus' => ['required', function ($attribute, $value, $fail) {
                if (!in_array($value, ['true', 'false', true, false])) {
                    $fail('The '.$attribute.' field must be true or false.');
                }
            }],
            'securityPreviousWorkplace' => ['required'],
            'securityExperience' => ['required'],
            'securityEmergencyContactName' => ['required'],
            'securityEmergencyContactAddress' => ['required'],
            'securityEmergencyContactNumber' => ['required'],
            'securityAdditionalInfo' => ['nullable'],
            'securityEpfNumber' => ['nullable'],
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $data = $request->except('securityPhoto');
        // $datePart = now()->format('Ymd');
        // $randomNumber = mt_rand(1, 9999);
        // $randomPart = str_pad($randomNumber, 4, '0', STR_PAD_LEFT);
        // $securityId = 'JK' . $datePart . $randomPart;
        // $data['securityId'] = $securityId;

        if (isset($data['securityStatus'])) {
            $data['securityStatus'] = (int) $data['securityStatus'];
        }

         foreach ([
        'securityNicUploaded',
        'securityPoliceReportUploaded',
        'securityBirthCertificateUploaded',
        'securityGramasewakaLetterUploaded',
        'securityMaritalStatus'] as $field) {
            $data[$field] = filter_var($request->input($field), FILTER_VALIDATE_BOOLEAN);
        }

        if ($request->hasFile('securityPhoto')) {
            $path = $request->file('securityPhoto')->store('security_photos', 'public');
            $data['securityPhoto'] = $path;
        }

        $security = Security::create($data);

        return response()->json($security, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Security $security)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Security $security)
    {
      
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateSecurityRequest $request, Security $security)
    {
        $securityId = $security->securityId;
        $security = Security::where('securityId', $securityId)->first();

        if (!$security) {
            return response()->json(['message' => 'Security not found'], 404);
        }

        $validatedData = $request->validate([
            'securityId' => ['required'],
            'securityName' => ['required'],
            'securityDob' => ['required'],
            'securityNicNumber' => ['required'],
            'securityPrimaryContact' => ['required'],
            'securitySecondaryContact' => ['required'],
            'securityDateOfJoin' => ['required'],
            'securityType' => ['required', 'in:LSO,OIC,JSO,SSO,CSO'],
            'securityPermanentAddress' => ['required'],
            'securityCurrentAddress' => ['required'],
            'securityGender' => ['required', 'in:male,female'],
            'securityDistrict' => ['required'],
            'securityPoliceDivision' => ['required'],
            'securityStatus' => ['required'],
            'securityGramaNiladariDivision' => ['required'],
            'securityEducationalInfo' => ['required'],
            'securityMaritalStatus' => ['required', function ($attribute, $value, $fail) {
                if (!in_array($value, ['true', 'false', true, false])) {
                    $fail('The '.$attribute.' field must be true or false.');
                }
            }],
            'securityPreviousWorkplace' => ['required'],
            'securityExperience' => ['required'],
            'securityEmergencyContactName' => ['required'],
            'securityEmergencyContactAddress' => ['required'],
            'securityEmergencyContactNumber' => ['required'],
            'securityAdditionalInfo' => ['nullable'],
            'securityEpfNumber' => ['nullable'],
        ]);
    
            $checkboxFields = [
                'securityNicUploaded',
                'securityPoliceReportUploaded',
                'securityBirthCertificateUploaded',
                'securityGramasewakaLetterUploaded',
            ];

                foreach ($checkboxFields as $field) {
                $validatedData[$field] = filter_var($request->input($field), FILTER_VALIDATE_BOOLEAN);
            }

        if (isset($validatedData['securityStatus'])) {
            $validatedData['securityStatus'] = (int) $request['securityStatus'];
        }
            
        $validatedData['securityMaritalStatus'] = filter_var($validatedData['securityMaritalStatus'], FILTER_VALIDATE_BOOLEAN);

    
        $security->update($validatedData);
        return response()->json($security);
    }


    public function resign(Request $request, Security $security)
{
    $validator = Validator::make($request->all(), [
        'resignationEffectiveDate' => 'required|date',
        'resignationReason' => 'required|string',
        'resignationAdditionalInfo' => 'nullable|string',
        'hasReturnedAllAssets' => 'required|boolean',
        'securityIsResigned' => 'required|boolean',
    ]);

    if ($validator->fails()) {
        return response()->json(['errors' => $validator->errors()], 422);
    }

    $security->update([
        'resignationEffectiveDate' => $request->resignationEffectiveDate,
        'resignationReason' => $request->resignationReason,
        'resignationAdditionalInfo' => $request->resignationAdditionalInfo,
        'hasReturnedAllAssets' => $request->hasReturnedAllAssets,
        'securityIsResigned' => $request->securityIsResigned,
        'securityStatus' => $request->securityStatus,
    ]);

    return response()->json([
        'message' => 'Security resigned successfully.',
        'data' => $security,
    ]);
}
    public function rehire(Request $request, Security $security)
{
    $security->update([
        'resignationEffectiveDate' => $request->resignationEffectiveDate,
        'resignationReason' => $request->resignationReason,
        'resignationAdditionalInfo' => $request->resignationAdditionalInfo,
        'hasReturnedAllAssets' => $request->hasReturnedAllAssets,
        'securityIsResigned' => $request->securityIsResigned,
        'securityStatus' => $request->securityStatus,
    ]);

    return response()->json([
        'message' => 'Security Rehired Successfully.',
        'data' => $security,
    ]);
}

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Security $security)
    {
        //
    }
}
