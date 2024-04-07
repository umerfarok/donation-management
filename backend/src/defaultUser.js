const bcrypt = require('bcrypt');
const User = require('./user'); 

async function createDefaultUser() {
  console.log('Creating default user...');
  try {
    const existingUser = await User.findOne({ email: 'admin@masjid.com' });
    if (existingUser) {
      console.log('Default user already exists');
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin@123', salt);

    const defaultUser = new User({
      name: 'majid ',
      lastName: 'Admin',
      email: 'admin@masjid.com',
      password: hashedPassword,
      // teamName: 'Default Team',
      // money: 0,
      approved: true,});

    const savedUser = await defaultUser.save();
    console.log('Default user created:', savedUser);
  } catch (error) {
    console.error('Error creating default user:', error);
  }
}

module.exports = createDefaultUser;