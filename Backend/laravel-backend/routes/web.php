<?php

use Illuminate\Support\Facades\Route;

use Illuminate\Support\Facades\Mail;

Route::get('/test-mail', function () {
    Mail::raw('Test email from Laravel', function ($message) {
        $message->to('2232690@slu.edu.ph')
                ->subject('Test Email');
    });

    return 'Email sent';
});
