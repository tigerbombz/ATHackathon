Rails.application.routes.draw do
#twilio routes 

post '/receive_sms' => 'test#receive'

end
