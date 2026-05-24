function Card(props) {
  const { variant, extra, children, ...rest } = props;
  return (
    <div
      className={`!z-5 relative flex flex-col glass-card ${extra || ""}`}
      {...rest}
    >
      {children}
    </div>
  );
}

export default Card;
