FROM ruby:2.4.2

ENV http_proxy=http://gatekeeper.mitre.org:80
ENV https_proxy=http://gatekeeper.mitre.org:80
ENV HTTP_PROXY=http://gatekeeper.mitre.org:80
ENV HTTPS_PROXY=http://gatekeeper.mitre.org:80

RUN apt-get update -qq && apt-get install -y build-essential

ENV HEIMDALL_ROOT /var/www/heimdall

RUN mkdir -p $HEIMDALL_ROOT

WORKDIR $HEIMDALL_ROOT

ADD Gemfile Gemfile

RUN gem install bundler && bundle install --jobs 20 --retry 5

ADD . .

# RUN ./heimdall.rb json/inspec_results.json

CMD ["ruby", "heimdall.rb"]

# RUN ruby -run -e httpd ./heimdall.rb -p 4567

EXPOSE 4567
