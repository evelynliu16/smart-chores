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
    email = params[:email]
    new_member = Member.create(name: name, email: email, user_id: session[:user_id])
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

  def edit_members
    member_change = params[:member]
    member = Member.find_by(id: member_change[:member_id])
    member.name = member_change[:new_name]
    member.email = member_change[:new_email]
    member.save
    render json: {
      member: member
    }
  end

  def edit_chores
    chore_change = params[:chore]
    chore = Chore.find_by(id: chore_change[:chore_id])
    chore.title = chore_change[:new_title]
    chore.description = chore_change[:new_descript]
    chore.save
    render json: {
      chore: chore
    }
  end

  def send_emails
    response = ""
    @user = User.find_by(id: session[:user_id])
    @members = User.find_by(id: session[:user_id]).members
    respond_to do |format|
      @members.each do |member| 
        if (member.email)
          UserMailer.chores_email(member).deliver_now
          response.concat(member.name + " ");

          format.html { redirect_to('/home', notice: 'Emails were successfully sent') }
          format.json { render json: member, members: response, location: '/home' }
        end
      end
    end
  end
end
