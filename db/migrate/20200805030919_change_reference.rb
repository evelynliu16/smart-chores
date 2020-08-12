class ChangeReference < ActiveRecord::Migration[5.1]
  def change
    remove_reference :members, :chore, index: true, foreign_key: true
    add_reference :members, :user, foreign_key: true
    add_reference :chores, :member, foreign_key: true
  end
end
