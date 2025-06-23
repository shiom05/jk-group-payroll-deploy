<?php

namespace App\Http\Controllers;

use App\Models\SecurityCompensation;
use App\Http\Requests\StoreSecurityCompensationRequest;
use App\Http\Requests\UpdateSecurityCompensationRequest;
use Carbon\Carbon;
use Illuminate\Http\Request;

class SecurityCompensationController extends Controller
{
    public function index(Request $request)
    {
        $query = SecurityCompensation::with('security')->latest(); 

        if ($request->has('security_id')) {
            $query->where('security_id', $request->security_id);
        }

        if ($request->has('month')) {
            $query->whereMonth('effective_date', $request->month);
        }

        return response()->json($query->get());
    }

    public function getCurrentMonthCompensations(Request $request, $security_id)
    {
        // $now = Carbon::now();
        $dateInput = $request->query('date');
        $now =  $dateInput ? Carbon::parse($dateInput) : Carbon::now();
        $startOfMonth = $now->copy()->startOfMonth()->toDateTimeString();
        $endOfMonth = $now->copy()->endOfMonth()->toDateTimeString();

        $compensations = SecurityCompensation::with(['security:securityId,securityName,securityType'])
            ->where('security_id', $security_id)
            ->whereBetween('effective_date', [$startOfMonth, $endOfMonth])
            ->latest()
            ->get();

        return response()->json($compensations);
    }

    public function store(StoreSecurityCompensationRequest $request)
    {
        $validated = $request->validate([
            'security_id' => 'required|exists:securities,securityId',
            'amount' => 'required|numeric|min:0',
            'reason' => 'required|string|max:500',
            'effective_date' => 'required|date',
        ]);

        $compensation = SecurityCompensation::create($validated);

        return response()->json($compensation, 201);
    }

    public function update(UpdateSecurityCompensationRequest $request, SecurityCompensation $compensation)
    {
        $validated = $request->validate([
            'amount' => 'required|numeric|min:0',
            'reason' => 'required|string|max:500',
            'effective_date' => 'required|date',
        ]);

        $compensation->update($validated);

        return response()->json($compensation);
    }

    public function destroy(SecurityCompensation $compensation)
    {
        $compensation->delete();
        return response()->json(['message' => 'Compensation deleted']);
    }
}
