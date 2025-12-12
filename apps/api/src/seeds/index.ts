import ENV from '../config/ENV';
import seedUsers from './fakes/users.fake';

const seed = async () => {

    if(ENV.NODE_ENV === 'production') {
        console.log('ℹ️ NOTE : Skipped seeding in production environment.');
        return;
    }
  const userSeed = seedUsers(50);

  try{
    await Promise.all([userSeed]);

  }catch (error) {
    console.error('❌ ERROR : Seeding failed.', error);
    throw error;
  }
  console.log('✅ SUCCESS : Seeding completed.');
};

export default seed;
