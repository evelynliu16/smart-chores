class SigninRegisterController < ApplicationController
  def index
  end

  def register
    user = User.create(
      username: params[:user][:username],
      password: params[:user][:password],
      password_confirmation: params[:user][:password_confirmation]
    )

    if user
      session[:user_id] = user.id
      render json: {
        status: :created,
        user: user
      }
    else 
      render json: { status: 500 }
    end
  end

  def signin
        user = User.find_by(username: params[:user][:username])
                .try(:authenticate, params[:user][:password])
        
        if user
            session[:user_id] = user.id
            render json: {
                status: :created,
                logged_in: true,
                user: user
            } 
        else 
            render json: { status: 401 }
        end
    end 
end
