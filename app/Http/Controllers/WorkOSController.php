<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class WorkOSController extends Controller
{
    public function fetchData()
    {
        $response = Http::withOptions([
            'verify' => false
        ])->get('https://api.workos.com/sso/authorize');
    }
}
