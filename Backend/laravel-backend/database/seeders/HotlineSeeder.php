<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class HotlineSeeder extends Seeder
{
    /**
     * Seed the hotlines table with verified mental health
     * resources relevant to SLU students.
     */
    public function run(): void
    {
        $hotlines = [
            // Campus resource — highest priority for SLU students
            [
                'name'           => 'SLU Center for Counseling and Wellness (CCW)',
                'category'       => 'campus',
                'contact_number' => '(074) 442-3316',
                'email'          => 'ccw@slu.edu.ph',
                'website'        => 'https://www.slu.edu.ph',
                'description'    => 'SLU\'s official counseling center providing free mental health services to all enrolled students.',
                'is_active'      => true,
            ],

            // National crisis hotlines
            [
                'name'           => 'National Center for Mental Health (NCMH) Crisis Hotline',
                'category'       => 'national',
                'contact_number' => '1553',
                'email'          => null,
                'website'        => 'https://www.ncmh.gov.ph',
                'description'    => '24/7 mental health crisis hotline operated by the Department of Health.',
                'is_active'      => true,
            ],
            [
                'name'           => 'In Touch Crisis Line',
                'category'       => 'national',
                'contact_number' => '(02) 8893-7603',
                'email'          => null,
                'website'        => null,
                'description'    => 'Provides emotional support and crisis intervention via phone.',
                'is_active'      => true,
            ],
            [
                'name'           => 'Hopeline Philippines',
                'category'       => 'national',
                'contact_number' => '2919',
                'email'          => null,
                'website'        => null,
                'description'    => 'Free 24/7 suicide prevention hotline by Natasha Goulbourn Foundation.',
                'is_active'      => true,
            ],

            // Emergency
            [
                'name'           => 'Emergency Hotline',
                'category'       => 'emergency',
                'contact_number' => '911',
                'email'          => null,
                'website'        => null,
                'description'    => 'For immediate emergencies requiring police, fire, or medical assistance.',
                'is_active'      => true,
            ],
        ];

        DB::table('hotlines')->insert($hotlines);
    }
}
