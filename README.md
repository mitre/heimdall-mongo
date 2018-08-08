# Heimdall

Heimdall is a centralized InSpec evaluations aggregation tool. 

## Description
Heimdall supports viewing of InSpec profiles and evaluations in a convenient
interface.  Data uploads can be automated through usage of curl, and added as
a step after an inspec pipeline stage. 

## Installation 
### Dependencies
You can setup a deployment/development environment through bundler or docker.

If you wish to use docker, then the dependencies are:
  * Docker
  * docker-compose (installable with pip)

If you wish to use ruby and are on ubuntu, then the dependencies are:
  * Ruby 2.4.4
  * build-essentials (your distribution's gcc package)
  * Bundler
  * libpq-dev 
  * nodejs

### Run directly with Ruby (Instead of Docker)

This mode is primarily for developers, shared heimdall instances should be
deployed in production mode.
1. Install dependencies
	On ubuntu: `apt-get install build-essentials libpq-dev nodejs`
2. Install ruby 2.4.4
3. Run the following in a terminal
	1. `bundle install`
	2. `bundle exec rake db:create` 
	3. `bundle exec rake db:migrate`
	4. `bundle exec rails s` Start the server on localhost

### Run With Docker
#### Building Docker Containers
_These steps need to be performed the first time you build the docker
containers, and whenever you edit the code base._

#### Login Configuration
If you would like to use your organization's internal User authentication
service, when deploying the dockerized Heimdall instance, you'll need to edit
config/ldap.yml to point to your organization's LDAP server. *You do not have
to use your internal LDAP. However, people will have to create an account in
Heimdall to perform most actions* You may view ldap.example.yml for how
authentication of people's internal email addresses works with a LDAP server
which allows anonymous access.

#### Manual Build Steps
1. Install Docker
2. Navigate to the base folder where `docker-compose.yml` is located
3. Run the following command in a terminal window from the heimdall source directory:
   * `docker-compose build`  
4. Generate keys for secrets.yml. Use secrets.example.yml for a template.
	_Internally we generate it with the shell script `./gen-secrets.sh` Which
	creates a named volume which is symlinked to config/secrets.yml at runtime.
	If you are deploying this container to a docker swarm please use docker
	secrets as it is far more secure than a named volume._
5. Run the following commands in a terminal window from the heimdall source directory:
	* `docker-compose run web rake db:create`
	* `docker-compose run web rake db:migrate
6. Jump to [Running Docker Container](#running-docker-container)

   
#### Running Docker Container
Once you have the container you can run it with:

1. Run the following command in a terminal window:
   * `docker-compose up -d`
2. Go to `127.0.0.1:3000/heimdall` in a web browser

##### Stopping the Container
`docker-compose down` # From the source directory you started from

## Usage

You can access a Demo instance if you have access to MITRE's intranet at
inspec-dev.mitre.org

Once you have an account you can upload jsons for evaluations and profiles
then view them by clicking on the evaluations and profiles tab at the top of
the page.

To upload through curl you'll need an API key. This is located on your profile
page which can be reached by clicking on your user name in the top right
corner, then on profile.

## Configuration

See docker-compose.yml for container configuration

#### Build container from behind an Intercepting proxy

Contact us for advice, we'll be able to send most people our setup.

#### Host container off relative url

Edit RAILS\_RELATIVE\_URL\_ROOT line from docker-compose.yml

#### Switch container to dev mode

Set RAILS\_ENV = to development in docker-compose.yml

## Development

Clone, edit, then please submit a PR with an issue number associated.

## Licensing and Authors

### Authors
	* Robert Thew 
	* Matthew Dromazos

### License
	* This project is dual-licensed under the terms of the Apache license 2.0 (apache-2.0)
	* This project is dual-licensed under the terms of the Creative Commons Attribution Share Alike 4.0 (cc-by-sa-4.0)
