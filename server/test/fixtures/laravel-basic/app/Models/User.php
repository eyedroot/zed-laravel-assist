<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Model;

/**
 * @property-read string $display_name
 */
class User extends Model
{
    protected $fillable = ['email', 'status'];

    protected $casts = [
        'status' => 'boolean',
    ];

    protected $appends = ['display_name'];

    public function posts()
    {
        return $this->hasMany(Post::class);
    }

    protected function avatarUrl(): Attribute
    {
        return Attribute::make(get: fn () => '');
    }

    public function getDisplayNameAttribute()
    {
        return $this->email;
    }
}
