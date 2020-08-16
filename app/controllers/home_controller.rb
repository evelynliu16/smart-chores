class HomeController < ApplicationController
  def index
  end

  def get_members
    @@members = User.find_by(id: session[:user_id]).members
    render json: {
      members: @@members,
    }
  end

  def get_chores
    chores = Member.find_by(id: params[:member_id]).chores 
    render json: {
      chores:  chores
    }
  end

  def all_chores
    @@chores = User.find_by(id: session[:user_id]).chores
    render json: {
      chores: @@chores
    }
  end

  def chores_arrangement_changes
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

  def switch_chores
    if params[:id].eql?("0")
      tracker = 0
      first_chores = @@members[0].chore_ids
      @@members.each do |member|
        if tracker < @@members.length - 1
          new_chores = @@members[tracker + 1].chore_ids
          member.chore_ids = new_chores
          tracker += 1
        else
          member.chore_ids = first_chores
        end
      end
    else 
      tracker = @@members.length - 1
      last_chores = @@members[tracker].chore_ids
      while tracker >= 0
        member = @@members[tracker]
        if tracker > 0
          puts member.name
          new_chores = @@members[tracker - 1].chore_ids
          member.chore_ids = new_chores
          tracker -= 1
        else
          puts member.name
          member.chore_ids = last_chores
          tracker -= 1
        end
      end
    end
    render json: {
      switched: true
    }
  end

  def add_new_member
    name = params[:member]
    new_member = Member.create(name: name, user_id: session[:user_id])
    render json: {
      new_member: new_member
    }
  end

  def delete_member
    id = params[:member_id]
    Member.find_by(id: id).delete
  end

  def add_chores
    title = params[:chores][:title]
    description = params[:chores][:description]
    new_chores = Chore.create(title: title, description: description, user_id: session[:user_id])
    render json: {
      new_chores: new_chores
    }
  end

  def delete_chores
    id = params[:chores_id]
    Chore.find_by(id: id).delete
  end

  def reset
    @@members.each do |member|
      Member.find_by(id: member.id).delete;
    end
    @@chores.each do |chore|
      Chore.find_by(id: chore.id).delete;
    end
  end
end
