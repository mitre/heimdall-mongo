class Mapping
  include Mongoid::Document
  include Mongoid::Timestamps
  field :controls, type: Hash
  field :Review, type: String
  field :Response, type: String
end