<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\WorkOS\Http\Middleware\ValidateSessionWithWorkOS;
use App\Http\Controllers\SecurityController;
use App\Http\Controllers\WorkOSController;
use App\Http\Middleware\HandleInertiaRequests;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

// Route::get('/dashboard', function () {
//     return Inertia::render('dashboard');
// })->name('dashboard');

// Route::middleware(['auth'])->group(function () {

    Route::get('/dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    Route::get('/security-management', function () {
        return Inertia::render('SecurityManagment/index');
    })->middleware(['web', HandleInertiaRequests::class])->name('SecurityManagment');

    Route::get('/security-management/create-security', function () {
        return Inertia::render('SecurityManagment/CreateSecurity');
    })->middleware(['web', HandleInertiaRequests::class])->name('CreateSecurity');

    Route::get('/inventory-management', function () {
        return Inertia::render('InventoryManagment/index');
    })->middleware(['web', HandleInertiaRequests::class])->name('InventoryManagment');

    Route::get('/leave-management', function () {
        return Inertia::render('LeaveManagment/index');
    })->middleware(['web', HandleInertiaRequests::class])->name('LeaveManagment');

    Route::get('/leave-management/create-leave', function () {
        return Inertia::render('LeaveManagment/Createleave');
    })->middleware(['web', HandleInertiaRequests::class])->name('Createleave');

    Route::get('/shift-management', function () {
        return Inertia::render('ShiftManagement/index');
    })->middleware(['web', HandleInertiaRequests::class])->name('ShiftManagement');

    Route::get('/expense-management', function () {
        return Inertia::render('ExpenseManagment/index');
    })->middleware(['web', HandleInertiaRequests::class])->name('ExpenseManagment');


    Route::get('/payroll-management', function () {
        return Inertia::render('PayrolManagment/index');
    })->middleware(['web', HandleInertiaRequests::class])->name('PayrolManagment');


// });




// Route::get('/inventory-management/create-inventory', function () {
//     return Inertia::render('InventoryManagment/CreateInventory');
// })->name('CreateInventory');






Route::get('/workos-data', [WorkOSController::class, 'fetchData']);

require __DIR__.'/api.php';
require __DIR__.'/auth.php';

