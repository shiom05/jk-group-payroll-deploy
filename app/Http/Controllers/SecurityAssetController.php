<?php

namespace App\Http\Controllers;

use App\Models\SecurityAsset;
use App\Http\Requests\StoreSecurityAssetRequest;
use App\Http\Requests\UpdateSecurityAssetRequest;


use App\Models\InventoryItems;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class SecurityAssetController extends Controller
{
    public function allocateInventory(Request $request)
    {
        // Validate the request
        $validated = $request->validate([
            'security_id' => 'required|exists:securities,securityId',
            'items' => 'required|array|min:1',
            'items.*.inventory_item_id' => 'required|exists:inventory_items,id',
            'items.*.quantity' => 'required|integer|min:1',
        ]);

        return DB::transaction(function () use ($validated) {
            foreach ($validated['items'] as $item) {
                $securityAsset = SecurityAsset::where('security_id', $validated['security_id'])
                    ->where('inventory_item_id', $item['inventory_item_id'])
                    ->first();

                if ($securityAsset) {
                    $securityAsset->quantity += $item['quantity'];
                    $securityAsset->save();
                } else {
                    SecurityAsset::create([
                        'security_id' => $validated['security_id'],
                        'inventory_item_id' => $item['inventory_item_id'],
                        'quantity' => $item['quantity'],
                    ]);
                }
            }

            return response()->json(['message' => 'Items allocated successfully']);
        });
    }

    public function returnInventory(Request $request)
    {
        // Validate the request
        $validated = $request->validate([
            'security_id' => 'required|exists:securities,securityId',
            'items' => 'required|array|min:1',
            'items.*.inventory_item_id' => 'required|exists:inventory_items,id',
            'items.*.quantity' => 'required|integer|min:1',
        ]);

        return DB::transaction(function () use ($validated) {
            foreach ($validated['items'] as $item) {
                $securityAsset = SecurityAsset::where('security_id', $validated['security_id'])
                    ->where('inventory_item_id', $item['inventory_item_id'])
                    ->first();

                if (!$securityAsset || $securityAsset->quantity < $item['quantity']) {
                    return response()->json([
                        'message' => 'Return failed. Returning more than allocated',
                        'failed_item' => $item,
                         'securityAsset' =>  $securityAsset, 
                         '$validated'=> $validated,
                         '$securityAsset->quantity'=>$securityAsset->quantity,

                    ], 400);
                }

                $securityAsset->quantity -= $item['quantity'];

                if ($securityAsset->quantity === 0) {
                    $securityAsset->delete();
                } else {
                    $securityAsset->save();
                }
            }

            return response()->json(['message' => 'Items returned successfully', 'securityAsset' =>  $securityAsset, '$validated'=> $validated ]);
        });
    }

    public function getCurrentInventory($securityId)
    {
        $securityAssets = SecurityAsset::where('security_id', $securityId)
            ->with('inventoryItem.inventoryType')
            ->get();

        return response()->json([
            'message' => 'Current inventory for security fetched successfully.',
            'data' => $securityAssets
        ]);
    }

}
