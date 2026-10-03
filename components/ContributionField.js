export default function ContributionField({ field, error }) {
  const Tag = field.multiline ? "textarea" : "input";
  return (
    <div className="auth-field">
      <label htmlFor={field.name}>{field.label}{field.required ? " *" : " (optional)"}</label>
      <p className="field-hint" id={`${field.name}-hint`}>
        {field.array ? "One item per line; at least one item. Maximum 500 characters per item."
          : `${field.required ? "1–" : "Maximum "}${field.max} characters.`}
      </p>
      <Tag id={field.name} name={field.name} required={field.required} rows={field.multiline ? 4 : undefined}
        aria-invalid={Boolean(error)} aria-describedby={`${field.name}-hint ${field.name}-error`} />
      <span className="auth-error" id={`${field.name}-error`}>{error}</span>
    </div>
  );
}
