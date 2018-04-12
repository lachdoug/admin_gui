class V0
  module Api
    module Controllers

      get '/system/container_events' do
        content_type "text/event-stream"
        user = current_user( skip_timeout: true )
        stream do |out|
          system.container_event_stream do |event|
            unless user.signin_timeout?
              begin
                out.puts "data: #{event.to_json}\n\n"
              rescue => e
                if out.closed?
                  puts "Client closed event stream"
                  break
                else
                  raise e
                end
              end
            else
              out.close
              puts "Event stream closed due to user timeout."
              break
            end
          end

        end
      end

    end
  end
end
