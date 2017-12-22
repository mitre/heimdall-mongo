FROM ruby:2.4.2

RUN apt-get update -qq && apt-get install -y build-essential

ENV HEIMDALL_ROOT /var/www/heimdall

RUN mkdir -p $HEIMDALL_ROOT

WORKDIR $HEIMDALL_ROOT

ADD Gemfile Gemfile

RUN gem install bundler && bundle install --jobs 20 --retry 5

ADD . .

RUN mv heimdall.rb heimdall.rb.orig
RUN mv heimdall.rb.docker heimdall.rb

RUN mv mongo.rb mongo.rb.orig
RUN mv mongo.rb.docker mongo.rb

# RUN ./heimdall.rb json/inspec_results.json

CMD ["ruby", "heimdall.rb"]

# RUN ruby -run -e httpd ./heimdall.rb -p 4567

EXPOSE 4567
