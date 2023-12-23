import Hero from '../components/Hero/Hero';
import Features from '../components/Features/Features';
import Growth from '../components/Growth/Growth';
import Questions from '../components/Questions/Questions';
import Programs from '../components/Programs/Programs';
import Footer from '../components/Footer/Footer';

import { programs_user } from '../constants/programs_user';
import { programs_shopper } from '../constants/programs_shopper';

function HomeScreen() {
  return (
    <div>
      <Hero />
      <Features />
      <Growth />
      <Questions />
      <Programs programs={programs_user} />
      <Programs programs={programs_shopper} />
    </div>
  );
}
export default HomeScreen;
