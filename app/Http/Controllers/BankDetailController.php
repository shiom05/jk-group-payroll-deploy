<?php

namespace App\Http\Controllers;

use App\Models\BankDetail;
use App\Models\Security;
use App\Http\Requests\StoreBankDetailRequest;
use App\Http\Requests\UpdateBankDetailRequest;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;

class BankDetailController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    public function getBySecurity($securityId)
    {
        // Validate security exists
        $security = Security::find($securityId);
        if (!$security) {
            return response()->json(['message' => 'Security personnel not found'], 404);
        }

        // Find bank details
        $bankDetail = BankDetail::where('security_id', $securityId)->first();

        if (!$bankDetail) {
            return response()->json(['message' => 'No bank details found for this security personnel'], 404);
        }

        return response()->json($bankDetail);
    }

   
    public function store(StoreBankDetailRequest $request)
    {

        $validator = Validator::make($request->all(), [
            'security_id' => 'required|exists:securities,securityId',
            'bank_name' => 'required|string',
            'bank_branch' => 'required|string',
            'account_number' => 'required|string|unique:bank_details,account_number',
            'bank_account_holder_name' => 'required|string',
            'is_commercial_bank' => 'required',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        
        // Check if bank details already exist
    if (BankDetail::where('security_id', $request->security_id)->exists()) {
        return response()->json([
            'message' => 'Bank details already exist for this security personnel'
        ], 409);
    }

    
       // Create new bank details
    $bankDetail = BankDetail::create([
        'security_id' => $request->security_id,
        'bank_name' => $request->bank_name,
        'bank_branch' => $request->bank_branch,
        'account_number' => $request->account_number,
        'bank_account_holder_name' => $request->bank_account_holder_name,
        'is_commercial_bank' => filter_var($request->is_commercial_bank, FILTER_VALIDATE_BOOLEAN),

    ]);
    return response()->json($bankDetail, 201);

    }

    /**
     * Display the specified resource.
     */
    public function show(BankDetail $bankDetail)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(BankDetail $bankDetail)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateBankDetailRequest $request, $id)
    {
        // Attempt to find the bank detail by the given security ID
        $bankDetail = BankDetail::where('security_id', $id)->first();

        // If the bank detail doesn't exist, create a new one
        if (!$bankDetail) {
            $bankDetail = new BankDetail();
            $bankDetail->security_id = $id;
        }

        // Validate the request data
        $validator = Validator::make($request->all(), [
            'bank_name' => 'sometimes|required|string',
            'bank_branch' => 'sometimes|required|string',
            'bank_account_holder_name' => 'sometimes|required|string',
            'is_commercial_bank' => 'sometimes|required',
            'account_number' => 'sometimes|required|string',
            'security_id' => [
                'required',
                'string',
                Rule::exists('securities', 'securityId'),
            ],
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $validated = $validator->validated();

        // Ensure boolean value is properly cast
        if (isset($validated['is_commercial_bank'])) {
            $validated['is_commercial_bank'] = filter_var($validated['is_commercial_bank'], FILTER_VALIDATE_BOOLEAN);
        }

        $bankDetail->fill($validated);
        $bankDetail->save();

        return response()->json($bankDetail);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(BankDetail $bankDetail)
    {
        //
    }
}
