<?php

namespace App\Http\Controllers;

use App\Models\Leave;
use App\Models\LeaveBalance;
use App\Models\Security;
use App\Http\Requests\StoreLeaveRequest;
use App\Http\Requests\UpdateLeaveRequest;

class LeaveController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $leaves = Leave::with('security')->get();
        return response()->json($leaves);
    }

    public function getLeavesBySecurity($securityId)
    {
        $leaves = Leave::where('security_id', $securityId)->get();
        return response()->json($leaves);
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
    public function store(StoreLeaveRequest $request)
    {
        $request->validate([
            'security_id' => 'required|exists:securities,securityId',
            'leave_type' => 'required|in:Annual,Sick,Casual',
            'reason' => 'required|string',
            'description' => 'nullable|string',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
        ]);

        $leave = Leave::create($request->all());

        // Update the leave balance
        // $this->updateLeaveBalance($leave);

        return response()->json($leave, 201); 

    }

    /**
     * Display the specified resource.
     */
    public function show(Leave $leave)
    {
        $leave->load('security'); // Eager load the related security info
        return response()->json($leave);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Leave $leave)
    {
       
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateLeaveRequest $request, Leave $leave)
    {
        $validated = $request->validate([
            'security_id' => 'required|exists:securities,securityId',
            'leave_type' => 'required|in:Annual,Sick,Casual',
            'reason' => 'required|string',
            'description' => 'nullable|string',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
        ]);
    
        $leave->update($validated);
    
        return response()->json([
            'message' => 'Leave updated successfully.',
            'leave' => $leave,
        ]);

        // Update the leave balance
        // $this->updateLeaveBalance($leave);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Leave $leave)
    {
        $leave->delete();
        return response()->json(['message' => 'leave deleted']);

    }

        // Helper function to update the leave balance after creating or editing a leave
        protected function updateLeaveBalance($leave)
        {
            $balance = LeaveBalance::where('security_id', $leave->security_id)->first();

            if ($balance) {
                switch ($leave->leave_type) {
                    case 'Annual':
                        $balance->annual_used += $leave->start_date->diffInDays($leave->end_date) + 1;
                        break;
                    case 'Sick':
                        $balance->sick_used += $leave->start_date->diffInDays($leave->end_date) + 1;
                        break;
                    case 'Casual':
                        $balance->casual_used += $leave->start_date->diffInDays($leave->end_date) + 1;
                        break;
                }

                $balance->save();
            }
        }
}
