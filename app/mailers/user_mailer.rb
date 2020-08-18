class UserMailer < ApplicationMailer
 
  def chores_email(member)
    @member = member
    mail(to: @member.email, subject: "Chores for #{@member.name} this week")
  end
end
