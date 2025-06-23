<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\SecurityController;
use App\Http\Controllers\BankDetailController;
use App\Http\Controllers\LeaveController;
use App\Http\Controllers\LeaveBalanceController;
use App\Http\Controllers\InventoryTypeController;
use App\Http\Controllers\InventoryItemsController;
use App\Http\Controllers\InventoryTransactionController;
use App\Http\Controllers\SecurityAssetController;
use App\Http\Controllers\SecurityExpensesController;
use App\Http\Controllers\SecurityLoansController;
use App\Http\Controllers\LocationsController;
use App\Http\Controllers\SecurityLocationAllocationController;

use App\Http\Controllers\SecurityShiftLogController;
use App\Http\Controllers\SecurityBlackMarkController;
use App\Http\Controllers\SecurityCompensationController;
use App\Http\Controllers\PayrollController;


Route::apiResource('api/securities', SecurityController::class)->middleware(['auth']);
Route::get('api/all/securities', [SecurityController::class, 'getAllSecurities'])->middleware(['auth']);
// Route::apiResource('api/bank-details', BankDetailController::class)->withoutMiddleware(['auth:api']);

Route::prefix('api/bank-details')->middleware('auth')->group(function () {
    Route::get('/{securityId}', [BankDetailController::class, 'getBySecurity']);
    Route::post('/', [BankDetailController::class, 'store']);
    Route::put('/{id}', [BankDetailController::class, 'update']);
});

Route::middleware('auth')->prefix('api/termination')->group(function () {
    Route::post('/securities/{security}/resign', [SecurityController::class, 'resign']);
    Route::post('/securities/{security}/rehire', [SecurityController::class, 'rehire']);
});


Route::prefix('api/security-leaves')->middleware('auth')->group(function () {
    Route::get('/', [LeaveController::class, 'index']);
    Route::get('/security/{securityId}', [LeaveController::class, 'getLeavesBySecurity']);
    Route::get('/{id}', [LeaveController::class, 'show']);
    Route::post('/', [LeaveController::class, 'store']);
    Route::put('/{leave}', [LeaveController::class, 'update']);
    Route::delete('/{leave}', [LeaveController::class, 'destroy']);
});

Route::prefix('api/security-leave-balances')->middleware('auth')->group(function () {
    Route::get('/security/{securityId}', [LeaveBalanceController::class, 'getLeaveBalanceBySecurity']);
    Route::post('/', [LeaveBalanceController::class, 'store']);
});


Route::prefix('api/inventory')->middleware('auth')->group(function () {
    Route::get('/types', [InventoryTypeController::class, 'index']);
    Route::post('/', [InventoryItemsController::class, 'store']);
    Route::get('/', [InventoryItemsController::class, 'index']);
    Route::put('/{item}', [InventoryItemsController::class, 'update']);
    Route::post('/allocate', [InventoryTransactionController::class, 'store']);
    Route::post('/return', [InventoryTransactionController::class, 'returnInventory']);
    Route::get('/allocations', [InventoryTransactionController::class, 'allAllocatedInventories']);
    Route::get('/allocations/{securityId}', [InventoryTransactionController::class, 'allocatedInventoriesBySecurity']);
   
    //calculate expense from above
    Route::get('/allocations/current-month', [InventoryTransactionController::class, 'allocatedInventoriesForCurrentMonth']);
    Route::get('/allocations/current-month/{securityId}', [InventoryTransactionController::class, 'allocatedInventoriesForSecurityCurrentMonth']);
    //calculate expense from above

    Route::post('/asign-asset', [SecurityAssetController::class, 'allocateInventory']);
    Route::post('/return-asset', [SecurityAssetController::class, 'returnInventory']);
    Route::get('/security/{securityId}', [SecurityAssetController::class, 'getCurrentInventory']);
});


Route::prefix('api/expenses')->middleware('auth')->group(function () {
    Route::get('/security', [SecurityExpensesController::class, 'index']);
    Route::post('/security', [SecurityExpensesController::class, 'store']);
    Route::put('/security/{securityExpense}', [SecurityExpensesController::class, 'update']);
    Route::delete('/security/{securityExpense}', [SecurityExpensesController::class, 'destroy']);
    Route::get('/security/{securityId}', [SecurityExpensesController::class, 'getBySecurity']);
    Route::get('/security/{securityId}/current-month', [SecurityExpensesController::class, 'getCurrentMonthExpenseBySecurity']);
});

Route::prefix('api/loans')->middleware('auth')->group(function () {
    Route::get('/security', [SecurityLoansController::class, 'index']);
    Route::post('/security', [SecurityLoansController::class, 'store']);
    Route::put('/security/{securityLoan}', [SecurityLoansController::class, 'update']);
    Route::delete('/security/{securityLoan}', [SecurityLoansController::class, 'destroy']);
    Route::get('/security/{securityId}', [SecurityLoansController::class, 'getBySecurity']);
    Route::get('/security/{securityId}/current-month', [SecurityLoansController::class, 'getActiveLoansBySecurity']);
    Route::get('/security/{securityId}/current-month/payroll', [SecurityLoansController::class, 'getLoansForPayroll']);
});

Route::prefix('api/locations')->middleware('auth')->group(function () {
    Route::get('/', [LocationsController::class, 'index']);
    
    // Create a new location (POST /api/locations)
    Route::post('/', [LocationsController::class, 'store']);
    
    // Update a location (PUT/PATCH /api/locations/{id})
    Route::put('/{location}', [LocationsController::class, 'update']);
    Route::patch('/{location}', [LocationsController::class, 'update']);
    
    // Delete a location (DELETE /api/locations/{id})
    Route::delete('/{location}', [LocationsController::class, 'destroy']);
});


Route::prefix('api/locations-allocations')->middleware('auth')->group(function () {
    Route::get('/', [SecurityLocationAllocationController::class, 'index']);
    
    Route::post('/allocate-security', [SecurityLocationAllocationController::class, 'store']); // Assign security to location
    Route::delete('/remove-allocation/{securityId}/{locationId}', [SecurityLocationAllocationController::class, 'destroy']); // Unassign security from location
    // Routes to fetch allocated locations and securities
    Route::get('/security/{securityId}/locations', [SecurityLocationAllocationController::class, 'getAllocatedLocationsToSecurity']);  // Get all locations assigned to a security
    Route::get('/location/{locationId}/securities', [SecurityLocationAllocationController::class, 'getAllocatedSecuritiesToLocation']);  // Get all securities assigned to a location
});


Route::prefix('api/log-shift')->middleware('auth')->group(function () {
    Route::get('/', [SecurityShiftLogController::class, 'index']); // Get all shifts

    Route::get('/security/{securityId}', [SecurityShiftLogController::class, 'getBySecurityId']); // Get shifts by security ID
    Route::get('/location/{locationId}', [SecurityShiftLogController::class, 'getByLocationId']); // Get shifts by location ID
    Route::get('/security/{securityId}/current-month', [SecurityShiftLogController::class, 'getCurrentMonthShiftsForSecurity']); // Get current month's shifts for a security

    Route::post('/create', [SecurityShiftLogController::class, 'store']); // Create a new shift
    Route::put('/update/{id}', [SecurityShiftLogController::class, 'update']); // Update a shift
    Route::delete('/delete/{id}', [SecurityShiftLogController::class, 'destroy']); // Delete a shift
});

Route::prefix('api/security-black-marks')->middleware('auth')->group(function () {
    
    Route::get('/', [SecurityBlackMarkController::class, 'index']);
    Route::post('/', [SecurityBlackMarkController::class, 'store']);
    Route::put('/{id}', [SecurityBlackMarkController::class, 'update']);
    Route::delete('/{securityBlackMark}', [SecurityBlackMarkController::class, 'destroy']);
    // Pending black marks (not deductible)

    Route::get('/current-month/pending', [SecurityBlackMarkController::class, 'pendingCurrentMonthBlackMarks']);
    Route::get('/current-month/pending/{security_id}', [SecurityBlackMarkController::class, 'pendingCurrentMonthBlackMarksForSecurity']);

    // Completed black marks (deductible)
    Route::get('/current-month/deductible', [SecurityBlackMarkController::class, 'deductibleCurrentMonthBlackMarks']);
    Route::get('/current-month/deductible/{security_id}', [SecurityBlackMarkController::class, 'deductibleCurrentMonthBlackMarksForSecurity']);

});


Route::prefix('api/compensation')->middleware('auth')->group(function () {
    Route::get('/', [SecurityCompensationController::class, 'index']);
    Route::post('/', [SecurityCompensationController::class, 'store']);
    Route::put('/{compensation}', [SecurityCompensationController::class, 'update']);
    Route::delete('/{compensation}', [SecurityCompensationController::class, 'destroy']);

    Route::get('/current-month/{security_id}', [SecurityCompensationController::class, 'getCurrentMonthCompensations']);
    

});

Route::prefix('api/payrolls')->middleware('auth')->group(function () {
    // Basic CRUD routes
    Route::get('/', [PayrollController::class, 'index']);
    Route::post('/', [PayrollController::class, 'store']);
    Route::put('/{payroll}', [PayrollController::class, 'update']);
    
    // Month-based routes
    Route::get('/month/{month}', [PayrollController::class, 'getByMonth']);
    
    // Security-specific routes
    Route::get('/security/{securityId}', [PayrollController::class, 'getBySecurity']);
    Route::get('/security/{securityId}/month/{month}', [PayrollController::class, 'getBySecurityAndMonth']);
});