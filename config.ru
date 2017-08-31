require_relative 'v0/module'

# set :root, './'
# map('/api/v0') { run ApiV0 }
map('/') { run V0 }
# map('/') { run Client }

# map "/" do
#     run Client
# end

# map "/api/v0" do
#   run ApiV0
# end
