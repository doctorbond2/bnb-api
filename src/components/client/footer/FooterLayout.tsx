'use client';
import { useUserContext } from '@/context/UserContext';
export default function FooterLayout() {
  const { user } = useUserContext();
  const userStatus = () => {
    if (user) {
      return (
        <div className="footer__content__left">
          <div className="footer__content__left__text">
            <p>
              Welcome, {user.fullName}! You are logged in as{' '}
              {user.admin ? 'admin' : 'user'}.
            </p>
          </div>
        </div>
      );
    }
  };
  return (
    <footer className="footer">
      <div className="container">
        {userStatus()}
        <div className="footer__content">
          <div className="footer__content__left">
            <div className="footer__content__left__text">
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                pulvinar, nunc nec feugiat.
              </p>
            </div>
          </div>
          <div className="footer__content__right">
            <div className="footer__content__right__title">
              <h3>Quick Links</h3>
            </div>
            <div className="footer__content__right__links">
              <ul>
                <li>
                  <a href="#">Home</a>
                </li>
                <li>
                  <a href="#">About</a>
                </li>
                <li>
                  <a href="#">Services</a>
                </li>
                <li>
                  <a href="#">Contact</a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
