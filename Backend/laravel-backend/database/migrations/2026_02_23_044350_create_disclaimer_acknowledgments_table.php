<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * disclaimer_acknowledgments tracks whether a user or guest
     * has accepted the chatbot disclaimer before using the system.
     * This is important for your thesis — the chatbot is explicitly
     * non-clinical, and users must acknowledge that before chatting.
     *
     * Either user_id OR guest_session_token will be filled,
     * never both at the same time — one row per person per session.
     */
    public function up(): void
    {
        Schema::create('disclaimer_acknowledgments', function (Blueprint $table) {
            $table->id();

            // Links to a registered user — nullable because guests
            // won't have a user_id
            $table->foreignId('user_id')
                  ->nullable()
                  ->constrained()
                  ->onDelete('cascade');
                  // cascade means: if the user is deleted,
                  // their acknowledgment record is also deleted

            // Links to a guest session — nullable because
            // registered users won't have a session token
            $table->string('guest_session_token')->nullable();

            // The exact time they clicked "I acknowledge" —
            // useful for audit trail and thesis documentation
            $table->timestamp('acknowledged_at');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('disclaimer_acknowledgments');
    }
};
