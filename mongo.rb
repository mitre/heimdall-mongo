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
    insert_latest(json['profile_name'])
  end

  def retrieve_profile(profile_name)
    json = { 'profile_name' => Base64.decode64(profile_name), 'controls' => [] }
    collection = @client[profile_name]
    collection.find.each do |document|
      json['controls'] << document
    end
    json.to_json
  end

  def insert_latest(profile_name)
    db = @client.database
    db[Base64.strict_encode64('latest_upload')].drop()
    collection = @client[Base64.strict_encode64('latest_upload')]
    collection.insert_one({ _id: 0, name: "#{profile_name}"})
  end

  def retrieve_latest
    collection = @client[Base64.strict_encode64('latest_upload')]
    collection.find.first || {'name'=> 'empty'}
  end

  def get_all_collections
    json = {'collections' => []}
    db = @client.database

    db.collection_names.each do |collection|
      json['collections'] << Base64.decode64(collection) unless Base64.decode64(collection).eql?('latest_upload')
    end
    json['collections'].sort!
    json['collections'].reverse!
    json.to_json
  end

  def drop_all_collections
    json = {'collections' => []}
    db = @client.database
    db.collection_names.each do |collection|
      db[collection].drop()
    end
  end
end