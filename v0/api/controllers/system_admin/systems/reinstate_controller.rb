class V0
  module Api
    module Controllers

      put "/system/reinstate" do
        system.reinstate.to_json
      end

    end
  end
end
