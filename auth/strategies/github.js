const GitHubStrategy = require("passport-github2");
const axios = require('axios').default

module.exports = function init(passport) {
  passport.use(
    new GitHubStrategy(
      {
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: `${process.env["CALLBACK_URL"]}auth/github/callback`,
        passReqToCallback: true,
      },
      function (req, accessToken, refreshToken, profile, done) {
        // console.log(profile)
        axios.get('https://api.github.com/user/emails', {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Accept': 'application/vnd.github+json',
            'X-GitHub-Api-Version': '2022-11-28',
            "Access-Control-Allow-Origin": "*"
          }
        }).then(data => {
          const email = data.data.find(email => email.primary)
          // console.log('Get data')
          // console.log(data)
          done(null, {
            profile: profile._json,
            email: email
          })
        })
      }
    )
  )
}
// ;Google
// profile.id
// profile.provider
// profile.email
// profile.photos[0].value
// not: profile.username but i'm using given_name.trim().replaceAll(' ', '').toLowerCase()

// Github
// profile.id
// profile.provider
// profile.email
// profile.username

// curl \
//   -H "Accept: application/vnd.github+json" \
//   -H "Authorization: Bearer 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"\
//   -H "X-GitHub-Api-Version: 2022-11-28" \
//   https://api.github.com/user/emails

// curl \
//   -H "Accept: application/vnd.github+json" \
//   -H "Authorization: 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"\
//   -H "X-GitHub-Api-Version: 2022-11-28" \
//   https://api.github.com/user/emails

// gh api --method PATCH -H "Accept: application/vnd.github+json" /user/email/visibility -f visibility='private' 
// gh api -H "Accept: application/vnd.github+json" /user/emails
