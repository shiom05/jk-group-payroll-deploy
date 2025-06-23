<?php

namespace App\Http\Controllers;

use App\Models\InventoryType;
use App\Http\Requests\StoreInventoryTypeRequest;
use App\Http\Requests\UpdateInventoryTypeRequest;

class InventoryTypeController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $inventoryTypes = InventoryType::all();
        return response()->json($inventoryTypes);
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
    public function store(StoreInventoryTypeRequest $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(InventoryType $inventoryType)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(InventoryType $inventoryType)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateInventoryTypeRequest $request, InventoryType $inventoryType)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(InventoryType $inventoryType)
    {
        //
    }
}
