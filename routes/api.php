<?php

use App\Http\Controllers\Api\AdminController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\LoanController;
use App\Http\Controllers\Api\UserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:sanctum')->group(function () {

    Route::post('/logout', [AuthController::class, 'logout']);

    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    Route::apiResource('/users', UserController::class);


    // Route::get('/loan', function (Request $request) {
    //     return $request->user();
    // });

    Route::apiResource('/loans', LoanController::class);
    Route::put('/updateStatus/{id}', [LoanController::class, 'updateStatus']);
    Route::put('/makeRepayment/{id}', [LoanController::class, 'makeRepayment']);
    Route::put('/setMaxCreditLimit/{id}', [LoanController::class, 'setMaxCreditLimit']);
    
    
    Route::get('/adminDashboard', [AdminController::class, 'getDashBoardData']);
    
    Route::post('/uploadUserImage', [UserController::class, 'uploadImage']);
    Route::put('/disableUser/{id}', [UserController::class, 'disableUser']);
    Route::put('/usersUpdate/{id}', [UserController::class, 'usersUpdate']);

    Route::get('/getNotification/{id}', [UserController::class, 'getNotification']);
    Route::put('/makeAsRead/{id}', [UserController::class, 'makeAsRead']);
});

Route::post('/registerNewUser', [AuthController::class, 'registerNewUser']);
Route::post('/signup', [AuthController::class, 'signup']);
Route::post('/login', [AuthController::class, 'login']);
