<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * hotlines stores verified mental health resources and
     * crisis contact information that students can access
     * directly from the chatbot interface.
     *
     * Based on the thesis paper, this includes:
     * - SLU Center for Counseling and Wellness (CCW)
     * - National crisis hotlines
     * - Emergency support organizations
     *
     * Storing these in the database instead of hardcoding them
     * means they can be updated without touching the codebase —
     * important since hotline numbers can change over time.
     */
    public function up(): void
    {
        Schema::create('hotlines', function (Blueprint $table) {
            $table->id();

            // Name of the organization or service
            $table->string('name');

            // Category helps the frontend group resources
            // e.g. "campus", "national", "emergency"
            $table->string('category');

            // Contact number — nullable in case some resources
            // are online-only
            $table->string('contact_number')->nullable();

            // Email contact — nullable for same reason
            $table->string('email')->nullable();

            // Website or online resource link
            $table->string('website')->nullable();

            // Brief description of the service
            $table->text('description')->nullable();

            // Whether this resource is currently active
            // Lets us hide outdated resources without deleting them
            $table->boolean('is_active')->default(true);

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('hotlines');
    }
};
