<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\LoanFormDataRequest;
use App\Http\Requests\UpdateLoanAmountRequest;
use App\Http\Requests\UpdateLoanDataRequest;
use App\Http\Resources\LoanResource;
use App\Models\Loan;
use App\Models\LoanFile;
use App\Models\User;
use App\Notifications\LoanApplicationNotification;
use App\Notifications\LoanCreationAdminNotification;
use App\Notifications\LoanMaximumLimitNotification;
use App\Notifications\LoanOverdueNotification;
use App\Notifications\LoanStatusNotification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Notification;
use Carbon\Carbon;
use Illuminate\Support\Facades\Response;

class LoanController extends Controller
{
    //

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Resources\Json\AnonymousResourceCollection
     */
    public function index()
    {
        return LoanResource::collection(Loan::query()->orderBy('id', 'desc')->with('users')->paginate(10));
    }

    public function approvedLoans()
    {
        return LoanResource::collection(Loan::query()->orderBy('id', 'desc')->where('status_id', 2)->get());
    }

    public function pendingLoans()
    {
        return LoanResource::collection(Loan::query()->orderBy('id', 'desc')->where('status_id', 1)->get());
    }

    public function userStatement($id)
    {
        return LoanResource::collection(Loan::query()->orderBy('id', 'desc')->where('user_id', $id)->get());
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param \App\Http\Requests\StoreUserRequest $request
     * @return \Illuminate\Http\Response
     */
    public function store(LoanFormDataRequest $request)
    {
        $data = $request->validated();

        $loanAmountPlusInterest = ($data['loan_amount'] * 0.1) + $data['loan_amount'];

        $data['balance_amount'] = $loanAmountPlusInterest;
        $data['loan_amount_plus_interest'] = $loanAmountPlusInterest;
        $data['status_id'] = 1;

        $fileName = time() . '.' . $request->uploadfile->extension();
        $request->uploadfile->move(public_path('loanFiles'), $fileName);

        $data['file'] = $fileName;

        $loan = Loan::create($data);

        LoanFile::create([
            'title' => $fileName,
            'user_id' => $data['user_id'],
            'loan_id' => $loan->id,
        ]);

        $member = User::findOrFail($data['user_id']); // to be notified

        $user = [
            'id' => $loan->id,
            'description' => "Dear " . $member->name . ". Your Loan Application has been created successfully.",
            'name' => $member->name,
            'loan_id' => $loan->id,
        ];

        $member->notify(new LoanApplicationNotification($user));


        $adminUsers = User::where('role', 'admin')->get();

        $admins = [
            'id' => $loan->id,
            'description' => "Dear Admin. A Loan Application has been created. Check it out",
            'name' => $member->name,
            'loan_id' => $loan->id,
        ];

        Notification::send($adminUsers, new LoanCreationAdminNotification($admins));


        return response(new LoanResource($loan), 201);
    }

    /**
     * Display the specified resource.
     *
     * @param \App\Models\Loan $user
     * @return \Illuminate\Http\Response
     */
    public function show(Loan $loan)
    {
        return new LoanResource($loan);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param \App\Http\Requests\UpdateUserRequest $request
     * @param \App\Models\Loan                     $user
     * @return \Illuminate\Http\Response
     */
    public function update(UpdateLoanDataRequest $request, Loan $loan)
    {
        $data = $request->validated();

        $loan->update($data);

        return new LoanResource($loan);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param \App\Models\Loan $user
     * @return \Illuminate\Http\Response
     */
    public function destroy($id, Loan $user)
    {
        $loan = Loan::find($id);

        $loan->delete();

        return response("", 204);
    }

    public function updateStatus($id, UpdateLoanDataRequest $request)
    {
        $data = $request->validated();

        $loan = Loan::find($id);

        if ($data['status_id'] == 2) {
            $data['due_payment_date'] = Carbon::now()->addMonth();
            $data['approved_date'] = Carbon::now();
        }

        $loan->update($data);

        if ($data['status_id'] == 3) {

            $member = User::findOrFail($loan->user_id); // to be notified

            $user = [
                'id' => $loan->id,
                'description' => "Dear " . $loan->users->name . ". Your Loan request has been Rejected.",
                'name' => $member->name,
                'loan_id' => $loan->id,
            ];

            $member->notify(new LoanStatusNotification($user));
        } else {

            $member = User::findOrFail($loan->user_id); // to be notified

            $user = [
                'id' => $loan->id,
                'description' => "Dear " . $loan->users->name . ". Your Loan Application status has been updated.",
                'name' => $member->name,
                'loan_id' => $loan->id,
            ];

            $member->notify(new LoanStatusNotification($user));
        }

        return response("Success", 204);
    }

    public function makeRepayment($id, Request $request)
    {

        $loan = Loan::find($id);

        $loan->repaid_amount = $loan->repaid_amount + $request->amount;

        $loan->balance_amount = $loan->balance_amount - $request->amount;

        $loan->save();

        //Make the notification request

        return response("Success", 204);
    }

    public function setMaxCreditLimit($id, UpdateLoanDataRequest $request)
    {
        $data = $request->validated();

        $loan = Loan::find($id);

        $loan->update($data);

        //Make the notification request
        $member = User::findOrFail($loan->user_id); // to be notified

        $user = [
            'id' => $loan->id,
            'description' => "Dear " . $loan->users->name . ". Your Loan Application was Rejected Pending Entering of new Loan Amount.",
            'name' => $member->name,
            'loan_id' => $loan->id,
        ];

        $member->notify(new LoanMaximumLimitNotification($user));

        return response("Success", 204);
    }

    public function updateMpesaStatement($id, UpdateLoanDataRequest $request)
    {

        $data = $request->validated();

        $loan = Loan::find($id);

        $loan->update($data);

        return response("Success", 204);
    }

    public function setNewLoanAmount($id, UpdateLoanAmountRequest $request)
    {

        $data = $request->validated();

        $loan = Loan::find($id);


        $loanAmountPlusInterest = ($data['loan_amount'] * 0.1) + $data['loan_amount'];

        $data['balance_amount'] = $loanAmountPlusInterest;
        $data['loan_amount_plus_interest'] = $loanAmountPlusInterest;

        $loan->update($data);


        $adminUsers = User::where('role', 'admin')->get();

        $admins = [
            'id' => $loan->id,
            'description' => "Dear Admin. A Loan Application has been updated. Check it out",
            'name' => $loan->users->name,
            'loan_id' => $loan->id,
        ];

        Notification::send($adminUsers, new LoanCreationAdminNotification($admins));

        return response("Success", 204);
    }

    public function downloadLoanFile($id)
    {

        return response()->download(public_path().'/loanFiles/'.$id);
    }
}
