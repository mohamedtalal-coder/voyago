import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './NotFoundScreen.css';

const NotFoundPage = () => {
  const { t } = useTranslation('static');

  return (
    <main className="not-found-page">
      <h1 className="not-found-page__title">{t('notFound.title')}</h1>
      <p className="not-found-page__message">{t('notFound.description')}</p>
      <Link to="/" className="not-found-page__link">
        {t('notFound.backHome')}
      </Link>
    </main>
  );
};

export default NotFoundPage;

