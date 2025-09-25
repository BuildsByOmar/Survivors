<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;
use App\Http\Controllers\PostController;

Route::post('/register', [UserController::class, 'register']);
Route::post('/login', [UserController::class, 'login']);
Route::post('/posts', [PostController::class, 'store']);
Route::get('/posts', [PostController::class, 'index']);
Route::get('/posts/{id}', [PostController::class, 'show']);

// Likes
Route::post('/posts/{id}/like', [PostController::class, 'like']);
Route::post('/posts/{id}/dislike', [PostController::class, 'dislike']);

// Commentaires
Route::post('/posts/{id}/comments', [PostController::class, 'addComment']);
Route::get('/posts/{id}/comments', [PostController::class, 'getComments']);
