<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreUserRequest;
use App\Http\Requests\StoreUserRequestAdmin;
use App\Http\Requests\UpdateNewUserProfileRequest;
use App\Http\Requests\UpdateUserRequest;
use App\Http\Resources\LoanResource;
use App\Http\Resources\UserResource;
use App\Models\File;
use App\Models\Loan;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Resources\Json\AnonymousResourceCollection
     */
    public function index()
    {
        return UserResource::collection(User::query()->orderBy('id', 'desc')->paginate(10));
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param \App\Http\Requests\StoreUserRequest $request
     * @return \Illuminate\Http\Response
     */
    public function store(StoreUserRequest $request)
    {
        $data = $request->validated();
        $data['password'] = bcrypt($data['password']);
        $user = User::create($data);

        return response(new UserResource($user), 201);
    }

    /**
     * Display the specified resource.
     *
     * @param \App\Models\User $user
     * @return \Illuminate\Http\Response
     */
    public function show(User $user)
    {
        return new UserResource($user);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param \App\Http\Requests\UpdateUserRequest $request
     * @param \App\Models\User                     $user
     * @return \Illuminate\Http\Response
     */
    public function update(UpdateUserRequest $request, User $user)
    {
        $data = $request->validated();
        if (isset($data['password'])) {
            $data['password'] = bcrypt($data['password']);
        }
        $user->update($data);

        return new UserResource($user);
    }

    public function usersUpdate($id, UpdateNewUserProfileRequest $request)
    {
        $user = User::find($id);

        $data = $request->validated();


        if (isset($data['password'])) {
            $data['password'] = bcrypt($data['password']);
        }
        $user->update($data);

        return new UserResource($user);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param \App\Models\User $user
     * @return \Illuminate\Http\Response
     */
    public function destroy(User $user)
    {
        $user->delete();

        return response("", 204);
    }

    public function uploadImage(Request $request)
    {
        Validator::make($request->all(), [
            'file' => 'required|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
        ])->validate();

        $fileName = time() . '.' . $request->file->extension();
        $request->file->move(public_path('uploads'), $fileName);

        $userId = Auth::user()->id;
        $title = 'profile image';

        File::create([
            'title' => $title,
            'name' => $fileName,
            'user_id' => $userId
        ]);

        $user = User::find($userId);

        $user->photo_url = $fileName;

        $user->save();

        return response("", 200);
    }

    public function disableUser($id, Request $request)
    {

        $loan = User::find($id);

        $newStatus = $loan->status;

        if ($newStatus == 1) {

            $loan->status = 0;
        } else {

            $loan->status = 1;
        }

        $loan->save();

        return response("", 200);
    }

    public function getNotification($id)
    {

        $notifications = User::find($id);

        return json_encode($notifications->notifications()->get());
    }

    public function makeAsRead($id, Request $request)
    {

        $notification = User::find($id);

        $notification->unreadNotifications->when($request->input('id'), function ($query) use ($request) {
            return $query->where('id', $request->input('id'));
        })
            ->markAsRead();
    }

    public function userLoans($id)
    {
        return LoanResource::collection(Loan::query()->orderBy('id', 'desc')->where('user_id', $id)->paginate(10));
    }

    public function createNewUser(StoreUserRequestAdmin $request)
    {
        $data = $request->validated();
        $data['password'] = bcrypt($data['password']);
        $user = User::create($data);

        return response(new UserResource($user), 201);
    }

    public function getNotifications()
    {
        $user = Auth::user()->id;

        $notificationCount = User::find($user);

        $count = $notificationCount->unreadNotifications()->groupBy('notifiable_type')->count();

        return response($count, 201);
    }
}
