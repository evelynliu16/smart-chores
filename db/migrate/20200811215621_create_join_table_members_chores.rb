class CreateJoinTableMembersChores < ActiveRecord::Migration[5.1]
  def change
    create_join_table :members, :chores do |t|
      t.index [:member_id, :chore_id]
      t.index [:chore_id, :member_id]
    end
    remove_reference :chores, :member, index: true, foreign_key: true
  end
end
