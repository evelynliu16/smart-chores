# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)

user = User.create(username: 'evelynliu16', password: '19991116', password_confirmation: '19991116')
member1 = Member.create(name: 'Evelyn', user: user)
member2 = Member.create(name: 'Elena', user: user);
Chore.create(title: 'Trash', description: 'Take out trash and recycle', member: member1, user: user);
Chore.create(title: 'Kitchen', description: 'Take out compost and wipe kitchen counter', member: member2, user: user);