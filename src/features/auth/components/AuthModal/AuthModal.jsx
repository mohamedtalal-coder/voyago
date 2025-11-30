import useAppStore from "../../../../store/auth/useAppStore";
import Modal from "../../../../components/Modal/Modal";
import ForgotPasswordForm from "../ForgotPasswordForm/ForgotPasswordForm";
import LoginForm from "../LoginForm/LoginForm";
import RegisterForm from "../RegisterForm/RegisterForm";

const AuthModal = () => {
  const isAuthModalOpen = useAppStore((state) => state.isAuthModalOpen);
  const authView = useAppStore((state) => state.authView);
  const closeAuthModal = useAppStore((state) => state.closeAuthModal);

  let ContentComponent = null;

  if (authView === "login") {
    ContentComponent = LoginForm;
  } else if (authView === "register") {
    ContentComponent = RegisterForm;
  } else if (authView === "forgot-password") {
    ContentComponent = ForgotPasswordForm;
  }

  if (!isAuthModalOpen || !ContentComponent) {
    return null;
  }

  return (
    <Modal
      isOpen={isAuthModalOpen}
      onClose={closeAuthModal}
    >
      <ContentComponent />
    </Modal>
  );
};

export default AuthModal;
