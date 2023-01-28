<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\LoanFormDataRequest;
use App\Http\Requests\UpdateLoanDataRequest;
use App\Http\Resources\LoanResource;
use App\Models\Loan;
use App\Models\User;
use App\Notifications\LoanMaximumLimitNotification;
use App\Notifications\LoanOverdueNotification;
use App\Notifications\LoanStatusNotification;
use Illuminate\Http\Request;

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

    /**
     * Store a newly created resource in storage.
     *
     * @param \App\Http\Requests\StoreUserRequest $request
     * @return \Illuminate\Http\Response
     */
    public function store(LoanFormDataRequest $request)
    {
        $data = $request->validated();

        $loan = Loan::create($data);

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
    public function destroy(Loan $user)
    {
        $user->delete();

        return response("", 204);
    }

    public function updateStatus($id, UpdateLoanDataRequest $request)
    {
        $data = $request->validated();

        $loan = Loan::find($id);

        $loan->update($data);

        if ($data['status_id'] == 3) {

            $member = User::findOrFail($loan->user_id); // to be notified

            $user = [
                'id' => $loan->id,
                'description' => "Dear " . $loan->users->name . ". Your Loan requested has been Rejected.",
                'name' => $member->name
            ];

            $member->notify(new LoanStatusNotification($user));

        } else {

            $member = User::findOrFail($loan->user_id); // to be notified

            $user = [
                'id' => $loan->id,
                'description' => "Dear " . $loan->users->name . ". Your Loan Application status has been updated.",
                'name' => $member->name
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
            'name' => $member->name
        ];

        $member->notify(new LoanMaximumLimitNotification($user));

        return response("Success", 204);
    }
}
