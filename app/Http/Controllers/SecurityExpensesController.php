<?php

namespace App\Http\Controllers;

use App\Models\SecurityExpenses;
use App\Http\Requests\StoreSecurityExpensesRequest;
use App\Http\Requests\UpdateSecurityExpensesRequest;
use Illuminate\Http\Request;
use Carbon\Carbon;


class SecurityExpensesController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // $securityExpenses = SecurityExpenses::all();
        $securityExpenses = SecurityExpenses::with(['security:securityId,securityName'])->get();
        // $leaves = Leave::with('security')->get();
        return response()->json($securityExpenses);   
    }

    public function getBySecurity($securityId)
    {
        $expenses = SecurityExpenses::where('security_id', $securityId)->orderBy('date', 'desc')->get();
        return response()->json($expenses);
    }

    /**
     * fetched current month expeses
     */
    public function getCurrentMonthExpenseBySecurity(Request $request, $securityId)
    {
        // $now = Carbon::now();
        $dateInput = $request->query('date');
        $now =  $dateInput ? Carbon::parse($dateInput) : Carbon::now();
        $expenses = SecurityExpenses::where('security_id', $securityId)
            ->whereMonth('date', $now->month)
            ->whereYear('date', $now->year)
            ->orderBy('date', 'desc')
            ->get();

        return response()->json($expenses);
    }

    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreSecurityExpensesRequest $request)
    {
        $validated = $request->validate([
            'security_id' => 'required|exists:securities,securityId',
            'type' => 'required|in:Food,Travel,Accommodation,Advances',
            'description' => 'nullable|string',
            'date' => 'required|date',
            'amount' => 'required|numeric|min:0',
        ]);

        $expense = SecurityExpenses::create($validated);

        return response()->json($expense, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(SecurityExpenses $securityExpenses)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(SecurityExpenses $securityExpenses)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateSecurityExpensesRequest $request, SecurityExpenses $securityExpense)
    {
        $validated = $request->validate([
            'type' => 'required|in:Food,Travel,Accommodation,Advances',
            'description' => 'nullable|string',
            'date' => 'required|date',
            'amount' => 'required|numeric|min:0',
        ]);

        $securityExpense->update($validated);
        return response()->json($securityExpense);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(SecurityExpenses $securityExpense)
    {
        $securityExpense->delete();
        return response()->json([
            'message' => 'Expense deleted',
            'data' => $securityExpense
        ]);
    }
}
