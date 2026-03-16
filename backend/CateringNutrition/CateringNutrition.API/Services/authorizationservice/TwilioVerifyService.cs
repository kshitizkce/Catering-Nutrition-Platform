using Twilio;
using Twilio.Rest.Verify.V2.Service;

namespace CateringNutrition.API.Services.authorizationservice
{
    public class TwilioVerifyService
    {
        private readonly IConfiguration _config;

        public TwilioVerifyService(IConfiguration config)
        {
            _config = config;
        }

        public async Task SendOtp(string phone)
        {
            var accountSid = _config["Twilio:AccountSid"];
            var authToken = _config["Twilio:AuthToken"];
            var serviceSid = _config["Twilio:VerifyServiceSid"];

            TwilioClient.Init(accountSid, authToken);

            await VerificationResource.CreateAsync(
                to: phone,
                channel: "sms",
                pathServiceSid: serviceSid
            );
        }

        public async Task<bool> VerifyOtp(string phone, string code)
        {
            var accountSid = _config["Twilio:AccountSid"];
            var authToken = _config["Twilio:AuthToken"];
            var serviceSid = _config["Twilio:VerifyServiceSid"];

            TwilioClient.Init(accountSid, authToken);

            var verificationCheck = await VerificationCheckResource.CreateAsync(
                to: phone,
                code: code,
                pathServiceSid: serviceSid
            );

            return verificationCheck.Status == "approved";
        }

    }
}
