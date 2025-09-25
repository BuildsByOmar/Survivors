<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;

class UserController extends Controller
{
    public function register(Request $request)
    {
        $validated = $request->validate([
            'username' => 'required|unique:users,username',
            'password' => 'required|min:6',
        ]);

        $user = new User();
        $user->username = $validated['username'];
        $user->password = bcrypt($validated['password']);
        $user->save();

        return response()->json(['message' => 'Inscription réussie'], 201);
    }

    public function login(Request $request)
    {
        $credentials = $request->validate([
            'username' => 'required',
            'password' => 'required',
        ]);

        $user = User::where('username', $credentials['username'])->first();

        if ($user && \Illuminate\Support\Facades\Hash::check($credentials['password'], $user->password)) {
            // Authentification réussie
            return response()->json(['message' => 'Connexion réussie'], 200);
        } else {
            return response()->json(['message' => 'Identifiants invalides'], 401);
        }
    }
}
