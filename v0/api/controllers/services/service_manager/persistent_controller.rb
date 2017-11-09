class V0
  module Api
    module Controllers

      # ## Update an existing persistent service consumer
      # put '/services/:service_name/service_manager/persistent/' do
      #   ## Query params: :publisher_namespace, :type_path, :service_handle
      #   set_service(params[:service_name])
      #   @service.update_persistent_service( params[:publisher_namespace], params[:type_path], params[:service_handle], params[:data] ).to_json
      # end
      #
      # ## Delete an existing persistent service consumer
      # delete '/services/:service_name/service_manager/persistent/' do
      #   ## Query params: :publisher_namespace, :type_path, :service_handle
      #   set_service(params[:service_name])
      #   @service.delete_persistent_service( params[:publisher_namespace], params[:type_path], params[:service_handle] ).to_json
      # end
      #
      # ## List available service consumers for a persistent service type
      # get '/services/:service_name/service_manager/persistent/available' do
      #   ## Query params: :publisher_namespace, :type_path
      #   set_service(params[:service_name])
      #   @service.available_persistent_services_for(params[:publisher_namespace], params[:type_path]).to_json
      # end
      #
      # post '/services/:service_name/service_manager/persistent/create_new' do
      #   set_service( params[:service_name] )
      #   @service.create_new_persistent_service( params[:publisher_namespace], params[:type_path], params[:data] ).to_json
      # end
      #
      # post '/services/:service_name/service_manager/persistent/share_existing' do
      #   ## Query params: :publisher_namespace, :type_path, :service_handle
      #   set_service(params[:service_name])
      #   @service.share_existing_persistent_service( params[:publisher_namespace], params[:type_path], params[:service_handle], params[:data] ).to_json
      # end
      #
      # post '/services/:service_name/service_manager/persistent/adopt_orphan' do
      #   ## Query params: :publisher_namespace, :type_path, :service_handle
      #   set_service(params[:service_name])
      #   @service.adopt_orphan_persistent_service( params[:publisher_namespace], params[:type_path], params[:service_handle], params[:data] ).to_json
      # end
      #
      # get '/services/:service_name/service_manager/persistent/export' do
      #   ## Query params: :publisher_namespace, :type_path, :service_handle
      #   set_service(params[:service_name])
      #   send_as_file "engines_data_export_#{@service.name}__"\
      #         "#{params[:publisher_namespace]}_#{params[:type_path].gsub '/', '_'}_"\
      #         "#{params[:service_handle]}__#{Time.now.utc}.gzip",
      #         @service.export_persistent_service( params[:publisher_namespace], params[:type_path], params[:service_handle] )
      # end
      #
      # post '/services/:service_name/service_manager/persistent/import' do
      #   ## Query params: :publisher_namespace, :type_path, :service_handle
      #   set_service(params[:service_name])
      #
      #   @service.import_persistent_service( params[:publisher_namespace], params[:type_path], params[:service_handle], params[:data][:file][:tempfile].read )
      #   # send_as_file "engines_data_export_#{@service.name}__"\
      #   #       "#{params[:publisher_namespace], params[:type_path].gsub '/', '_'}_"\
      #   #       "#{params[:service_handle]}__#{Time.now.utc}.gzip",
      #   #       @service.export_persistent_service( params[:publisher_namespace], params[:type_path], params[:service_handle] )
      # end


    end
  end
end
