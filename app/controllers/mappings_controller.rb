require 'rest-client'
require 'roo'

class MappingsController < ApplicationController

  def show
    @mapping = params
    puts @mapping
    args = {
        data: { mapping: params['id'] },
        headers: { "Content-Type": "application/json" }
    }
    response = RestClient.get 'http://localhost:10010/mappings/mapping', {params: args}
    @mapping_attributes = JSON.parse(response)
    session[:mapping_attributes] = JSON.parse(response)[0].keys
  end

  def edit
    @mapping_attribute = {}
    params.each do |param|
      puts param
      if param != 'controller' and param != 'action'
        @mapping_attribute[param] = params[param]
      end
    end
  end

  def index
    response = RestClient.get 'http://localhost:10010/mappings'
    @mappings = JSON.parse(response)
  end

  def update
    args = {
        data: {
            attributes: {},
            table_name: params['id']
        },
        headers: { "Content-Type": "application/json" }
    }
    session[:mapping_attributes].each do |attribute|
        args[:data][:attributes][attribute] = params[attribute]
    end
    response = RestClient.post 'http://localhost:10010/mappings/mapping', {params: args[:data]}.to_json, {content_type: :json, accept: :json}
    puts response
  end

  def upload
    # puts params['file'].original_filename
    # file = open_spreadsheet(params[:file]).to_csv
    response = RestClient.post 'http://localhost:10010/upload', {multipart: true, :file => params['file']}, {content_type: 'multipart/formData', accept: :json}
  end

  private
  # Use callbacks to share common setup or constraints between actions.
  # def set_mapping
  #   @mapping = Mapping.find(params['800-53'])
  # end

  def open_spreadsheet(file)
    case File.extname(file.original_filename)
      when ".csv" then Csv.new(file.path, nil, :ignore)
      when ".xls" then Excel.new(file.path, nil, :ignore)
      when ".xlsx" then Roo::Spreadsheet.open(file.path, extension: :xlsx)
      else raise "Unknown file type: #{file.original_filename}"
    end
  end
end