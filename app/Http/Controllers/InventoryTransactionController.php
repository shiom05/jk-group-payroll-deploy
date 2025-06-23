<?php

namespace App\Http\Controllers;

use App\Models\InventoryTransaction;
use App\Http\Requests\StoreInventoryTransactionRequest;
use App\Http\Requests\UpdateInventoryTransactionRequest;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;

use Illuminate\Support\Facades\Schema;
use App\Models\InventoryItems;
use Carbon\Carbon; 

class InventoryTransactionController extends Controller
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

    public function allAllocatedInventories()
    {
        $allocations = InventoryTransaction::with(['items', 'security'])
            ->where('type', 'allocation')
            ->orderBy('transaction_date', 'desc')
            ->get();

        return response()->json([
            'message' => 'All allocated inventories retrieved successfully.',
            'data' => $allocations
        ]);
    }

    public function allocatedInventoriesBySecurity($securityId)
    {
        $allocations = InventoryTransaction::with(['items', 'security'])
            ->where('type', 'allocation')
            ->where('security_id', $securityId)
            ->orderBy('transaction_date', 'desc')
            ->get();

        return response()->json([
            'message' => "Allocated inventories for Security ID: $securityId retrieved successfully.",
            'data' => $allocations
        ]);
    }

        public function allocatedInventoriesForCurrentMonth()
        {
            $now = Carbon::now(); // Current date and time
            $startOfMonth = $now->copy()->startOfMonth()->toDateString();
            $endOfMonth = $now->copy()->endOfMonth()->toDateString();

            $allocations = InventoryTransaction::with(['items', 'security'])
                ->where('type', 'allocation')
                ->whereBetween('transaction_date', [$startOfMonth, $endOfMonth])
                ->orderBy('transaction_date', 'asc')
                ->get();

            return response()->json([
                'message' => "Allocated inventories for the month of " . $now->format('F') . " retrieved successfully.",
                'data' => $allocations
            ]);
        }

        public function allocatedInventoriesForSecurityCurrentMonth(Request $request, $securityId)
        {
            // $now = Carbon::now();
            $dateInput = $request->query('date');
            $now =  $dateInput ? Carbon::parse($dateInput) : Carbon::now(); 
            $currentMonthStart = $now->copy()->startOfMonth();
            $currentMonthEnd = $now->copy()->endOfMonth();

            // Get all allocations in current month 
            $allocations = InventoryTransaction::with(['items', 'security'])
                ->where('type', 'allocation')
                ->where('security_id', $securityId)
                ->where(function ($query) use ($currentMonthStart, $currentMonthEnd) {
                            $query->where('start_date', '<=', $currentMonthEnd)
                                ->where(function($q) use ($currentMonthStart) {
                                    $q->where(function($sub) use ($currentMonthStart) {
                                        $sub->whereRaw(
                                            "date(start_date, '+' || (installments - 1) || ' months') >= ?",
                                            [$currentMonthStart->format('Y-m-d')]
                                        );
                                    })
                                    ->orWhereNull('installments');
                                });
            })->get();

            $totalCost = $allocations->sum('total_value');

            $totalInstallmentPayments = $allocations->sum(function($allocation) {
                return $allocation->getTotalValueAttributePerInstallment();
            });

            return response()->json([
                'message' => "Active allocated inventories for Security ID: {$securityId} in " . $now->format('F') . " retrieved successfully.",
                'total_allocated_value' => $totalCost,
                'total_installment_payments' => $totalInstallmentPayments,
                'data' => $allocations,
            ]);
        }

        public function returnInventory(Request $request)
        {
            $validated = $request->validate([
                'security_id' => 'required|exists:securities,securityId',
                'items' => 'required|array|min:1',
                'items.*.id' => 'required|exists:inventory_items,id',
                'items.*.quantity' => 'required|integer|min:1',
                'transaction_date' => 'required|date',
            ]);

            return DB::transaction(function () use ($validated) {
                $transaction = InventoryTransaction::create([
                    'type' => 'return',
                    'security_id' => $validated['security_id'],
                    'transaction_date' => $validated['transaction_date'],
                    'notes' => "Return items"
                ]);

                foreach ($validated['items'] as $item) {
                    $originalItem = InventoryItems::find($item['id']);

                    // Search for an existing returned item with the same inventory_type_id and size
                    $existingReturnedItem = InventoryItems::where('inventory_type_id', $originalItem->inventory_type_id)
                        ->where('size', $originalItem->size)
                        ->where('condition', 'returned')
                        ->first();

                    if ($existingReturnedItem) {
                        // Just increase the quantity
                        $existingReturnedItem->quantity += $item['quantity'];
                        $existingReturnedItem->save();

                        $usedItem = $existingReturnedItem;
                    } else {
                        // Create a new returned item record
                        $returnedItem = $originalItem->replicate();
                        $returnedItem->purchase_price =  $originalItem->purchase_price / 2;
                        $returnedItem->condition = 'returned';
                        $returnedItem->quantity = $item['quantity'];
                        $returnedItem->is_available = true; // you might want to explicitly mark it available
                        $returnedItem->save();

                        $usedItem = $returnedItem;
                    }

                    // Log the return in inventory transactions
                    $transaction->items()->create([
                        'inventory_item_id' => $usedItem->id,
                        'quantity' => $item['quantity'],
                        'unit_price' => $usedItem->current_value,
                        'condition' => 'returned'
                    ]);
                }

                return response()->json([
                    'message' => 'Items returned successfully',
                    'transaction_id' => $transaction->id,
                    'transaction'=> $transaction
                ]);
            });
        }



   
   
    //     public function returnInventory(Request $request)
    // {
    //     $validated = $request->validate([
    //         'security_id' => 'required|exists:securities,securityId',
    //         'items' => 'required|array|min:1',
    //         'items.*.id' => 'required|exists:inventory_items,id',
    //         'items.*.quantity' => 'required|integer|min:1',
    //         'transaction_date' => 'required|date',
    //     ]);

    //     return DB::transaction(function () use ($validated) {
    //         $returnTransaction = InventoryTransaction::create([
    //             'type' => 'return',
    //             'security_id' => $validated['security_id'],
    //             'transaction_date' => $validated['transaction_date'],
    //             'notes' => "Return items"
    //         ]);

    //         $totalValueReturned = 0;
    //         $originalAllocations = [];

    //         foreach ($validated['items'] as $item) {
    //             $originalItem = InventoryItems::find($item['id']);

    //             $returnedItem = InventoryItems::firstOrCreate(
    //                 [
    //                     'inventory_type_id' => $originalItem->inventory_type_id,
    //                     'size' => $originalItem->size,
    //                     'condition' => 'returned'
    //                 ],
    //                 [
    //                     'purchase_price' => $originalItem->purchase_price / 2,
    //                     'purchase_date' => $originalItem->purchase_date,
    //                     'quantity' => 0,
    //                     'is_available' => true,
    //                     'last_restocked_at' => now()
    //                 ]
    //             );

    //             $returnedItem->increment('quantity', $item['quantity']);

    //             $returnTransaction->items()->create([
    //                 'inventory_item_id' => $returnedItem->id,
    //                 'quantity' => $item['quantity'],
    //                 'unit_price' => $returnedItem->current_value,
    //                 'condition' => 'returned'
    //             ]);

        
    //             // $allocations = InventoryTransaction::where('type', 'allocation')
    //             //     ->where('security_id', $validated['security_id'])
    //             //     ->whereHas('items', function($q) use ($originalItem) {
    //             //         $q->where('inventory_item_id', $originalItem->id);
    //             //     })
    //             //     ->with('items')
    //             //     ->get();

    //             // foreach ($allocations as $allocation) {
    //             //     $valueReturned = $item['quantity'] * $originalItem->purchase_price;
    //             //     $totalValueReturned += $valueReturned;

    //             //     $originalAllocations[$allocation->id] = [
    //             //         'allocation' => $allocation,
    //             //         'value_returned' => $valueReturned,
    //             //         'items_returned' => $item['quantity']
    //             //     ];
    //             // } //ask how you deduct returns from monthly installments
    //         }

    //         // foreach ($originalAllocations as $data) {
    //         //     $allocation = $data['allocation'];
    //         //     $valueReturned = $data['value_returned'];
                
    //         //     $returnDate = Carbon::parse($validated['transaction_date']);
    //         //     $startDate = Carbon::parse($allocation->start_date);
                
    //         //     if ($returnDate > $startDate) {
    //         //         $monthsPassed = $startDate->diffInMonths($returnDate);
    //         //         $remainingInstallments = $allocation->installments - $monthsPassed;
                    
    //         //         if ($remainingInstallments > 0) {
    //         //             $originalTotal = $allocation->total_value;
    //         //             $remainingValue = $originalTotal - $valueReturned;
    //         //             $newInstallment = round($remainingValue / $remainingInstallments, 2);
                        
    //         //             $allocation->update([
    //         //                 'total_value' => $remainingValue,
    //         //                 'installments' => $remainingInstallments
    //         //             ]);
    //         //         }
    //         //     }
    //         // }

    //         return response()->json([
    //             'message' => 'Items returned and payments adjusted successfully',
    //             'transaction_id' => $returnTransaction->id,
    //             // 'total_value_returned' => $totalValueReturned,
    //             // 'adjusted_allocations' => $originalAllocations
    //         ]);
    //     });
    // }


    public function store(StoreInventoryTransactionRequest $request)
    {
        $validated = $request->validate([
            'security_id' => 'required|exists:securities,securityId',
            'items' => 'required|array|min:1',
            'items.*.id' => 'required|exists:inventory_items,id',
            'items.*.quantity' => 'required|integer|min:1',
            'transaction_date' => 'required|date',
            'installments' => 'required|integer|min:1',
            'start_date' => 'required|date',
        ]);

        return DB::transaction(function () use ($validated) {
            $transaction = InventoryTransaction::create([
                'type' => 'allocation',
                'security_id' => $validated['security_id'],
                'transaction_date' => $validated['transaction_date'],
                'installments' => $validated['installments'],
                'start_date' => $validated['start_date'],
            ]);

            foreach ($validated['items'] as $item) {
                $inventoryItem = InventoryItems::find($item['id']);
                
                if ($inventoryItem->quantity < $item['quantity']) {
                    throw new \Exception("Not enough stock for {$inventoryItem->type->name}");
                }

                $transaction->items()->create([
                    'inventory_item_id' => $inventoryItem->id,
                    'quantity' => $item['quantity'],
                    'unit_price' => $inventoryItem->current_value,
                    'condition' => $inventoryItem->condition
                ]);

                $inventoryItem->decrement('quantity', $item['quantity']);
            }

            return response()->json([
                'message' => 'Inventory allocated successfully',
                'transaction_id' => $transaction->id
            ]);
        });
    }

    /**
     * Display the specified resource.
     */
    public function show(InventoryTransaction $inventoryTransaction)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(InventoryTransaction $inventoryTransaction)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateInventoryTransactionRequest $request, InventoryTransaction $inventoryTransaction)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(InventoryTransaction $inventoryTransaction)
    {
        //
    }
}
