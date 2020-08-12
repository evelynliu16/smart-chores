Rails.application.routes.draw do
  root "signin_register#index"

  get '/logged_in', to: "sessions#logged_in"
  delete '/logout', to: "sessions#logout"

  post '/signin', to: "signin_register#signin"
  post '/register', to: "signin_register#register"
 
  get '/chores_changes', to: "home#index"
  get '/get_members', to: "home#get_members"
  get '/home', to: "home#index"
  post '/get_chores', to: "home#get_chores"
  post '/member_chores', to: "home#member_chores"
  get '/all_chores', to: "home#all_chores"
  post '/chores_arrangement_changes', to: "home#chores_arrangement_changes"
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
end
