<?php
namespace App\Http\Controllers;

use App\Models\Post;
use App\Models\Comment;
use App\Models\Like;
use Illuminate\Http\Request;

class PostController extends Controller
{
    public function index() {
        return response()->json(['posts' => \App\Models\Post::with('user')->orderBy('created_at', 'desc')->get()]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'user_id' => 'required|exists:users,id'
        ]);

        $post = Post::create($validated);

        return response()->json([
            'message' => 'Post créé',
            'post' => $post,
        ], 201);
    }

    public function show($id)
    {
        $post = Post::with('user')->findOrFail($id);
        return response()->json($post);
    }

    public function addComment(Request $request, $id) {
        $validated = $request->validate([
            'content' => 'required|string',
            'user_id' => 'required|exists:users,id'
        ]);
        $comment = new Comment([
            'content' => $validated['content'],
            'user_id' => $validated['user_id'],
            'post_id' => $id
        ]);
        $comment->save();
        return response()->json(['message' => 'Commentaire ajouté', 'comment' => $comment], 201);
    }

    public function getComments($id) {
        $comments = \App\Models\Comment::with('user')->where('post_id', $id)->orderBy('created_at', 'asc')->get();
        return response()->json(['comments' => $comments]);
    }

    // Méthode pour liker un post
    public function like(Request $request, $id) {
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id'
        ]);
        // On cherche un like existant ou on en crée un nouveau
        $like = Like::updateOrCreate(
            ['user_id' => $validated['user_id'], 'post_id' => $id],
            ['is_like' => true]
        );
        return response()->json(['message' => 'Post liké', 'like' => $like]);
    }

    // Méthode pour disliker un post
    public function dislike(Request $request, $id) {
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id'
        ]);
        $like = Like::updateOrCreate(
            ['user_id' => $validated['user_id'], 'post_id' => $id],
            ['is_like' => false]
        );
        return response()->json(['message' => 'Post disliké', 'like' => $like]);
    }
}