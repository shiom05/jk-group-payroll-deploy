<?php

namespace App\Http\Controllers;

use App\Models\Payroll;
use App\Models\Security;
use App\Http\Requests\StorePayrollRequest;
use App\Http\Requests\UpdatePayrollRequest;
use Illuminate\Support\Facades\Validator;

class PayrollController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
       $payrolls = Payroll::with('security')->latest()->get();
        return response()->json($payrolls);
    }

    public function getByMonth($month)
    {
        if (!preg_match('/^\d{4}-\d{2}$/', $month)) {
            return response()->json(['error' => 'Invalid month format. Use YYYY-MM'], 400);
        }

        $payrolls = Payroll::with(['security' => function ($query) {
            $query->select('securityId', 'securityName', 'securityType');
        }])
            ->where('payroll_month', $month)
            ->orderBy('security_id')
            ->get();

        return response()->json($payrolls);
    }

    public function getBySecurity($securityId)
    {
        $validator = Validator::make(
            ['security_id' => $securityId],
            ['security_id' => 'required|exists:securities,securityId']
        );

        if ($validator->fails()) {
            return response()->json(['error' => 'Invalid security ID'], 400);
        }

        $payrolls = Payroll::where('security_id', $securityId)
            ->orderBy('payroll_month', 'desc')
            ->get();

        return response()->json($payrolls);
    }

    public function getBySecurityAndMonth($securityId, $month)
    {
        // First validate month format
        if (!preg_match('/^\d{4}-\d{2}$/', $month)) {
            return response()->json(['error' => 'Invalid month format. Use YYYY-MM'], 400);
        }

        // Then check if security exists
        $securityExists = Security::where('securityId', $securityId)->exists();
        if (!$securityExists) {
            return response()->json(['error' => 'Security not found'], 404);
        }

        // Finally check for payroll
        $payroll = Payroll::where('security_id', $securityId)
            ->where('payroll_month', $month)
            ->first();

        if (!$payroll) {
            return response()->json([
                'message' => 'No payroll found for this security and month',
                'data' => null
            ], 200);
        }

        return response()->json([
                'message' => 'Payroll found for the security and month',
                'data' => $payroll
            ], 200);
    }

    public function store(StorePayrollRequest $request)
    {
          $validator = Validator::make($request->all(), [
            'payroll_month' => 'required|date_format:Y-m',
            'security_id' => 'required|exists:securities,securityId',
            'parameters' => 'required|array',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $payroll = Payroll::updateOrCreate(
            [
                'payroll_month' => $request->payroll_month,
                'security_id' => $request->security_id,
            ],
            [
                'calculated_at' => now(),
                'parameters' => $request->parameters,
            ]
        );

        return response()->json($payroll, 201);
    }

    public function update(UpdatePayrollRequest $request, Payroll $payroll)
    {
        $validator = Validator::make($request->all(), [
            'parameters' => 'required|array',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $payroll->update([
            'parameters' => $request->parameters,
            'calculated_at' => now(),
        ]);

        return response()->json($payroll);
    }

}
