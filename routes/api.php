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

Route::group(['middleware' => ['auth:sanctum', 'cors']],function () {

    Route::post('/logout', [AuthController::class, 'logout']);

    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    Route::apiResource('/users', UserController::class);


    // Route::get('/loan', function (Request $request) {
    //     return $request->user();
    // });

    Route::apiResource('/loans', LoanController::class);
    Route::put('/updateMpesaStatement/{id}', [LoanController::class, 'updateMpesaStatement']);
    Route::put('/updateStatus/{id}', [LoanController::class, 'updateStatus']);
    Route::put('/makeRepayment/{id}', [LoanController::class, 'makeRepayment']);
    Route::put('/setMaxCreditLimit/{id}', [LoanController::class, 'setMaxCreditLimit']);
    Route::put('/setNewLoanAmount/{id}', [LoanController::class, 'setNewLoanAmount']);
    Route::get('/downloadLoanFile/{id}', [LoanController::class, 'downloadLoanFile']);
    Route::get('/approvedLoans', [LoanController::class, 'approvedLoans']);
    Route::get('/pendingLoans', [LoanController::class, 'pendingLoans']);
    Route::get('/userStatement/{id}', [LoanController::class, 'userStatement']);
    
    
    Route::get('/adminDashboard', [AdminController::class, 'getDashBoardData']);
    
    Route::post('/uploadUserImage', [UserController::class, 'uploadImage']);
    Route::put('/disableUser/{id}', [UserController::class, 'disableUser']);
    Route::put('/usersUpdate/{id}', [UserController::class, 'usersUpdate']);

    Route::get('/getNotificationList/{id}', [UserController::class, 'getNotificationList']);
    Route::put('/makeAsRead/{id}', [UserController::class, 'makeAsRead']);
    Route::get('/userLoans/{id}', [UserController::class, 'userLoans']);
    Route::post('/createNewUser', [UserController::class, 'createNewUser']);
    Route::get('/getNotifications', [UserController::class, 'getNotifications']);
});

Route::post('/registerNewUser', [AuthController::class, 'registerNewUser']);
Route::post('/signup', [AuthController::class, 'signup']);
Route::post('/login', [AuthController::class, 'login']);
