import ArticleCardLayout from './components/ArticleCard/ArticleCardsLayout';
import Banner from './components/Banner/banner';
import ContactForm from './components/Contact/contact';

export default function Home() {
 return (
    <>
    <Banner />
    <ArticleCardLayout />
    <section id="contact">
    <ContactForm />
    </section>
  </>
 );
}
