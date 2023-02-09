<?php

namespace App\Console\Commands;

use App\Models\Loan;
use App\Models\User;
use App\Notifications\LoanOverdueNotification;
use Carbon\Carbon;
use Illuminate\Console\Command;

class DailyLoanCheck extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'dailyLoanCheck:cron';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Calculate loan services daily. Interest, Defaultors';

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        $this->calculateLoan();

        return Command::SUCCESS;
    }

    public function calculateLoan()
    {

        $loanItems = Loan::where('status_id', 2)->get();

        foreach ($loanItems as $key => $loanItem) {

            $createdDate = $loanItem->due_payment_date;
            
            $date = Carbon::parse($createdDate);

            if ($date->isToday()) {

                $loanItem->next_pay_date = Carbon::now()->addMonth();

                $loanItem->balance_amount = $loanItem->balance_amount + ($loanItem->loan_amount * 0.5);

                $loanItem->save();

                $member = User::findOrFail($loanItem->user_id); // to be notified

                $user = [
                    'id' => $loanItem->id,
                    'description' => "Dear " . $loanItem->users->name . ". You are hearby reminded that your loan is over due and this will incure a penalty of 5%.",
                    'name' => $member->name
                ];

                $member->notify(new LoanOverdueNotification($user));
            }
        }
    }
}
