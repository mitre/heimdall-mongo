FROM ruby:2.4.4
RUN curl -o /usr/local/share/ca-certificates/MITRE_BA_Root.crt http://pki.mitre.org/MITRE%20BA%20Root.crt
RUN curl -o /usr/local/share/ca-certificates/MITRE_BA_NPE_CA-1.crt http://pki.mitre.org/MITRE%20BA%20NPE%20CA-1.crt
RUN curl -o /usr/local/share/ca-certificates/MITRE_BA_NPE_CA-3.crt http://pki.mitre.org/MITRE%20BA%20NPE%20CA-3.crt
RUN update-ca-certificates
ENV http_proxy=http://gatekeeper.mitre.org:80
ENV https_proxy=http://gatekeeper.mitre.org:80
ENV no_proxy=localhost,127.0.0.1,.mitre.org
RUN echo "Acquire::http::Proxy \"http://gatekeeper.mitre.org:80\";" >> /etc/apt/apt.conf


RUN apt-get update -qq && apt-get install -y build-essential libpq-dev nodejs

ENV RAILS_ROOT /var/www/heimdall

RUN mkdir -p $RAILS_ROOT/tmp/pids

WORKDIR $RAILS_ROOT

ADD Gemfile Gemfile

RUN gem install bundler && bundle install --jobs 20 --retry 5

# Deploy production server to container
ENV RAILS_ENV production
ENV RAILS_RELATIVE_URL_ROOT /heimdall

ADD . .

RUN mv config/mongoid.yml config/mongoid.yml.orig
RUN mv config/mongoid.yml.docker config/mongoid.yml

# Generate secrets, potentially not if it already exists and is well formatted
RUN ./gen-secrets.sh

# precompile is only necessary for production builds
RUN bundle exec rake assets:precompile

RUN env

EXPOSE 3000

CMD ["bundle", "exec", "rails", "server", "-p", "3000", "-b", "0.0.0.0"]
