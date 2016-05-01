require 'twilio-ruby'

Twilio.configure do |config|
  config.account_sid = ENV['twilio_account_sid']
  config.auth_token  = ENV['twilio_auth_token']
end
# client = Twilio::Client.new({ account_sid: ENV['Twilio_Account_Sid'],
#                             auth_token: ENV['Twilio_Auth_Token']
#                           })

# end