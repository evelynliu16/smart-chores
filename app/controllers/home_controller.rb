class HomeController < ApplicationController
  def index
  end

  def get_members
    members = User.find_by(id: session[:user_id]).members
    render json: {
      members: members,
    }
  end

  def get_chores
    chores = Member.find_by(id: params[:member_id]).chores 
    render json: {
      chores:  chores
    }
  end

  def all_chores
    chores = User.find_by(id: session[:user_id]).chores
    render json: {
      chores: chores
    }
  end

  def chores_arrangement_changes
    puts params[:data]
    params[:data].each {|key, value|
      member = Member.find_by(id: key)
      new_chores = []
      value.each do |key, value|
        if value
          new_chores.push(key)
          puts new_chores
        end
      member.chore_ids = new_chores
      end
    }
  end
end
