class V0
  module Api
    module Controllers

      get '/system/container_events' do
        content_type "text/event-stream"
        stream do |out|
          system.container_event_stream do |event|
            out.puts "data: #{event.to_json}\n\n"
          end
        end
      end

    end
  end
end
