<?php

namespace App\Http\Controllers;

use App\Models\InventoryItems;
use App\Models\InventoryType;

use App\Http\Requests\StoreInventoryItemsRequest;
use App\Http\Requests\UpdateInventoryItemsRequest;

class InventoryItemsController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
       $items = InventoryItems::with('inventoryType')->get();
        return response()->json($items);
        
        // $inventoryItems = InventoryItems::all();
        // return response()->json($inventoryItems);
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
    public function store(StoreInventoryItemsRequest $request)
    {
        
        $validated = $request->validate([
            'inventory_type_id' => 'required|exists:inventory_types,id',
            'size' => 'nullable|string',
            'quantity' => 'required|integer|min:1',
            'purchase_price' => 'required|numeric|min:0',
            'purchase_date' => 'required|date',
            'last_restocked_at' => 'nullable|date',
        ]);

        $type = InventoryType::find($validated['inventory_type_id']);

        if ($type->track_size && empty($validated['size'])) {
            return back()->withErrors(['size' => 'Size is required for this item type']);
        }

        // Check if identical item exists (same type, size, condition)
        $item = InventoryItems::where('inventory_type_id', $validated['inventory_type_id'])
            ->where('size', $validated['size'])
            ->where('condition', 'new')
            ->first();

        if ($item) {
            // Update existing item
            $item->update([
                'quantity' => $item->quantity + $validated['quantity'],
                'last_restocked_at' =>  $validated['last_restocked_at'],
                'is_available' => true
            ]);
        } else {
            // Create new item
            $item = InventoryItems::create([
                'inventory_type_id' => $validated['inventory_type_id'],
                'size' => $validated['size'],
                'quantity' => $validated['quantity'],
                'purchase_price' => $validated['purchase_price'],
                'purchase_date' => $validated['purchase_date'],
                'last_restocked_at' =>  $validated['purchase_date']
            ]);
        }

        return response()->json($item, 201);

        // return redirect()->route('inventory.items.index')
        //     ->with('success', 'Inventory item added');
    
    }

    /**
     * Display the specified resource.
     */
    public function show(InventoryItems $inventoryItems)
    {}

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(InventoryItems $inventoryItems)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateInventoryItemsRequest $request, InventoryItems $inventoryItems)
    {
        
    $validated = $request->validated(); // Already validated in UpdateInventoryItemsRequest

    $inventoryItemId = $request->id;
    $inventoryItems = InventoryItems::where('id', $inventoryItemId)->first();

    $type = InventoryType::find($validated['inventory_type_id']);

    if ($type->track_size && empty($validated['size'])) {
        return back()->withErrors(['size' => 'Size is required for this item type']);
    }

    $inventoryItems->update([
        'inventory_type_id' => $validated['inventory_type_id'],
        'size' => $validated['size'],
        'condition' => $validated['condition'],
        'quantity' => $validated['quantity'],
        'purchase_price' => $validated['purchase_price'],
        'purchase_date' => $validated['purchase_date'],
        'is_available' => $validated['is_available'],
    ]);

    return response()->json([$inventoryItems], 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(InventoryItems $inventoryItems)
    {
        //
    }
}
