Rails.application.routes.draw do
  root "signin_register#index"

  get '/logged_in', to: "sessions#logged_in"
  delete '/logout', to: "sessions#logout"

  post '/signin', to: "signin_register#signin"
  post '/register', to: "signin_register#register"
 
  get '/home', to: "home#index"
  get '/chores_changes', to: "home#index"
  get '/members_changes', to: "home#index"
  get '/set_up', to: "home#index"
  get '/arrangement', to: "home#index"
  get '/get_members', to: "home#get_members"
  get '/all_chores', to: "home#all_chores"
  get '/send_emails', to: "home#send_emails"
  post '/reset', to: "home#reset"
  post '/switch_chores', to: "home#switch_chores"
  post '/get_chores', to: "home#get_chores"
  post '/member_chores', to: "home#member_chores"
  post '/chores_arrangement_changes', to: "home#chores_arrangement_changes"
  post '/add_new_member', to: "home#add_new_member"
  post '/delete_member', to: "home#delete_member"
  post '/edit_members', to: "home#edit_members"
  post '/add_chores', to: "home#add_chores"
  post '/delete_chores', to: "home#delete_chores"
  post '/edit_chores', to: "home#edit_chores"
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
end
