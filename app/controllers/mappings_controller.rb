require 'rest-client'
require 'roo'

class MappingsController < ApplicationController

  def show
    @mapping = params
    @control_1_name = params['id'].split('_')[1] # The primary key in the mapping
    @control_2_name = params['id'].split('_')[2] # The second control that maps to the primary control
    mapping_args = {
        data: { name: params['id'] },
        headers: { "Content-Type": "application/json" }
    }
    control_1_args = {
        data: { name: 'Control_' + @control_1_name },
        headers: { "Content-Type": "application/json" }
    }
    control_2_args = {
        data: { name: 'Control_' + @control_2_name },
        headers: { "Content-Type": "application/json" }
    }
    response = RestClient.get 'http://localhost:10010/mappings/mapping', {params: mapping_args[:data]}
    @control_1 = JSON.parse(RestClient.get 'http://localhost:10010/getControlTable', {params: control_1_args[:data]})
    @control_2 = JSON.parse(RestClient.get 'http://localhost:10010/getControlTable', {params: control_2_args[:data]})
    @mapping_attributes = JSON.parse(response)
    puts @mapping_attributes[0].keys
  end

  def edit
    @mapping_attribute = {}
    puts params
    params.each do |param|
      puts param
      if param != 'controller' and param != 'action'
        @mapping_attribute[param] = params[param]
      end
    end
  end

  def index
    response = RestClient.get 'http://localhost:10010/mappings'
    puts response
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