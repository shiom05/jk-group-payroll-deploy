<?php

namespace App\Policies;

use App\Models\SecurityCompensation;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class SecurityCompensationPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return false;
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, SecurityCompensation $securityCompensation): bool
    {
        return false;
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return false;
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, SecurityCompensation $securityCompensation): bool
    {
        return false;
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, SecurityCompensation $securityCompensation): bool
    {
        return false;
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, SecurityCompensation $securityCompensation): bool
    {
        return false;
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, SecurityCompensation $securityCompensation): bool
    {
        return false;
    }
}
