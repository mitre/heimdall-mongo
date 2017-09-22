require 'mongo'
require 'json'
require "base64"

class Mongo_DB
  def initialize
    @client = Mongo::Client.new([ '127.0.0.1:27017' ], :database => 'profiles')
  end

  def insert_profile(json)
    profile_name = json['profile_name']
    db = @client.database
    db[Base64.strict_encode64(profile_name)].drop()
    collection = @client[Base64.strict_encode64(profile_name)]
    json['controls'].each do |control|
      collection.insert_one(control)
    end
  end

  def retrieve_profile(profile_name)
    json = { 'profile_name' => Base64.decode64(profile_name), 'controls' => [] }
    collection = @client[profile_name]
    collection.find.each do |document|
      json['controls'] << document
    end
    json.to_json
  end

  def get_all_collections
    json = {'collections' => []}
    db = @client.database

    db.collection_names.each do |collection|
      json['collections'] << Base64.decode64(collection)
    end
    json['collections'].sort!
    json['collections'].reverse!
    json.to_json
  end

  def drop_all_collections
    json = {'collections' => []}
    db = @client.database

    db.collection_names.each do |collection|
      db['cHJvZmlsZTtkb2NrZXI6IDAuMS4w'].drop()
    end
  end
end
# 
# mdb = Mongo_DB.new
# mdb.drop_all_collections
