class Chore < ApplicationRecord
    has_and_belongs_to_many :members
    belongs_to :user
end
