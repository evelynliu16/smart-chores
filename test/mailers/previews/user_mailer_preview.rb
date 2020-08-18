# Preview all emails at http://localhost:3000/rails/mailers/user_mailer
class UserMailerPreview < ActionMailer::Preview
    def chores_email
        UserMailer.with(member: Member.first).chores_email(Member.first)
    end
end
