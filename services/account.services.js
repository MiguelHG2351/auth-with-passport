const AccountModel = require("../database/models/Account");

class AccountServices {
  async createAccount({
    provider,
    userId,
    accountState,
    refreshToken,
    accessToken,
  }) {
    const user = new AccountModel({
      userId,
      provider,
      account_state: accountState,
      access_token: accessToken,
      refresh_token: refreshToken,
    });
    return await user.save();
  }
}

module.exports = AccountServices;
