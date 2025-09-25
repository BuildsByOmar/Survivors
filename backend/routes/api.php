<?php
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;

// Route d'inscription
Route::post('/register', [UserController::class, 'register']);

// Route de connexion
Route::post('/login', [UserController::class, 'login']);