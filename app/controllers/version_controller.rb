class VersionController < ApplicationController
  def index
    g = Git.open(Rails.root, :log => Logger.new(STDOUT))
    repo = Rugged::Repository.discover(Rails.root)
    version = {
      version: g.describe,
      branch: repo.head.name.split('/').last,
      sha: repo.head.target_id
    }
    render json: version
  end
end
