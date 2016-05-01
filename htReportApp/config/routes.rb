Rails.application.routes.draw do

  root to: 'application#angular'

#twilio routes 
post '/receive_sms' => 'test#receive'

end
