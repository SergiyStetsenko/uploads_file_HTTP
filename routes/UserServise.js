const User = require("../models/User");

class MenuServise {
  async updateImages(req, res) {
    const { userId } = req.user;
    const { filename } = req.file;

    const update = await User.findOneAndUpdate(
      userId,
      {
        images: `www.gravatar.com/avatar/${filename}?s=300&r=pg&d=mm`,
      },
      { new: true }
    );

    if (!update) {
      console.log(`User is not found`);
    }
    return update;
  }

  async logout(user) {
    const { userId } = user;

    await User.findByIdAndUpdate(userId, { token: null }, { new: true });
  }
}

exports.menuServise = new MenuServise();
