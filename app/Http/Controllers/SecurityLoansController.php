<?php

namespace App\Http\Controllers;

use App\Models\SecurityLoans;
use App\Http\Requests\StoreSecurityLoansRequest;
use App\Http\Requests\UpdateSecurityLoansRequest;
use Illuminate\Http\Request;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class SecurityLoansController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $securityLoans = SecurityLoans::with(['security:securityId,securityName'])->get();
       
        return response()->json($securityLoans);
    }

    public function getBySecurity($securityId)
    {
        $loans = SecurityLoans::where('security_id', $securityId)->orderBy('start_date', 'desc')->get();
        return response()->json($loans);
    }

    public function getActiveLoansBySecurity($securityId)
    {
        $now = Carbon::now();
        $loans = SecurityLoans::where('security_id', $securityId)
            ->whereDate('start_date', '<=', $now)
            ->whereDate(DB::raw("DATE_ADD(start_date, INTERVAL installments MONTH)"), '>=', $now)
            ->orderBy('start_date', 'desc')
            ->get();

        return response()->json($loans);
    }
    
    public function getLoansForPayroll(Request $request, $securityId)
    {
        // $today = Carbon::now();
        $dateInput = $request->query('date');
        $today =  $dateInput ? Carbon::parse($dateInput) : Carbon::now();
        $currentMonthEnd = $today->copy()->endOfMonth();
        $currentMonthStart = $today->copy()->startOfMonth();

        $loans = SecurityLoans::where('security_id', $securityId)
            ->where(function ($query) use ($currentMonthStart, $currentMonthEnd) {
                $query->where('start_date', '<=', $currentMonthEnd)
                    ->where(function($q) use ($currentMonthStart) {
                        $q->where(function($sub) use ($currentMonthStart) {
                            // SQLite compatible date calculation
                            $sub->whereRaw(
                                "date(start_date, '+' || (installments - 1) || ' months') >= ?",
                                [$currentMonthStart->format('Y-m-d')]
                            );
                        })
                        ->orWhereNull('installments');
                    });
            })
            ->get();

        foreach ($loans as $loan) {
            $loan->installment_amount = round($loan->total_amount / $loan->installments, 2);
        }

        return response()->json($loans);
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
    public function store(StoreSecurityLoansRequest $request)
    {
        $validated = $request->validate([
            'security_id' => 'required|exists:securities,securityId',
            'total_amount' => 'required|numeric|min:1',
            'installments' => 'required|integer|min:1',
            'start_date' => 'required|date',
            'description' => 'nullable|string',
        ]);

        $loan = SecurityLoans::create($validated);
        return response()->json($loan, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(SecurityLoans $securityLoans)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(SecurityLoans $securityLoans)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateSecurityLoansRequest $request, SecurityLoans $securityLoan)
    {
        $validated = $request->validate([
            'total_amount' => 'required|numeric|min:1',
            'installments' => 'required|integer|min:1',
            'start_date' => 'required|date',
            'description' => 'nullable|string',
        ]);

        $securityLoan->update($validated);
        return response()->json($securityLoan);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(SecurityLoans $securityLoan)
    {
        $securityLoan->delete();
        return response()->json(['message' => 'Loan deleted']);
    }
}
