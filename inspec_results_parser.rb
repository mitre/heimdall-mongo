#!/usr/bin/env ruby

# encoding: utf-8
# author: Aaron Lippold
# author: Rony Xavier rx294@nyu.edu

require 'nokogiri'
require 'json'
require_relative 'mongo.rb'

DATA_NOT_FOUND_MESSAGE = 'N/A'

class InspecResultsParser
  def initialize(inspec_json)
    begin
      @data = parse_json(inspec_json)
      @mdb = Mongo_DB.new
      @mdb.insert_profile(@data)
      File.write("#{File.dirname(__FILE__)}/www/data/inspec_results.json", @data.to_json)
    rescue => err
      puts "Exception: #{err}"
      # abort
    end
    puts "\nProcessed #{@data.keys.count} controls"
  end

  def clk_status(control)
    puts 'Full Status list: ' + control[:status].join(', ') if @verbose
    status_list = control[:status].uniq
    if status_list.include?('failed')
      result = 'Open'
    elsif status_list.include?('passed')
      result = 'NotAFinding'
    elsif status_list.include?('skipped')
      result = 'Not_Reviewed'
    else
      result = 'Not_Tested'
    end
    if control[:impact].to_f.zero?
      result = 'Not_Applicable'
    end
    result
  end

  def clk_finding_details(control)
    result = "One or more of the automated tests failed or was inconclusive for the control \n\n #{control[:message].sort.join}" if control[:result] == 'Open'
    result = "All Automated tests passed for the control \n\n #{control[:message].join}" if control[:result] == 'NotAFinding'
    result = "Automated test skipped due to known accepted condition in the control : \n\n#{control[:message].join}" if control[:result] == 'Not_Reviewed'
    result = "Justification: \n #{control[:message].split.join(' ')}" if control[:result] == 'Not_Applicable'
    result = 'No test available for this control' if control[:result] == 'Not_Tested'
    result
  end


  def parse_json(json)
    results_json = Hash.new
    file = JSON.parse(json)
    controls = []
    if file['profiles'].nil?
      controls = file['controls']
      results_json['profile_name'] = 'profile;'+ file['name'] + ': ' + file['version']
    elsif file['profiles'].length == 1
      controls = file['profiles'].last['controls']
      results_json['profile_name'] = 'result;'+ file['profiles'].last['name'] + ': ' + file['controls'].first['start_time'].split[0..1].join(' ')
    else
      file['profiles'].each do |profile|
        controls.concat(profile['controls'])
      end
      results_json['profile_name'] = 'result;'+ 'Overlay' + ': ' + file['controls'].first['start_time'].split[0..1].join(' ')
    end
    data = {}

    controls.each do |control|
      c_id = control['id'].to_sym
      data[c_id] = {}
      data[c_id][:vuln_num]       = control['id']    || DATA_NOT_FOUND_MESSAGE
      data[c_id][:rule_title]     = control['title'] || DATA_NOT_FOUND_MESSAGE
      data[c_id][:vuln_discuss]   = control['desc'] || DATA_NOT_FOUND_MESSAGE
      data[c_id][:severity]       = control['tags']['severity'] || DATA_NOT_FOUND_MESSAGE
      data[c_id][:gid]            = control['tags']['gid'] || DATA_NOT_FOUND_MESSAGE
      data[c_id][:group_title]    = control['tags']['gtitle'] || DATA_NOT_FOUND_MESSAGE
      data[c_id][:rule_id]        = control['tags']['rid'] || DATA_NOT_FOUND_MESSAGE
      data[c_id][:rule_ver]       = control['tags']['stig_id'] || DATA_NOT_FOUND_MESSAGE
      data[c_id][:cci_ref]        = control['tags']['cci'] || DATA_NOT_FOUND_MESSAGE
      data[c_id][:nist]           = control['tags']['nist'] || ['unmapped']
      data[c_id][:check_content]  = control['tags']['check'] || DATA_NOT_FOUND_MESSAGE
      data[c_id][:fix_text]       = control['tags']['fix'] || DATA_NOT_FOUND_MESSAGE

      data[c_id][:rationale]       = control['tags']['rationale'] || DATA_NOT_FOUND_MESSAGE
      data[c_id][:cis_family]       = control['tags']['cis_family'] || DATA_NOT_FOUND_MESSAGE
      data[c_id][:cis_rid]       = control['tags']['cis_rid'] || DATA_NOT_FOUND_MESSAGE
      data[c_id][:cis_level]       = control['tags']['cis_level'] || DATA_NOT_FOUND_MESSAGE

      data[c_id][:impact]         = control['impact'].to_s || DATA_NOT_FOUND_MESSAGE
      data[c_id][:code]           = control['code'].to_s || DATA_NOT_FOUND_MESSAGE

      data[c_id][:status] = []
      data[c_id][:message] = []
      if control.key?('results')
        control['results'].each do |result|
          data[c_id][:status].push(result['status'])
          data[c_id][:message].push(result['skip_message']) if result['status'] == 'skipped'
          data[c_id][:message].push("FAILED -- Test: #{result['code_desc']}\nMessage: #{result['message']}\n") if result['status'] == 'failed'
          data[c_id][:message].push("PASS -- #{result['code_desc']}\n") if result['status'] == 'passed'
        end
      end
      if data[c_id][:impact].to_f.zero?
        data[c_id][:message] = control['desc']
      end
      data[c_id][:result]           = clk_status(data[c_id])
      data[c_id][:finding_details]  = clk_finding_details(data[c_id])
    end

    results_json['controls'] = data.values
    results_json
  end
end
