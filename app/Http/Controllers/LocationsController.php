<?php

namespace App\Http\Controllers;

use App\Models\Locations;
use App\Http\Requests\StoreLocationsRequest;
use App\Http\Requests\UpdateLocationsRequest;

class LocationsController extends Controller
{

    public function index()
    {
        // return Locations::with('securities')->get();
        return Locations::with(['securities' => function ($query) {
            $query->select('securityId', 'securityName', 'securityType');
        }])->get();
    }

    public function store(StoreLocationsRequest $request)
    {
        $request->validate([
            'locationName' => 'required|string',
            'locationType' => 'required|string',
            'address' => 'required|string',
            'isJkPropLocation' => 'required|boolean',
            'billing_OIC_HourlyRate' => 'required|numeric',
            'billing_JSO_HourlyRate' => 'required|numeric',
            'billing_CSO_HourlyRate' => 'required|numeric',
            'billing_LSO_HourlyRate' => 'required|numeric',
            'billing_SSO_HourlyRate' => 'required|numeric',
            
            'paying_OIC_HourlyRate' => 'required|numeric',
            'paying_JSO_HourlyRate' => 'required|numeric',
            'paying_CSO_HourlyRate' => 'required|numeric',
            'paying_LSO_HourlyRate' => 'required|numeric',
            'paying_SSO_HourlyRate' => 'required|numeric',
        ]);

        $newLocation = Locations::create($request->all());

        return response()->json([
            'success' => true,
            'message' => 'Location created successfully.',
            'data' => $newLocation
        ], 201);
    }

    public function update(UpdateLocationsRequest $request, Locations $location)
    {
        $validated = $request->validate([
            'locationName' => 'required|string',
            'locationType' => 'required|string',
            'address' => 'required|string',
            'isJkPropLocation' => 'required|boolean',
            'billing_OIC_HourlyRate' => 'required|numeric',
            'billing_JSO_HourlyRate' => 'required|numeric',
            'billing_CSO_HourlyRate' => 'required|numeric',
            'billing_LSO_HourlyRate' => 'required|numeric',
            'billing_SSO_HourlyRate' => 'required|numeric',//payment needed be get from customer for shift

            'paying_OIC_HourlyRate' => 'required|numeric',
            'paying_JSO_HourlyRate' => 'required|numeric',
            'paying_CSO_HourlyRate' => 'required|numeric',
            'paying_LSO_HourlyRate' => 'required|numeric',
            'paying_SSO_HourlyRate' => 'required|numeric', //payment needed be made for security for shift
        ]);
    
        $location->update($validated);
    
        return response()->json([
            'message' => 'Location updated successfully.',
            'location' => $location,
        ]);
    }

    public function destroy(Locations $location)
    {
        $location->delete();
        return response()->json(['message' => 'location deleted']);
    }
}
