class CreateMembers < ActiveRecord::Migration[5.1]
  def change
    add_column :members, :name, :string
    add_reference :members, :chore, foreign_key: true
  end
end
