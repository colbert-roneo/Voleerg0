const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <span className="footer-text">© {new Date().getFullYear()} Voleergo. All rights reserved.</span>
        <span className="footer-text">Built with ❤️ using MERN Stack</span>
      </div>
    </footer>
  );
};

export default Footer;
