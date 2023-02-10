<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Loan;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AdminController extends Controller
{
    //

    public function getDashBoardData()
    {
        $userId = Auth::user()->id;

        $usersCount = User::count();

        $amountLoaned = Loan::where('status_id', 2)->sum('loan_amount_plus_interest');
        $amountPaidBack = Loan::sum('repaid_amount');
        $pendingPayment = Loan::where('status_id', [2, 5])->sum('balance_amount');

        $userPenymentDue = Loan::select(['status_id', 'due_payment_date'])->where('user_id', $userId)->where('status_id', 2)->first();

        $graphData = $this->getGraphData();
        $graphData2 = $this->getGraphData2();



        $dueDate = ( $userPenymentDue == null )  ? 'No date' : $userPenymentDue->due_payment_date;

        $responseData = array(
            "usersCount" => $usersCount,
            "amountLoaned" => $amountLoaned,
            "amountPaidBack" => $amountPaidBack,
            "graphData" => $graphData,
            "graphData2" => $graphData2,
            "pendingPayment" => $pendingPayment,
            "paymentDue" => $dueDate,
        );

        return json_encode($responseData);
    }

    private function getGraphData()
    {

        $monthlyValues = array();

        for ($x = 0; $x < 12; $x++) {
            $monthlyValues[$x] = Loan::select(['loan_amount_plus_interest', 'created_at', 'status_id'])->where('status_id', 2)->whereMonth('created_at', $x + 1)->sum('loan_amount_plus_interest');
        }

        return $monthlyValues;
    }

    private function getGraphData2()
    {

        $monthlyValues = array();

        for ($x = 0; $x < 12; $x++) {
            $monthlyValues[$x] = Loan::select(['repaid_amount', 'created_at', 'status_id'])->where('status_id', 2)->whereMonth('created_at', $x + 1)->sum('repaid_amount');
        }

        return $monthlyValues;
    }
}
