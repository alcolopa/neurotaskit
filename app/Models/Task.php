<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Task extends Model
{
    use HasUuids;

    public $incrementing = false;
    protected $keyType = 'string';

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'title',
        'description',
    ];

    /**
     * The attributes that are casted
     *
     * @var list<strings>
     */
    protected $casts = [
    ];

    /**
     * Get and return the user that has created this task
     *
     * @return BelognsTo
     */
    public function owner(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    /**
     * Get and return the user that has created this task
     *
     * @return BelognsTo
     */
    public function asignee(): BelongsTo
    {
        return $this->belongsTo(User::class, 'assigned_to');
    }
}
