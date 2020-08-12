class SessionsController < ApplicationController
    include CurrentUserConcern

    def logged_in
        if @current_user
            render json: {
                logged_in: true,
                user: @current_user
            }
        else 
            render json: {
                logged_in: false
            }
        end
    end

    def logout
        reset_session
        render json: { status: 200, logged_out: true}
    end  
end   
