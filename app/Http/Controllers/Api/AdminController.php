<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Loan;
use App\Models\User;
use Illuminate\Http\Request;

class AdminController extends Controller
{
    //

    public function getDashBoardData()
    {

        $usersCount = User::count();
        $amountLoaned = Loan::where('status_id', 2)->sum('loan_amount');
        $amountPaidBack = Loan::sum('repaid_amount');
        $pendingPayment = Loan::where('status_id', [2, 5])->sum('loan_amount');

        $graphData = $this->getGraphData();
        $graphData2 = $this->getGraphData2();


        $responseData = array(
            "usersCount" => $usersCount,
            "amountLoaned" => $amountLoaned,
            "amountPaidBack" => $amountPaidBack,
            "graphData" => $graphData,
            "graphData2" => $graphData2,
            "pendingPayment" => $pendingPayment,
        );

        return json_encode($responseData);
    }

    private function getGraphData()
    {

        $monthlyValues = array();

        for ($x = 0; $x < 12; $x++) {
            $monthlyValues[$x] = Loan::select(['loan_amount', 'created_at', 'status_id'])->where('status_id', 2)->whereMonth('created_at', $x + 1)->sum('loan_amount');
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
