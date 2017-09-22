require_relative 'inspec_results_parser.rb'
require_relative 'mongo.rb'
require "base64"
require 'sinatra/base'

class Heimdall < Sinatra::Base
  set :public_folder, "#{File.dirname(__FILE__)}/www"

  configure do
    @@mongo_handle = Mongo_DB.new
  end

  get '/static/:name' do |n|
    send_file "#{n.to_s}"
  end

  get '/inspec_results_list.json' do
    content_type :json
    json = JSON.parse(@@mongo_handle.get_all_collections)
    loaded_results = {}
    puts json
    json['collections'].each do |profile_name|
      loaded_results[profile_name.split(': ')[0]] = [] unless loaded_results.key?(profile_name.split(': ')[0])
      loaded_results[profile_name.split(': ')[0]].push(profile_name.split(': ')[1])
    end unless !json.key?('collections')
    loaded_results.to_json
  end

  get '/data/*.json' do |n|
    content_type :json
    @@mongo_handle.retrieve_profile(params['splat'].first)
  end

  get '/result/*.html' do |n|
    @json_file = params['splat'].first
    erb :results
  end

  get '/profile/*.html' do |n|
    @json_file = params['splat'].first
    erb :profile
  end

  post '/upload' do

    file = params[:file][:tempfile]
    InspecResultsParser.new(file.read)
    redirect "/"
  end

  get '/' do
    send_file "#{File.dirname(__FILE__)}/www/pages/index.html"
    # @json_file = 'inspec_results.json'
    # erb :results
  end

end

Heimdall.run!
