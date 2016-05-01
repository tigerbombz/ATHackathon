class TestController < ApplicationController
skip_before_action :verify_authenticity_token
 

  def receive 
   

    @message_body = params['Body']
    @from_number = params['From']
    respond "yo"
   #  message = "test" 
   #  number = '+14088323755'
   #  account_sid = 'AC928387fcf9b8b9b04df354947e0e7463'
   #  auth_token = '89cb7d2e94c8e2f991ca61c8e69c39dc'

   #  @client = Twilio::REST::Client.new account_sid, auth_token

   #  # :to would be replaced with invited people's cellphones
   # @client.account.messages.create(
   #     :from => '+15005550006',
   #    :to => "+14088323755" ,
   #    :body => "hi")
   #  render text: response.text 
  end

private
  def respond(message)
    response = Twilio::TwiML::Response.new do |r|
      r.Message message
    end
    render text: response.text
  end

end
