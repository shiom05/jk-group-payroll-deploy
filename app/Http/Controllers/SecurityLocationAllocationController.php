<?php

namespace App\Http\Controllers;

use App\Models\SecurityLocationAllocation;
use App\Models\Locations;
use App\Models\Security;
use App\Http\Requests\StoreSecurityLocationAllocationRequest;
use App\Http\Requests\UpdateSecurityLocationAllocationRequest;
use Illuminate\Support\Facades\DB;


class SecurityLocationAllocationController extends Controller
{
    
    public function index()
    {
        $allocations = SecurityLocationAllocation::with(['security', 'location'])->get();

        return response()->json($allocations);
    }

    public function getAllocatedLocationsToSecurity($securityId)
    {
        // Find the security and load associated locations
        $security = Security::with('locations')->findOrFail($securityId);

        return response()->json($security->locations);
    }

    public function getAllocatedSecuritiesToLocation($locationId)
    {
        // Find the location and load associated securities
        $location = Locations::with('securities')->findOrFail($locationId);

        return response()->json($location->securities);
    }

    public function store(StoreSecurityLocationAllocationRequest $request)
    {
        // Validate incoming data
        $request->validate([
            'security_id' => 'required|exists:securities,securityId',
            'location_id' => 'required|exists:locations,locationId',
        ]);

        // Create new allocation record
        $allocation = SecurityLocationAllocation::create($request->only(['security_id', 'location_id']));

        return response()->json($allocation, 201);
    }

    // Remove allocation (unassign a security from a location)
    public function destroy($securityId, $locationId)
    {
        $deleted = \DB::table('security_location_allocations')
        ->where('security_id', $securityId)
        ->where('location_id', $locationId)
        ->delete();

    if ($deleted) {
        return response()->json(['message' => 'Allocation removed successfully']);
    } else {
        return response()->json(['message' => 'No matching allocation found'], 404);
    }


    }
}
