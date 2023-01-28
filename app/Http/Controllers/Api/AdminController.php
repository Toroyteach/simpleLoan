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
        $amountLoaned = Loan::sum('loan_amount');
        $amountPaidBack = Loan::sum('repaid_amount');

        $graphData = $this->getGraphData();


        $responseData = array(
            "usersCount" => $usersCount,
            "amountLoaned" => $amountLoaned,
            "amountPaidBack" => $amountPaidBack,
            "graphData" => $graphData
        );

        return json_encode($responseData);
    }

    private function getGraphData()
    {

        $monthlyValues = array();

        for ($x = 0; $x < 12; $x++) {
            $monthlyValues[$x] = Loan::select(['loan_amount', 'repaid_amount', 'created_at'])->whereMonth('created_at', $x + 1)->sum('loan_amount');
        }

        return $monthlyValues;
    }
}
