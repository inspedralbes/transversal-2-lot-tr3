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
    // protected function schedule(Schedule $schedule)
    // {
    //     $schedule->call(function () {
    //         $inscripciones = Inscripcion::all();
    //         foreach ($inscripciones as $inscripcion) {
    //             $evento = Evento::find($inscripcion->evento_id);
    //             $objDemo = new Email();
    //             $objDemo->sender = 'Alessia';
    //             $objDemo->receiver = $inscripcion->nom;
    //             $objDemo->titol = $evento->titol;
    //             $objDemo->data = $evento->data;
    //             $objDemo->hora = $evento->hora;
    //             $objDemo->minuts = $evento->minuts;
    //             $objDemo->id = $id;
    //             Mail::to($inscripcion->email)->send(new confirmacio($objDemo)); 
    //         }  
    //     })->daily();
    // }

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
