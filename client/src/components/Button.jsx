export default function Button(props) {
  const {
    variant = "primary",
    type = "button",
    text,
    onClick,
    className = "",
    size,
    children,
    disabled = false,
    loading = false,
    block = false,
    outline = false,
    ...rest
  } = props;

  // Build button className
  let buttonClassName = "btn";

  // Handle outline variants
  if (outline) {
    buttonClassName += ` btn-outline-${variant}`;
  } else if (variant === "aesop") {
    // Custom Aesop variant
    buttonClassName += " btn-aesop";
  } else {
    buttonClassName += ` btn-${variant}`;
  }

  // Add size if provided
  if (size) {
    buttonClassName += ` btn-${size}`;
  }

  // Add block (full width) if provided
  if (block) {
    buttonClassName += " w-100";
  }

  // Add disabled state styling
  if (disabled || loading) {
    buttonClassName += " disabled";
  }

  // Add additional className if provided
  if (className) {
    buttonClassName += ` ${className}`;
  }

  return (
    <button
      className={buttonClassName}
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      {...rest}
    >
      {loading ? (
        <>
          <span
            className="spinner-border spinner-border-sm me-2"
            role="status"
            aria-hidden="true"
          ></span>
          Loading...
        </>
      ) : (
        children || text
      )}
    </button>
  );
}
