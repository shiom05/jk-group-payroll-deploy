    <?php

    use Illuminate\Database\Migrations\Migration;
    use Illuminate\Database\Schema\Blueprint;
    use Illuminate\Support\Facades\Schema;
    use Illuminate\Support\Facades\DB;
    use Illuminate\Support\Str;

    return new class extends Migration
    {
        public function up(): void
        {
            Schema::create('inventory_types', function (Blueprint $table) {
                $table->id();
                $table->string('name')->unique(); // LSO Shirt, SSO Belt, etc.
                $table->string('code')->unique(); // lso-shirt, sso-belt
                $table->boolean('track_size')->default(false);
                $table->string('size_range')->nullable(); // "14-20", "28-44"
        $table->decimal('standard_price', 10, 2);
                $table->timestamps();
            });

            // Predefined inventory types (with unique codes)
            $types = [
                ['name' => 'LSO Shirt',     'track_size' => true,  'size_range' => '14-20'],
                ['name' => 'SSO Shirt',     'track_size' => true,  'size_range' => '14-20'],
                ['name' => 'OIC Shirt',     'track_size' => true,  'size_range' => '14-20'],
                ['name' => 'Applet',        'track_size' => false, 'size_range' => null],
                ['name' => 'Tie',           'track_size' => false, 'size_range' => null],
                ['name' => 'SSO Belt',      'track_size' => false, 'size_range' => null],
                ['name' => 'LSO Belt',     'track_size' => false, 'size_range' => null],
                ['name' => 'OIC Belt',      'track_size' => false, 'size_range' => null],
                ['name' => 'Shoes',         'track_size' => false, 'size_range' => null],
                ['name' => 'Lanyard',       'track_size' => false, 'size_range' => null], // Fixed typo (Lenyard → Lanyard)
                ['name' => 'Beret',         'track_size' => false, 'size_range' => null], // Lowercase (removed duplicate "BERET")
                ['name' => 'SSO Trouser',   'track_size' => true,  'size_range' => '28-44'],
                ['name' => 'OIC Trouser',   'track_size' => true,  'size_range' => '28-44'],
                ['name' => 'SKIRT',         'track_size' => true,  'size_range' => '27-44'],
                ['name' => 'Tshirt',        'track_size' => false, 'size_range' => null],
            ];

            foreach ($types as $type) {
                DB::table('inventory_types')->insert([
                    'name'       => $type['name'],
                    'code'       => Str::slug($type['name']), // Generate code from name (e.g., "LSO Shirt" → "lso-shirt")
                    'track_size' => $type['track_size'],
                    'size_range' => $type['size_range'],
                    'standard_price' => rand(50000, 300000) / 100, // e.g., 500.00 to 3000.00
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        }

        public function down(): void
        {
            Schema::dropIfExists('inventory_types');
        }
    };