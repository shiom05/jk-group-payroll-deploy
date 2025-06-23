<?php

namespace App\Http\Controllers;

use App\Models\LeaveBalance;

use App\Http\Requests\StoreLeaveBalanceRequest;
use App\Http\Requests\UpdateLeaveBalanceRequest;

class LeaveBalanceController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
       
    }

    public function getLeaveBalanceBySecurity($securityId)
    {
        $leaveBalances = LeaveBalance::where('security_id', $securityId)->get();
        return response()->json($leaveBalances);
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
    public function store(StoreLeaveBalanceRequest $request)
    {
        $validated = $request->validate([
            'security_id' => 'required|exists:securities,securityId|unique:leave_balances,security_id',
        ]);

        $leaveBalance = LeaveBalance::create([
            'security_id'   => $validated['security_id'],
            'annual_total'  => $validated['annual_total'] ?? 14,
            'sick_total'    => $validated['sick_total'] ?? 7,
            'casual_total'  => $validated['casual_total'] ?? 5,
            'annual_used'   => 0,
            'sick_used'     => 0,
            'casual_used'   => 0,
        ]);

        return response()->json($leaveBalance, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(LeaveBalance $leaveBalance)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(LeaveBalance $leaveBalance)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateLeaveBalanceRequest $request, LeaveBalance $leaveBalance)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(LeaveBalance $leaveBalance)
    {
        //
    }
}
