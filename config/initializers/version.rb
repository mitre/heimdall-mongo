# config/initializers/version.rb

if Rails.env.development?
    # we will hae to use both the `git` and `rugged` gem until
    # rugged implaments `git describe`
    g = Git.open(Rails.root)
    repo = Rugged::Repository.discover(Rails.root)

    version = {
        version: g.describe,
        branch: repo.head.name.split('/').last,
        sha: repo.head.target_id
    }

  File.open('config/VERSION','w') do |f|
     f.write(JSON.pretty_generate(version))
  end
end

module MyApp
  # Read JSON from a file, iterate over objects
  parsed = JSON.parse(File.read('config/VERSION'), :symbolize_names => true)
  VERSION = parsed[:version]
  BRANCH = parsed[:branch]
  SHA = parsed[:sha]
end