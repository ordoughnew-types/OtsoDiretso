<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * guest_sessions stores temporary session tokens for users
     * who choose to use the chatbot without registering.
     * Each guest gets a unique UUID token that expires after 24 hours.
     * This lets us track their chat history within a session
     * without requiring personal information.
     */
    public function up(): void
    {
        Schema::create('guest_sessions', function (Blueprint $table) {
            $table->id();

            // UUID token given to the guest — used to identify them
            // across requests instead of a user ID
            $table->string('session_token')->unique();

            // When this session expires — guests are temporary by design
            // nullable in case we ever want permanent guest sessions
            $table->timestamp('expires_at')->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('guest_sessions');
    }
};
