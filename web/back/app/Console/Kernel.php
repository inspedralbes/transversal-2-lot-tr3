<?php

namespace App\Console;

use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Foundation\Console\Kernel as ConsoleKernel;

class Kernel extends ConsoleKernel
{
    /**
     * Define the application's command schedule.
     *
     * @param  \Illuminate\Console\Scheduling\Schedule  $schedule
     * @return void
     */

    public function insertDaily($quizz) {
        
    }
    
    protected function schedule(Schedule $schedule)
    {
        $schedule->call(function () {
            $curl = curl_init();
            curl_setopt_array($curl, array(
              CURLOPT_URL => "https://the-trivia-api.com/api/questions?limit=10",
              CURLOPT_RETURNTRANSFER => true,
              CURLOPT_TIMEOUT => 30,
              CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
              CURLOPT_CUSTOMREQUEST => "GET",
              CURLOPT_HTTPHEADER => array(
                "cache-control: no-cache"
              ),
            ));
            
            $response = curl_exec($curl);
            $err = curl_error($curl);
            curl_close($curl);
            
            json_decode($response);
            $this->insertDaily($response);
        })->daily();
    }

    /**
     * Register the commands for the application.
     *
     * @return void
     */
    protected function commands()
    {
        $this->load(__DIR__.'/Commands');

        require base_path('routes/console.php');
    }
}
