<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('securities', function (Blueprint $table) {
            $table->string('securityId')->primary();
            $table->string('securityName');
            $table->date('securityDob');
            $table->string('securityNicNumber')->unique();

            $table->string('securityPrimaryContact');
            $table->string('securitySecondaryContact')->nullable();
            $table->string('securityPhoto')->nullable();
            $table->boolean('securityNicUploaded')->default(false);
            $table->boolean('securityPoliceReportUploaded')->default(false);
            $table->boolean('securityBirthCertificateUploaded')->default(false);
            $table->boolean('securityGramasewakaLetterUploaded')->default(false);
            $table->date('securityDateOfJoin');
            $table->smallInteger('securityStatus')->default(300);

                    
            $table->text('securityPermanentAddress'); // REQUIRED (no nullable)
            $table->text('securityCurrentAddress'); // REQUIRED
            $table->enum('securityGender', ['male', 'female']); // REQUIRED
            $table->string('securityDistrict'); // REQUIRED
            $table->string('securityPoliceDivision'); // REQUIRED
            $table->string('securityGramaNiladariDivision'); // REQUIRED
            $table->text('securityEducationalInfo'); // REQUIRED
            $table->boolean('securityMaritalStatus')->default(false); // REQUIRED (default false)
            $table->string('securityPreviousWorkplace'); // REQUIRED
            $table->text('securityExperience'); // REQUIRED
            $table->string('securityEmergencyContactName'); // REQUIRED
            $table->string('securityEmergencyContactAddress'); // REQUIRED
            $table->string('securityEmergencyContactNumber'); // REQUIRED
            $table->text('securityAdditionalInfo')->nullable(); // OPTIONAL (nullable)
            $table->enum('securityType', ['LSO', 'OIC', 'JSO', 'SSO', 'CSO']); // REQUIRED
            $table->string('securityEpfNumber')->nullable(); // OPTIONAL (nullable)

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('securities');
    }
};

//   