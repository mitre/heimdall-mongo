class Mapping
  include Mongoid::Document
  include Mongoid::Timestamps
  field :control_1, type: String
  field :control_2, type: String
  field :comment, type: String
  field :approve, type: String
end