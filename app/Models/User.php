<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;

use Filament\Models\Contracts\FilamentUser;
use Filament\Panel;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Spatie\Permission\Traits\HasRoles;

class User extends Authenticatable implements FilamentUser
{
    public $incrementing = false;
    protected $keyType = 'string';

    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable, HasUuids, HasRoles;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'workos_id',
        'avatar',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'workos_id',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    /**
     * Returns if the user can access the admin panel
     *
     * @return bool
     */
    public function canAccessPanel(Panel $panel): bool
    {
        if (config('app.env') === 'local') {
            return true;
        };

        return str_ends_with($this->email, '@neurotaskit.com') && $this->hasVerifiedEmail();
    }

    /**
     * Get the tasks that are created by the user
     *
     * @return HasMany
     */
    public function createdTasks(): HasMany
    {
        return $this->hasMany(Task::class, 'owner_id');
    }

    /**
     * Get the tasks that are assigned to the user
     *
     * @return HasMany
     */
    public function asignedTasks(): HasMany
    {
        return $this->hasMany(Task::class, 'assigned_to');
    }
}
