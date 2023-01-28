<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\LoginRequest;
use App\Http\Requests\RegisterNewUserRequest;
use App\Http\Requests\SignupRequest;
use App\Http\Requests\UpdateNewUserProfileRequest;
use App\Models\File;
use App\Models\User;
use http\Env\Response;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Carbon\Carbon;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{

    public function registerNewUser(RegisterNewUserRequest $request) 
    {

        $data = $request->validated();

        $randPass = $this->getRandomString(5);

        /** @var \App\Models\User $user */
        $user = User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => bcrypt('toroyteach'),
        ]);

        //TODO: notify Administrator

        return response(['message' => 'User account was created Successfully']);

    }

    public function activateUserAccount(User $user)
    {

        $randPass = $this->getRandomString(5);

        $user->password = bcrypt($randPass);
        $user->status = 1;
        $user->account_activated = Carbon::now();

        $user->save();

        return response(['message' => 'User account was Activated Successfully'], compact('randPass'));

    }

    public function updateProfile(UpdateNewUserProfileRequest $request, User $user)
    {
        $user->update($request->validated());

        $user->save();

        return response(['message' => 'User profile was Updated Successfully'], compact('user'));

    }


    public function signup(SignupRequest $request)
    {
        $data = $request->validated();
        /** @var \App\Models\User $user */
        $user = User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => bcrypt($data['password']),
        ]);

        $token = $user->createToken('main')->plainTextToken;
        return response(compact('user', 'token'));
    }

    public function login(LoginRequest $request)
    {
        $credentials = $request->validated();
        if (!Auth::attempt($credentials)) {
            return response([
                'message' => 'Provided email or password is incorrect'
            ], 422);
        }

        /** @var \App\Models\User $user */
        $user = Auth::user();

        if ($user->status === 0) {
            //THROW ERROR WITH CUSTOM MESSAGE
            throw ValidationException::withMessages(['Message' => __('User account has been deactivated. Please Contact the Administrator.')]);
        }

        //TODO add the user profile image in the user object
        $token = $user->createToken('main')->plainTextToken;
        return response(compact('user', 'token'));
    }

    public function logout(Request $request)
    {
        /** @var \App\Models\User $user */
        $user = $request->user();
        //$user->currentAccessToken()->delete();
        return response('', 204);
    }

    private function getRandomString($n)
    {
      $characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
      $randomString = '';
    
      for ($i = 0; $i < $n; $i++) {
        $index = rand(0, strlen($characters) - 1);
        $randomString .= $characters[$index];
      }
    
      return $randomString;
    }
}
